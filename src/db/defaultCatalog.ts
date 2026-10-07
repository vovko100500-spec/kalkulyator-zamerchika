import type { PriceCatalog } from '../types/catalog';

export const defaultCatalog: PriceCatalog = {
  updatedAt: '2026-10-01',
  materials: {
    postStock6m: {
      pipe_60x40x2: 2400,
      pipe_60x60x2: 2800,
      pipe_60x60x3: 3200,
      pipe_80x80x3: 4200,
      pipe_100x100x3: 5500,
    },
    gatePostStock6m: 4500,
    railStock6m: {
      pipe_40x20x1_5: 950,
      pipe_40x20x2: 1200,
    },
    sheet: {
      sheet_c8: { 1.5: 1400, 1.8: 1650, 2.0: 1800, 2.2: 1980, 2.5: 2200 },
      sheet_mp20: { 1.5: 1550, 1.8: 1800, 2.0: 1950, 2.2: 2150, 2.5: 2400 },
      picket_single: { 1.5: 120, 1.8: 140, 2.0: 155, 2.2: 170, 2.5: 190 },
      picket_double: { 1.5: 120, 1.8: 140, 2.0: 155, 2.2: 170, 2.5: 190 },
      grid_3d: { 1.5: 3200, 1.8: 3600, 2.0: 4000, 2.2: 4400, 2.5: 4800 },
    },
    stonePerKg: 8,
    screwEach: 3,
    capEach: 25,
    generatorRent: 3500,
  },
  labor: {
    ratePerMeter: 850,
    gatesInstall: {
      swing_4m: 12000,
      sliding_4m: 18000,
      sliding_5m: 21000,
    },
    wicketInstall: 4500,
    automationInstall: 15000,
    demolitionPerMeter: 300,
    hardSoilDrillingMultiplier: 1.3,
  },
  margin: {
    targetMargin: 0.35,
    minMargin: 0.25,
    deliveryCost: 8000,
  },
};
