import { NumberStepper } from '../common/NumberStepper';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { useMeasurementStore } from '../../store/useMeasurementStore';

export function SectionModifiers() {
  const draft = useMeasurementStore((state) => state.draft);
  const patchDraft = useMeasurementStore((state) => state.patchDraft);

  return (
    <div className="space-y-5">
      <NumberStepper
        label="Демонтаж старого забора"
        value={draft.demolitionLength}
        onChange={(demolitionLength) => patchDraft({ demolitionLength })}
        min={0}
        max={250}
        step={1}
        suffix="м"
      />

      <ToggleSwitch
        label="Сложный грунт"
        description="Камни, уклон — +30% к бурению"
        checked={draft.hardSoil}
        onChange={(hardSoil) => patchDraft({ hardSoil })}
      />

      <ToggleSwitch
        label="Нет электричества"
        description="Нужен бензогенератор на объекте"
        checked={draft.noElectricity}
        onChange={(noElectricity) => patchDraft({ noElectricity })}
      />
    </div>
  );
}
