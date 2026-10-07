import { SegmentedControl } from '../common/SegmentedControl';
import {
  FOUNDATION_LABELS,
  HOLE_DEPTH_LABELS,
  POST_LABELS,
  RAIL_LABELS,
} from '../../logic/formatters/labels';
import { useMeasurementStore } from '../../store/useMeasurementStore';
import type { FoundationType, HoleDepth, PostType, RailRows, RailType } from '../../types/measurement';

const POST_OPTIONS: PostType[] = [
  'pipe_60x40x2',
  'pipe_60x60x2',
  'pipe_60x60x3',
  'pipe_80x80x3',
  'pipe_100x100x3',
];
const RAIL_OPTIONS: RailType[] = ['pipe_40x20x1_5', 'pipe_40x20x2'];
const RAIL_ROWS_OPTIONS: RailRows[] = [2, 3];
const FOUNDATION_OPTIONS: FoundationType[] = ['concreting', 'screw_piles', 'ramming_stone'];
const HOLE_DEPTH_OPTIONS: HoleDepth[] = [1.0, 1.5];

export function SectionConstruction() {
  const draft = useMeasurementStore((state) => state.draft);
  const patchDraft = useMeasurementStore((state) => state.patchDraft);

  return (
    <div className="space-y-5">
      <SegmentedControl
        label="Профиль столба"
        value={draft.postType}
        options={POST_OPTIONS.map((postType) => ({
          value: postType,
          label: POST_LABELS[postType],
        }))}
        onChange={(postType) => patchDraft({ postType })}
      />

      <SegmentedControl
        label="Профиль лаг"
        value={draft.railType}
        options={RAIL_OPTIONS.map((railType) => ({
          value: railType,
          label: RAIL_LABELS[railType],
        }))}
        onChange={(railType) => patchDraft({ railType })}
      />

      <SegmentedControl
        label="Число рядов лаг"
        value={draft.railRows}
        options={RAIL_ROWS_OPTIONS.map((railRows) => ({
          value: railRows,
          label: `${railRows} ряда`,
        }))}
        onChange={(railRows) => patchDraft({ railRows })}
      />

      <SegmentedControl
        label="Тип фундамента"
        value={draft.foundationType}
        options={FOUNDATION_OPTIONS.map((foundationType) => ({
          value: foundationType,
          label: FOUNDATION_LABELS[foundationType],
        }))}
        onChange={(foundationType) => patchDraft({ foundationType })}
      />

      {draft.foundationType !== 'screw_piles' ? (
        <SegmentedControl
          label="Глубина лунки"
          value={draft.holeDepth}
          options={HOLE_DEPTH_OPTIONS.map((holeDepth) => ({
            value: holeDepth,
            label: HOLE_DEPTH_LABELS[holeDepth],
          }))}
          onChange={(holeDepth) => patchDraft({ holeDepth })}
        />
      ) : null}
    </div>
  );
}
