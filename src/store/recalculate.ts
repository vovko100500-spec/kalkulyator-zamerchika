import { calculateEstimate } from '../logic/calculator';
import type { CalculationResult } from '../types/calculation';
import type { PriceCatalog } from '../types/catalog';
import type { MeasurementInput } from '../types/measurement';

export function buildEstimate(
  draft: MeasurementInput,
  catalog: PriceCatalog | null,
): CalculationResult | null {
  if (!catalog) {
    return null;
  }

  return calculateEstimate(draft, catalog);
}
