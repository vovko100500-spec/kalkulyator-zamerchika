import type { PriceCatalog } from '../../types/catalog';
import type { GeometryResult, LaborLineItem, LaborResult } from '../../types/calculation';
import type { MeasurementInput } from '../../types/measurement';

export function calculateLabor(
  input: MeasurementInput,
  catalog: PriceCatalog,
  geometry: GeometryResult,
): LaborResult {
  const items: LaborLineItem[] = [];
  const drillingMultiplier = input.hardSoil
    ? catalog.labor.hardSoilDrillingMultiplier
    : 1;

  const fenceLaborCost = geometry.netLength * catalog.labor.ratePerMeter * drillingMultiplier;
  items.push({
    id: 'fence-install',
    name: 'Монтаж ограждения',
    quantity: geometry.netLength,
    unit: 'м',
    unitPrice: catalog.labor.ratePerMeter * drillingMultiplier,
    totalPrice: fenceLaborCost,
  });

  if (input.gatesType !== 'none') {
    const unitPrice = catalog.labor.gatesInstall[input.gatesType];
    items.push({
      id: 'gates-install',
      name: `Монтаж ворот (${input.gatesType})`,
      quantity: 1,
      unit: 'компл',
      unitPrice,
      totalPrice: unitPrice,
    });
  }

  if (input.wicketsCount > 0) {
    const unitPrice = catalog.labor.wicketInstall;
    items.push({
      id: 'wicket-install',
      name: 'Монтаж калитки',
      quantity: input.wicketsCount,
      unit: 'шт',
      unitPrice,
      totalPrice: input.wicketsCount * unitPrice,
    });
  }

  if (input.gatesAutomation && input.gatesType !== 'none') {
    const unitPrice = catalog.labor.automationInstall;
    items.push({
      id: 'automation-install',
      name: 'Установка автоматики ворот',
      quantity: 1,
      unit: 'компл',
      unitPrice,
      totalPrice: unitPrice,
    });
  }

  if (input.demolitionLength > 0) {
    const unitPrice = catalog.labor.demolitionPerMeter;
    items.push({
      id: 'demolition',
      name: 'Демонтаж старого ограждения',
      quantity: input.demolitionLength,
      unit: 'м',
      unitPrice,
      totalPrice: input.demolitionLength * unitPrice,
    });
  }

  const totalCost = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    items,
    totalCost,
  };
}
