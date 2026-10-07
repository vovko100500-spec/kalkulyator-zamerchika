import type {
  FoundationType,
  GatesType,
  HoleDepth,
  PostType,
  RailType,
  SheetingType,
  WicketLock,
} from '../../types/measurement';

export const SHEETING_LABELS: Record<SheetingType, string> = {
  sheet_c8: 'Профнастил С8',
  sheet_mp20: 'Профнастил МП20',
  picket_single: 'Евроштакетник (односторонний)',
  picket_double: 'Евроштакетник (шахматка)',
  grid_3d: 'Панель 3D',
};

export const POST_LABELS: Record<PostType, string> = {
  pipe_60x40x2: '60×40×2',
  pipe_60x60x2: '60×60×2',
  pipe_60x60x3: '60×60×3',
  pipe_80x80x3: '80×80×3',
  pipe_100x100x3: '100×100×3',
};

export const RAIL_LABELS: Record<RailType, string> = {
  pipe_40x20x1_5: '40×20×1.5',
  pipe_40x20x2: '40×20×2',
};

export const GATES_LABELS: Record<GatesType, string> = {
  none: 'Без ворот',
  swing_4m: 'Распашные ворота 4 м',
  sliding_4m: 'Откатные ворота 4 м',
  sliding_5m: 'Откатные ворота 5 м',
};

export const FOUNDATION_LABELS: Record<FoundationType, string> = {
  ramming_stone: 'Забутовка щебнем',
  concreting: 'Бетонирование',
  screw_piles: 'Винтовые сваи',
};

export const HOLE_DEPTH_LABELS: Record<HoleDepth, string> = {
  1.0: 'до 1 м',
  1.5: 'до 1.5 м',
};

export const WICKET_LOCK_LABELS: Record<WicketLock, string> = {
  mechanical: 'Механический',
  electromechanical: 'Электромеханический',
};

export function formatRub(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`;
}
