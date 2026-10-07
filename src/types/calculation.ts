import type { MeasurementInput } from './measurement';

export interface GeometryResult {
  gatesWidth: number;
  netLength: number;
  fencePostsCount: number;
  gatePostsCount: number;
  totalPostsCount: number;
  postLength: number;
  stockPostsCount: number;
  rawRailsMeters: number;
  stockRailsCount: number;
}

export interface MaterialsResult {
  geometry: GeometryResult;
  sheetsCount: number;
  picketCount: number;
  totalNetVolumeM3: number;
  totalStoneKg: number;
  totalCementKg: number;
  totalSandKg: number;
  screwsCount: number;
  capsCount: number;
  items: MaterialLineItem[];
  totalCost: number;
}

export interface MaterialLineItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface LaborLineItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface LaborResult {
  items: LaborLineItem[];
  totalCost: number;
}

export interface FinancialResult {
  materialCost: number;
  laborCost: number;
  deliveryCost: number;
  totalCost: number;
  recommendedPrice: number;
  minPrice: number;
  profit: number;
}

export interface CalculationResult {
  input: MeasurementInput;
  geometry: GeometryResult;
  materials: MaterialsResult;
  labor: LaborResult;
  financial: FinancialResult;
}
