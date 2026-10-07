import { create } from 'zustand';
import {
  getCatalogFromDb,
  initializeDatabase,
  saveCatalogToDb,
} from '../db/database';
import { defaultCatalog } from '../db/defaultCatalog';
import type {
  LaborRates,
  MarginSettings,
  MaterialPrices,
  PriceCatalog,
} from '../types/catalog';
import type { GatesType } from '../types/measurement';

interface CatalogState {
  catalog: PriceCatalog | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  loadCatalog: () => Promise<void>;
  saveCatalog: (catalog: PriceCatalog) => Promise<void>;
  updateMaterials: (materials: Partial<MaterialPrices>) => Promise<void>;
  updateLabor: (labor: Partial<LaborRates>) => Promise<void>;
  updateMargin: (margin: Partial<MarginSettings>) => Promise<void>;
  setMaterialPrice: <K extends keyof MaterialPrices>(
    key: K,
    value: MaterialPrices[K],
  ) => Promise<void>;
  setLaborRatePerMeter: (ratePerMeter: number) => Promise<void>;
  setGateInstallRate: (gatesType: Exclude<GatesType, 'none'>, rate: number) => Promise<void>;
  resetCatalogToDefault: () => Promise<void>;
}

function withUpdatedAt(catalog: PriceCatalog): PriceCatalog {
  return {
    ...catalog,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

async function persistCatalog(
  catalog: PriceCatalog,
  set: (partial: Partial<CatalogState>) => void,
): Promise<PriceCatalog> {
  const nextCatalog = withUpdatedAt(catalog);
  await saveCatalogToDb(nextCatalog);
  set({ catalog: nextCatalog, error: null });
  return nextCatalog;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  catalog: null,
  isLoading: false,
  isHydrated: false,
  error: null,

  loadCatalog: async () => {
    set({ isLoading: true, error: null });

    try {
      const catalog = await Promise.race([
        (async () => {
          await initializeDatabase();
          return getCatalogFromDb();
        })(),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error('Таймаут загрузки каталога')), 5000);
        }),
      ]);

      set({ catalog, isLoading: false, isHydrated: true });
    } catch (error) {
      set({
        catalog: defaultCatalog,
        isLoading: false,
        isHydrated: true,
        error: error instanceof Error ? error.message : 'Не удалось загрузить каталог',
      });
    }
  },

  saveCatalog: async (catalog) => {
    set({ isLoading: true, error: null });

    try {
      await persistCatalog(catalog, set);
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Не удалось сохранить каталог',
      });
      throw error;
    }
  },

  updateMaterials: async (materials) => {
    const current = get().catalog;
    if (!current) return;

    await get().saveCatalog({
      ...current,
      materials: {
        ...current.materials,
        ...materials,
      },
    });
  },

  updateLabor: async (labor) => {
    const current = get().catalog;
    if (!current) return;

    await get().saveCatalog({
      ...current,
      labor: {
        ...current.labor,
        ...labor,
      },
    });
  },

  updateMargin: async (margin) => {
    const current = get().catalog;
    if (!current) return;

    await get().saveCatalog({
      ...current,
      margin: {
        ...current.margin,
        ...margin,
      },
    });
  },

  setMaterialPrice: async (key, value) => {
    const current = get().catalog;
    if (!current) return;

    await get().updateMaterials({
      [key]: value,
    } as Partial<MaterialPrices>);
  },

  setLaborRatePerMeter: async (ratePerMeter) => {
    await get().updateLabor({ ratePerMeter });
  },

  setGateInstallRate: async (gatesType, rate) => {
    const current = get().catalog;
    if (!current) return;

    await get().updateLabor({
      gatesInstall: {
        ...current.labor.gatesInstall,
        [gatesType]: rate,
      },
    });
  },

  resetCatalogToDefault: async () => {
    await get().saveCatalog(defaultCatalog);
  },
}));
