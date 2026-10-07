import type { PriceCatalog } from '../../types/catalog';
import type { MaterialLineItem, MaterialsResult } from '../../types/calculation';
import type { MeasurementInput } from '../../types/measurement';
import { POST_LABELS, RAIL_LABELS } from '../formatters/labels';
import { calculateBulkMaterials } from './bulkMaterials';
import { calculateGeometry } from './geometry';

const SHEET_USEFUL_WIDTH: Record<'sheet_c8' | 'sheet_mp20', number> = {
  sheet_c8: 1.15,
  sheet_mp20: 1.1,
};

const SCREW_RESERVE_FACTOR = 1.1;
const PICKET_PITCH_M = 0.13;
const PICKET_DOUBLE_FACTOR = 1.85;

function getSheetsCount(input: MeasurementInput, netLength: number): number {
  if (input.sheetingType === 'sheet_c8' || input.sheetingType === 'sheet_mp20') {
    const usefulWidth = SHEET_USEFUL_WIDTH[input.sheetingType];
    return Math.ceil(netLength / usefulWidth);
  }

  return 0;
}

function getPicketCount(input: MeasurementInput, netLength: number): number {
  if (input.sheetingType === 'picket_single') {
    return Math.ceil(netLength / PICKET_PITCH_M);
  }

  if (input.sheetingType === 'picket_double') {
    return Math.ceil(netLength / PICKET_PITCH_M) * PICKET_DOUBLE_FACTOR;
  }

  return 0;
}

export function calculateMaterials(
  input: MeasurementInput,
  catalog: PriceCatalog,
): MaterialsResult {
  const geometry = calculateGeometry(input);
  const bulk = calculateBulkMaterials(input, geometry);
  const sheetsCount = getSheetsCount(input, geometry.netLength);
  const picketCount = getPicketCount(input, geometry.netLength);
  const { totalStoneKg, totalCementKg, totalSandKg, totalNetVolumeM3 } = bulk;
  const screwsCount = Math.ceil(
    sheetsCount * input.railRows * 4 * SCREW_RESERVE_FACTOR,
  );
  const capsCount = geometry.fencePostsCount + geometry.gatePostsCount;
  const items: MaterialLineItem[] = [];

  if (geometry.stockPostsCount > 0) {
    const unitPrice = catalog.materials.postStock6m[input.postType];
    items.push({
      id: 'fence-posts',
      name: `Столбы забора ${POST_LABELS[input.postType]} (хлыст 6 м)`,
      quantity: geometry.stockPostsCount,
      unit: 'шт',
      unitPrice,
      totalPrice: geometry.stockPostsCount * unitPrice,
    });
  }

  if (geometry.gatePostsCount > 0) {
    const unitPrice = catalog.materials.gatePostStock6m;
    items.push({
      id: 'gate-posts',
      name: 'Усиленные столбы ворот/калитки 80×80 (хлыст 6 м)',
      quantity: geometry.gatePostsCount,
      unit: 'шт',
      unitPrice,
      totalPrice: geometry.gatePostsCount * unitPrice,
    });
  }

  if (geometry.stockRailsCount > 0) {
    const unitPrice = catalog.materials.railStock6m[input.railType];
    items.push({
      id: 'rails',
      name: `${RAIL_LABELS[input.railType]} (хлыст 6 м)`,
      quantity: geometry.stockRailsCount,
      unit: 'шт',
      unitPrice,
      totalPrice: geometry.stockRailsCount * unitPrice,
    });
  }

  if (sheetsCount > 0) {
    const unitPrice = catalog.materials.sheet[input.sheetingType][input.height];
    items.push({
      id: 'sheeting',
      name: `Полотно ${input.sheetingType}, H=${input.height} м`,
      quantity: sheetsCount,
      unit: 'лист',
      unitPrice,
      totalPrice: sheetsCount * unitPrice,
    });
  }

  if (picketCount > 0) {
    const unitPrice = catalog.materials.sheet[input.sheetingType][input.height];
    items.push({
      id: 'pickets',
      name: `Штакетник ${input.sheetingType}, H=${input.height} м`,
      quantity: picketCount,
      unit: 'шт',
      unitPrice,
      totalPrice: Math.ceil(picketCount) * unitPrice,
    });
  }

  if (input.foundationType === 'ramming_stone' && totalStoneKg > 0) {
    const unitPrice = catalog.materials.stonePerKg;
    items.push({
      id: 'stone',
      name: 'Щебень для забутовки',
      quantity: totalStoneKg,
      unit: 'кг',
      unitPrice,
      totalPrice: totalStoneKg * unitPrice,
    });
  }

  if (input.foundationType === 'concreting' && totalCementKg > 0) {
    const cementPrice = catalog.materials.cementPerKg;
    items.push({
      id: 'cement',
      name: 'Цемент М500 (раствор под столбы)',
      quantity: totalCementKg,
      unit: 'кг',
      unitPrice: cementPrice,
      totalPrice: totalCementKg * cementPrice,
    });
  }

  if (input.foundationType === 'concreting' && totalSandKg > 0) {
    const sandPrice = catalog.materials.sandPerKg;
    items.push({
      id: 'sand',
      name: 'Песок (раствор под столбы)',
      quantity: totalSandKg,
      unit: 'кг',
      unitPrice: sandPrice,
      totalPrice: totalSandKg * sandPrice,
    });
  }

  if (screwsCount > 0) {
    const unitPrice = catalog.materials.screwEach;
    items.push({
      id: 'screws',
      name: 'Саморезы кровельные',
      quantity: screwsCount,
      unit: 'шт',
      unitPrice,
      totalPrice: screwsCount * unitPrice,
    });
  }

  if (capsCount > 0) {
    const unitPrice = catalog.materials.capEach;
    items.push({
      id: 'caps',
      name: 'Заглушки пластиковые на столбы',
      quantity: capsCount,
      unit: 'шт',
      unitPrice,
      totalPrice: capsCount * unitPrice,
    });
  }

  if (input.noElectricity) {
    const unitPrice = catalog.materials.generatorRent;
    items.push({
      id: 'generator',
      name: 'Аренда бензогенератора',
      quantity: 1,
      unit: 'смена',
      unitPrice,
      totalPrice: unitPrice,
    });
  }

  const totalCost = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    geometry,
    sheetsCount,
    picketCount,
    totalNetVolumeM3,
    totalStoneKg,
    totalCementKg,
    totalSandKg,
    screwsCount,
    capsCount,
    items,
    totalCost,
  };
}
