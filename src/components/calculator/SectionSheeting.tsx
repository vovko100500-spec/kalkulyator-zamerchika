import { SegmentedControl } from '../common/SegmentedControl';
import { SHEETING_LABELS } from '../../logic/formatters/labels';
import { useMeasurementStore } from '../../store/useMeasurementStore';
import type { SheetingType } from '../../types/measurement';

const SHEETING_OPTIONS: SheetingType[] = [
  'sheet_c8',
  'sheet_mp20',
  'picket_single',
  'picket_double',
  'grid_3d',
];

export function SectionSheeting() {
  const draft = useMeasurementStore((state) => state.draft);
  const patchDraft = useMeasurementStore((state) => state.patchDraft);

  return (
    <SegmentedControl
      label="Тип полотна"
      value={draft.sheetingType}
      options={SHEETING_OPTIONS.map((sheetingType) => ({
        value: sheetingType,
        label: SHEETING_LABELS[sheetingType],
      }))}
      onChange={(sheetingType) => patchDraft({ sheetingType })}
    />
  );
}
