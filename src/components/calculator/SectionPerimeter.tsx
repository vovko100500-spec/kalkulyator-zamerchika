import { NumberStepper } from '../common/NumberStepper';
import { SegmentedControl } from '../common/SegmentedControl';
import { useMeasurementStore } from '../../store/useMeasurementStore';
import type { FenceHeight, PostStep } from '../../types/measurement';

const HEIGHT_OPTIONS: FenceHeight[] = [1.5, 1.8, 2.0, 2.2, 2.5];
const POST_STEP_OPTIONS: PostStep[] = [2.0, 2.5, 3.0];

export function SectionPerimeter() {
  const draft = useMeasurementStore((state) => state.draft);
  const patchDraft = useMeasurementStore((state) => state.patchDraft);

  return (
    <div className="space-y-5">
      <NumberStepper
        label="Периметр ограждения"
        value={draft.perimeter}
        onChange={(perimeter) => patchDraft({ perimeter })}
        min={0.1}
        max={250}
        step={0.1}
        suffix="м"
      />

      <SegmentedControl
        label="Высота полотна"
        value={draft.height}
        options={HEIGHT_OPTIONS.map((height) => ({
          value: height,
          label: `${height} м`,
        }))}
        onChange={(height) => patchDraft({ height })}
      />

      <SegmentedControl
        label="Шаг между столбами"
        value={draft.postStep}
        options={POST_STEP_OPTIONS.map((step) => ({
          value: step,
          label: `${step} м`,
        }))}
        onChange={(postStep) => patchDraft({ postStep })}
      />
    </div>
  );
}
