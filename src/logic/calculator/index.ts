import type { PriceCatalog } from '../../types/catalog';
import type { CalculationResult } from '../../types/calculation';
import type { MeasurementInput } from '../../types/measurement';
import { calculateMaterials } from './materials';
import { calculateLabor } from './labor';
import { calculateFinancial } from './pricing';

export { calculateGeometry, getGatePostsCount, getGatesWidth } from './geometry';
export { calculateMaterials } from './materials';
export { calculateLabor } from './labor';
export { calculateFinancial } from './pricing';

export function calculateEstimate(
  input: MeasurementInput,
  catalog: PriceCatalog,
): CalculationResult {
  const materials = calculateMaterials(input, catalog);
  const labor = calculateLabor(input, catalog, materials.geometry);
  const financial = calculateFinancial(materials, labor, catalog);

  return {
    input,
    geometry: materials.geometry,
    materials,
    labor,
    financial,
  };
}
