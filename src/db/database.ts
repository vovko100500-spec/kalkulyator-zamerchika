import Dexie, { type Table } from 'dexie';
import { defaultCatalog } from './defaultCatalog';
import type { PriceCatalog } from '../types/catalog';
import { CATALOG_RECORD_ID, type CatalogRecord, type SavedEstimateRecord } from '../types/db';

export class FenceCalculatorDatabase extends Dexie {
  catalog!: Table<CatalogRecord, number>;
  estimates!: Table<SavedEstimateRecord, number>;

  constructor() {
    super('FenceCalculatorDB');

    this.version(1).stores({
      catalog: 'id',
      estimates: '++id, createdAt',
    });
  }
}

export const db = new FenceCalculatorDatabase();

function mergeCatalogWithDefaults(catalog: PriceCatalog): PriceCatalog {
  return {
    ...defaultCatalog,
    ...catalog,
    materials: {
      ...defaultCatalog.materials,
      ...catalog.materials,
      postStock6m: {
        ...defaultCatalog.materials.postStock6m,
        ...catalog.materials.postStock6m,
      },
      railStock6m: {
        ...defaultCatalog.materials.railStock6m,
        ...catalog.materials.railStock6m,
      },
      sheet: {
        ...defaultCatalog.materials.sheet,
        ...catalog.materials.sheet,
      },
    },
    labor: {
      ...defaultCatalog.labor,
      ...catalog.labor,
      gatesInstall: {
        ...defaultCatalog.labor.gatesInstall,
        ...catalog.labor.gatesInstall,
      },
    },
    margin: {
      ...defaultCatalog.margin,
      ...catalog.margin,
    },
  };
}

export async function initializeDatabase(): Promise<void> {
  const existing = await db.catalog.get(CATALOG_RECORD_ID);

  if (!existing) {
    await db.catalog.put({
      id: CATALOG_RECORD_ID,
      catalog: defaultCatalog,
    });
  }
}

export async function getCatalogFromDb(): Promise<PriceCatalog> {
  const record = await db.catalog.get(CATALOG_RECORD_ID);

  if (!record) {
    await initializeDatabase();
    const seeded = await db.catalog.get(CATALOG_RECORD_ID);
    return seeded?.catalog ?? defaultCatalog;
  }

  return mergeCatalogWithDefaults(record.catalog);
}

export async function saveCatalogToDb(catalog: PriceCatalog): Promise<void> {
  await db.catalog.put({
    id: CATALOG_RECORD_ID,
    catalog,
  });
}

export async function listEstimatesFromDb(): Promise<SavedEstimateRecord[]> {
  return db.estimates.orderBy('createdAt').reverse().toArray();
}

export async function getEstimateFromDb(id: number): Promise<SavedEstimateRecord | undefined> {
  return db.estimates.get(id);
}

export async function saveEstimateToDb(
  estimate: Omit<SavedEstimateRecord, 'id'>,
): Promise<number> {
  return db.estimates.add(estimate);
}

export async function deleteEstimateFromDb(id: number): Promise<void> {
  await db.estimates.delete(id);
}
