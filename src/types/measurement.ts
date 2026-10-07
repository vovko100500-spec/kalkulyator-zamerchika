export type FenceHeight = 1.5 | 1.8 | 2.0 | 2.2 | 2.5;
export type PostStep = 2.0 | 2.5 | 3.0;
export type SheetingType =
  | 'sheet_c8'
  | 'sheet_mp20'
  | 'picket_single'
  | 'picket_double'
  | 'grid_3d';
export type PostType =
  | 'pipe_60x40x2'
  | 'pipe_60x60x2'
  | 'pipe_60x60x3'
  | 'pipe_80x80x3'
  | 'pipe_100x100x3';
export type RailType = 'pipe_40x20x1_5' | 'pipe_40x20x2';
export type RailRows = 2 | 3;
export type FoundationType = 'ramming_stone' | 'concreting' | 'screw_piles';
export type HoleDepth = 1.0 | 1.5;
export type GatesType = 'none' | 'swing_4m' | 'sliding_4m' | 'sliding_5m';
export type WicketLock = 'mechanical' | 'electromechanical';

export interface MeasurementInput {
  perimeter: number;
  height: FenceHeight;
  postStep: PostStep;
  sheetingType: SheetingType;
  postType: PostType;
  railType: RailType;
  railRows: RailRows;
  foundationType: FoundationType;
  holeDepth: HoleDepth;
  gatesType: GatesType;
  gatesAutomation: boolean;
  wicketsCount: 0 | 1 | 2;
  wicketLock: WicketLock;
  demolitionLength: number;
  hardSoil: boolean;
  noElectricity: boolean;
}
