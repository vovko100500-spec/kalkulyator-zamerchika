import type { FenceHeight, PostType, RailType, SheetingType } from '../../types/measurement';

export const POST_TYPE_LABELS: Record<PostType, string> = {
  pipe_60x40x2: '60×40×2 (хлыст 6 м)',
  pipe_60x60x2: '60×60×2 (хлыст 6 м)',
  pipe_60x60x3: '60×60×3 (хлыст 6 м)',
  pipe_80x80x3: '80×80×3 (хлыст 6 м)',
  pipe_100x100x3: '100×100×3 (хлыст 6 м)',
};

export const RAIL_TYPE_LABELS: Record<RailType, string> = {
  pipe_40x20x1_5: '40×20×1.5 (хлыст 6 м)',
  pipe_40x20x2: '40×20×2 (хлыст 6 м)',
};

export const SHEETING_TYPE_LABELS: Record<SheetingType, string> = {
  sheet_c8: 'Профнастил С8',
  sheet_mp20: 'Профнастил МП20',
  picket_single: 'Штакетник односторонний',
  picket_double: 'Штакетник шахматка',
  grid_3d: 'Сетка 3D',
};

export const FENCE_HEIGHTS: FenceHeight[] = [1.5, 1.8, 2.0, 2.2, 2.5];

export const GATE_INSTALL_LABELS = {
  swing_4m: 'Распашные ворота 4 м',
  sliding_4m: 'Откатные ворота 4 м',
  sliding_5m: 'Откатные ворота 5 м',
} as const;
