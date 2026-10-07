import { SegmentedControl } from '../common/SegmentedControl';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { GATES_LABELS, WICKET_LOCK_LABELS } from '../../logic/formatters/labels';
import { useMeasurementStore } from '../../store/useMeasurementStore';
import type { GatesType, WicketLock } from '../../types/measurement';

const GATES_OPTIONS: GatesType[] = ['none', 'swing_4m', 'sliding_4m', 'sliding_5m'];
const WICKETS_OPTIONS = [0, 1, 2] as const;
const WICKET_LOCK_OPTIONS: WicketLock[] = ['mechanical', 'electromechanical'];

export function SectionGates() {
  const draft = useMeasurementStore((state) => state.draft);
  const patchDraft = useMeasurementStore((state) => state.patchDraft);
  const hasGates = draft.gatesType !== 'none';

  return (
    <div className="space-y-5">
      <SegmentedControl
        label="Тип ворот"
        value={draft.gatesType}
        options={GATES_OPTIONS.map((gatesType) => ({
          value: gatesType,
          label: GATES_LABELS[gatesType],
        }))}
        onChange={(gatesType) =>
          patchDraft({
            gatesType,
            gatesAutomation: gatesType === 'none' ? false : draft.gatesAutomation,
          })
        }
      />

      {hasGates ? (
        <ToggleSwitch
          label="Автоматика ворот"
          description="Привод и блок управления"
          checked={draft.gatesAutomation}
          onChange={(gatesAutomation) => patchDraft({ gatesAutomation })}
        />
      ) : null}

      <SegmentedControl
        label="Количество калиток"
        value={draft.wicketsCount}
        options={WICKETS_OPTIONS.map((count) => ({
          value: count,
          label: count === 0 ? 'Нет' : `${count} шт`,
        }))}
        onChange={(wicketsCount) =>
          patchDraft({
            wicketsCount,
            wicketLock: wicketsCount === 0 ? 'mechanical' : draft.wicketLock,
          })
        }
      />

      {draft.wicketsCount > 0 ? (
        <SegmentedControl
          label="Замок калитки"
          value={draft.wicketLock}
          options={WICKET_LOCK_OPTIONS.map((wicketLock) => ({
            value: wicketLock,
            label: WICKET_LOCK_LABELS[wicketLock],
          }))}
          onChange={(wicketLock) => patchDraft({ wicketLock })}
        />
      ) : null}
    </div>
  );
}
