import type { CalculationResult } from './calculation';
import type { PriceCatalog } from './catalog';
import type { MeasurementInput } from './measurement';

export const CATALOG_RECORD_ID = 1;

export interface CatalogRecord {
  id: number;
  catalog: PriceCatalog;
}

export interface SavedEstimateRecord {
  id?: number;
  createdAt: string;
  label?: string;
  input: MeasurementInput;
  result: CalculationResult;
}
