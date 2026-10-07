import type { FenceHeight, GatesType, PostType, RailType, SheetingType } from './measurement';

export interface MaterialPrices {
  postStock6m: Record<PostType, number>;
  gatePostStock6m: number;
  railStock6m: Record<RailType, number>;
  sheet: Record<SheetingType, Record<FenceHeight, number>>;
  stonePerKg: number;
  screwEach: number;
  capEach: number;
  generatorRent: number;
}

export interface LaborRates {
  ratePerMeter: number;
  gatesInstall: Record<Exclude<GatesType, 'none'>, number>;
  wicketInstall: number;
  automationInstall: number;
  demolitionPerMeter: number;
  hardSoilDrillingMultiplier: number;
}

export interface MarginSettings {
  targetMargin: number;
  minMargin: number;
  deliveryCost: number;
}

export interface PriceCatalog {
  updatedAt: string;
  materials: MaterialPrices;
  labor: LaborRates;
  margin: MarginSettings;
}
