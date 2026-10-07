import type { PriceCatalog } from '../../types/catalog';
import type { FinancialResult, LaborResult, MaterialsResult } from '../../types/calculation';

export function calculateFinancial(
  materials: MaterialsResult,
  labor: LaborResult,
  catalog: PriceCatalog,
): FinancialResult {
  const materialCost = materials.totalCost;
  const laborCost = labor.totalCost;
  const deliveryCost = catalog.margin.deliveryCost;
  const totalCost = materialCost + laborCost + deliveryCost;
  const recommendedPrice = Math.round(totalCost / (1 - catalog.margin.targetMargin));
  const minPrice = Math.round(totalCost / (1 - catalog.margin.minMargin));
  const profit = recommendedPrice - totalCost;

  return {
    materialCost,
    laborCost,
    deliveryCost,
    totalCost,
    recommendedPrice,
    minPrice,
    profit,
  };
}
