import type { MeasurementInput } from '../types/measurement';

export const defaultMeasurementInput: MeasurementInput = {
  perimeter: 60,
  height: 2.0,
  postStep: 2.5,
  sheetingType: 'sheet_c8',
  postType: 'pipe_60x40x2',
  railType: 'pipe_40x20x2',
  railRows: 2,
  foundationType: 'ramming_stone',
  holeDepth: 1.0,
  gatesType: 'sliding_4m',
  gatesAutomation: false,
  wicketsCount: 1,
  wicketLock: 'mechanical',
  demolitionLength: 0,
  hardSoil: false,
  noElectricity: false,
};
