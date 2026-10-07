import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { deleteEstimateFromDb, saveEstimateToDb } from '../db/database';
import type { CalculationResult } from '../types/calculation';
import type { MeasurementInput } from '../types/measurement';
import type { SavedEstimateRecord } from '../types/db';
import { defaultMeasurementInput } from './defaults';
import { migrateMeasurementDraft } from './migrateDraft';
import { buildEstimate } from './recalculate';
import { useCatalogStore } from './useCatalogStore';

interface MeasurementState {
  draft: MeasurementInput;
  result: CalculationResult | null;
  setDraft: (draft: MeasurementInput) => void;
  patchDraft: (patch: Partial<MeasurementInput>) => void;
  resetDraft: () => void;
  recalculateFromDraft: () => void;
  saveToHistory: (label?: string) => Promise<number>;
  loadFromHistory: (record: SavedEstimateRecord) => void;
  deleteFromHistory: (id: number) => Promise<void>;
}

function recalculate(draft: MeasurementInput): CalculationResult | null {
  const catalog = useCatalogStore.getState().catalog;
  return buildEstimate(draft, catalog);
}

export const useMeasurementStore = create<MeasurementState>()(
  persist(
    (set, get) => ({
      draft: defaultMeasurementInput,
      result: recalculate(defaultMeasurementInput),

      setDraft: (draft) => {
        set({ draft, result: recalculate(draft) });
      },

      patchDraft: (patch) => {
        const draft = { ...get().draft, ...patch };
        set({ draft, result: recalculate(draft) });
      },

      resetDraft: () => {
        set({
          draft: defaultMeasurementInput,
          result: recalculate(defaultMeasurementInput),
        });
      },

      recalculateFromDraft: () => {
        set({ result: recalculate(get().draft) });
      },

      saveToHistory: async (label) => {
        const { draft, result } = get();

        if (!result) {
          throw new Error('Нет данных для сохранения: каталог цен не загружен');
        }

        const record: Omit<SavedEstimateRecord, 'id'> = {
          createdAt: new Date().toISOString(),
          label,
          input: draft,
          result,
        };

        return saveEstimateToDb(record);
      },

      loadFromHistory: (record) => {
        set({
          draft: record.input,
          result: record.result,
        });
      },

      deleteFromHistory: async (id) => {
        await deleteEstimateFromDb(id);
      },
    }),
    {
      name: 'fence-measurer-draft',
      partialize: (state) => ({ draft: state.draft }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.draft = migrateMeasurementDraft(state.draft);
          state.result = recalculate(state.draft);
        }
      },
    },
  ),
);

useCatalogStore.subscribe((state, previousState) => {
  if (state.catalog === previousState.catalog) {
    return;
  }

  useMeasurementStore.getState().recalculateFromDraft();
});
