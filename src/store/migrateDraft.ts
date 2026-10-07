import type { HoleDepth, MeasurementInput, PostType } from '../types/measurement';
import { defaultMeasurementInput } from './defaults';

const VALID_POST_TYPES = new Set<PostType>([
  'pipe_60x40x2',
  'pipe_60x60x2',
  'pipe_60x60x3',
  'pipe_80x80x3',
  'pipe_100x100x3',
]);

function migrateHoleDepth(holeDepth: number): HoleDepth {
  if (holeDepth === 1.5) {
    return 1.5;
  }

  return 1.0;
}

export function migrateMeasurementDraft(draft: MeasurementInput): MeasurementInput {
  const postType = VALID_POST_TYPES.has(draft.postType)
    ? draft.postType
    : defaultMeasurementInput.postType;

  return {
    ...defaultMeasurementInput,
    ...draft,
    postType,
    holeDepth: migrateHoleDepth(draft.holeDepth),
  };
}
