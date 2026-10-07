import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Accordion } from '../common/Accordion';
import { PriceField } from '../common/PriceField';
import { cn } from '../../lib/cn';
import { hapticSuccess } from '../../lib/telegram';
import { useCatalogStore } from '../../store/useCatalogStore';
import type { PriceCatalog } from '../../types/catalog';
import type { FenceHeight, PostType, RailType, SheetingType } from '../../types/measurement';
import {
  FENCE_HEIGHTS,
  GATE_INSTALL_LABELS,
  POST_TYPE_LABELS,
  RAIL_TYPE_LABELS,
  SHEETING_TYPE_LABELS,
} from './priceSettingsLabels';

type SettingsTab = 'materials' | 'labor' | 'margin';

interface PriceSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'materials', label: 'Материалы' },
  { id: 'labor', label: 'Монтаж' },
  { id: 'margin', label: 'Наценки' },
];

function cloneCatalog(catalog: PriceCatalog): PriceCatalog {
  return JSON.parse(JSON.stringify(catalog)) as PriceCatalog;
}

export function PriceSettingsModal({ open, onClose }: PriceSettingsModalProps) {
  const catalog = useCatalogStore((state) => state.catalog);
  const isLoading = useCatalogStore((state) => state.isLoading);
  const saveCatalog = useCatalogStore((state) => state.saveCatalog);
  const resetCatalogToDefault = useCatalogStore((state) => state.resetCatalogToDefault);

  const [draft, setDraft] = useState<PriceCatalog | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>('materials');
  const [openSections, setOpenSections] = useState({
    pipes: true,
    sheeting: false,
    fasteners: false,
    bulk: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !catalog) {
      return;
    }

    setDraft(cloneCatalog(catalog));
    setActiveTab('materials');
    setError(null);
  }, [open, catalog]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const updatePostPrice = (postType: PostType, value: number) => {
    setDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        materials: {
          ...current.materials,
          postStock6m: {
            ...current.materials.postStock6m,
            [postType]: value,
          },
        },
      };
    });
  };

  const updateRailPrice = (railType: RailType, value: number) => {
    setDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        materials: {
          ...current.materials,
          railStock6m: {
            ...current.materials.railStock6m,
            [railType]: value,
          },
        },
      };
    });
  };

  const updateSheetPrice = (sheetingType: SheetingType, height: FenceHeight, value: number) => {
    setDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        materials: {
          ...current.materials,
          sheet: {
            ...current.materials.sheet,
            [sheetingType]: {
              ...current.materials.sheet[sheetingType],
              [height]: value,
            },
          },
        },
      };
    });
  };

  const updateMaterialScalar = <K extends keyof PriceCatalog['materials']>(
    key: K,
    value: PriceCatalog['materials'][K],
  ) => {
    setDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        materials: {
          ...current.materials,
          [key]: value,
        },
      };
    });
  };

  const updateLaborScalar = <K extends keyof PriceCatalog['labor']>(
    key: K,
    value: PriceCatalog['labor'][K],
  ) => {
    setDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        labor: {
          ...current.labor,
          [key]: value,
        },
      };
    });
  };

  const updateGateInstall = (gateType: keyof typeof GATE_INSTALL_LABELS, value: number) => {
    setDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        labor: {
          ...current.labor,
          gatesInstall: {
            ...current.labor.gatesInstall,
            [gateType]: value,
          },
        },
      };
    });
  };

  const updateMargin = <K extends keyof PriceCatalog['margin']>(
    key: K,
    value: PriceCatalog['margin'][K],
  ) => {
    setDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        margin: {
          ...current.margin,
          [key]: value,
        },
      };
    });
  };

  const handleSave = async () => {
    if (!draft) return;

    setIsSaving(true);
    setError(null);

    try {
      await saveCatalog(draft);
      hapticSuccess();
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить прайс');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm('Сбросить все цены к базовым значениям? Текущие изменения будут потеряны.');

    if (!confirmed) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await resetCatalogToDefault();
      const nextCatalog = useCatalogStore.getState().catalog;

      if (nextCatalog) {
        setDraft(cloneCatalog(nextCatalog));
      }
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Не удалось сбросить прайс');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Закрыть настройки"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="price-settings-title"
        className={cn(
          'relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col',
          'rounded-t-3xl bg-[var(--tg-theme-bg-color,#fff)] sm:rounded-3xl',
          'text-[var(--tg-theme-text-color,#111827)] shadow-2xl',
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-[var(--tg-theme-hint-color,#e5e7eb)] px-4 py-4">
          <div>
            <h2 id="price-settings-title" className="text-lg font-semibold">
              Настройки прайса
            </h2>
            {draft ? (
              <p className="mt-1 text-sm text-[var(--tg-theme-hint-color,#6b7280)]">
                Обновлён: {draft.updatedAt}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
              'bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)]',
            )}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex gap-2 overflow-x-auto px-4 pt-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'min-h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-[var(--tg-theme-button-color,#2563eb)] text-[var(--tg-theme-button-text-color,#fff)]'
                  : 'bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)]',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!draft ? (
            <p className="text-sm text-[var(--tg-theme-hint-color,#6b7280)]">
              {isLoading ? 'Загрузка прайса…' : 'Каталог цен недоступен'}
            </p>
          ) : null}

          {draft && activeTab === 'materials' ? (
            <div className="space-y-3">
              <Accordion
                title="Трубы"
                open={openSections.pipes}
                onToggle={() => toggleSection('pipes')}
              >
                <div className="grid gap-4">
                  {(Object.keys(POST_TYPE_LABELS) as PostType[]).map((postType) => (
                    <PriceField
                      key={postType}
                      label={POST_TYPE_LABELS[postType]}
                      value={draft.materials.postStock6m[postType]}
                      onChange={(value) => updatePostPrice(postType, value)}
                    />
                  ))}
                  <PriceField
                    label="Усиленный столб ворот/калитки 80×80 (хлыст 6 м)"
                    value={draft.materials.gatePostStock6m}
                    onChange={(value) => updateMaterialScalar('gatePostStock6m', value)}
                  />
                  {(Object.keys(RAIL_TYPE_LABELS) as RailType[]).map((railType) => (
                    <PriceField
                      key={railType}
                      label={RAIL_TYPE_LABELS[railType]}
                      value={draft.materials.railStock6m[railType]}
                      onChange={(value) => updateRailPrice(railType, value)}
                    />
                  ))}
                </div>
              </Accordion>

              <Accordion
                title="Профнастил и полотно"
                open={openSections.sheeting}
                onToggle={() => toggleSection('sheeting')}
              >
                <div className="space-y-5">
                  {(Object.keys(SHEETING_TYPE_LABELS) as SheetingType[]).map((sheetingType) => (
                    <div key={sheetingType} className="space-y-3">
                      <h3 className="text-sm font-medium">{SHEETING_TYPE_LABELS[sheetingType]}</h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {FENCE_HEIGHTS.map((height) => (
                          <PriceField
                            key={`${sheetingType}-${height}`}
                            label={`H ${height} м`}
                            value={draft.materials.sheet[sheetingType][height]}
                            onChange={(value) => updateSheetPrice(sheetingType, height, value)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Accordion>

              <Accordion
                title="Саморезы и расходники"
                open={openSections.fasteners}
                onToggle={() => toggleSection('fasteners')}
              >
                <div className="grid gap-4">
                  <PriceField
                    label="Саморез кровельный"
                    value={draft.materials.screwEach}
                    onChange={(value) => updateMaterialScalar('screwEach', value)}
                  />
                  <PriceField
                    label="Заглушка пластиковая"
                    value={draft.materials.capEach}
                    onChange={(value) => updateMaterialScalar('capEach', value)}
                  />
                  <PriceField
                    label="Аренда бензогенератора"
                    value={draft.materials.generatorRent}
                    onChange={(value) => updateMaterialScalar('generatorRent', value)}
                    suffix="₽/смена"
                  />
                </div>
              </Accordion>

              <Accordion
                title="Сыпучка"
                open={openSections.bulk}
                onToggle={() => toggleSection('bulk')}
              >
                <PriceField
                  label="Щебень для забутовки"
                  value={draft.materials.stonePerKg}
                  onChange={(value) => updateMaterialScalar('stonePerKg', value)}
                  suffix="₽/кг"
                  step={0.1}
                />
              </Accordion>
            </div>
          ) : null}

          {draft && activeTab === 'labor' ? (
            <div className="grid gap-4">
              <PriceField
                label="Ставка монтажа за погонный метр"
                value={draft.labor.ratePerMeter}
                onChange={(value) => updateLaborScalar('ratePerMeter', value)}
                suffix="₽/м"
              />
              {(Object.keys(GATE_INSTALL_LABELS) as Array<keyof typeof GATE_INSTALL_LABELS>).map(
                (gateType) => (
                  <PriceField
                    key={gateType}
                    label={GATE_INSTALL_LABELS[gateType]}
                    value={draft.labor.gatesInstall[gateType]}
                    onChange={(value) => updateGateInstall(gateType, value)}
                    suffix="₽/компл"
                  />
                ),
              )}
              <PriceField
                label="Монтаж калитки"
                value={draft.labor.wicketInstall}
                onChange={(value) => updateLaborScalar('wicketInstall', value)}
                suffix="₽/шт"
              />
              <PriceField
                label="Установка автоматики ворот"
                value={draft.labor.automationInstall}
                onChange={(value) => updateLaborScalar('automationInstall', value)}
                suffix="₽/компл"
              />
              <PriceField
                label="Демонтаж старого забора"
                value={draft.labor.demolitionPerMeter}
                onChange={(value) => updateLaborScalar('demolitionPerMeter', value)}
                suffix="₽/м"
              />
              <PriceField
                label="Коэффициент сложного грунта (бурение)"
                value={draft.labor.hardSoilDrillingMultiplier}
                onChange={(value) => updateLaborScalar('hardSoilDrillingMultiplier', value)}
                suffix="×"
                step={0.1}
                min={1}
              />
            </div>
          ) : null}

          {draft && activeTab === 'margin' ? (
            <div className="grid gap-4">
              <PriceField
                label="Целевая маржа"
                value={Math.round(draft.margin.targetMargin * 1000) / 10}
                onChange={(value) => updateMargin('targetMargin', value / 100)}
                suffix="%"
                min={1}
                max={90}
                step={0.1}
              />
              <PriceField
                label="Минимальная маржа (порог торга)"
                value={Math.round(draft.margin.minMargin * 1000) / 10}
                onChange={(value) => updateMargin('minMargin', value / 100)}
                suffix="%"
                min={1}
                max={90}
                step={0.1}
              />
              <PriceField
                label="Доставка с металлобазы"
                value={draft.margin.deliveryCost}
                onChange={(value) => updateMargin('deliveryCost', value)}
                suffix="₽"
              />
            </div>
          ) : null}

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </div>

        <footer className="space-y-2 border-t border-[var(--tg-theme-hint-color,#e5e7eb)] p-4">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!draft || isSaving}
            className={cn(
              'min-h-11 w-full rounded-2xl px-4 text-base font-medium',
              'bg-[var(--tg-theme-button-color,#2563eb)] text-[var(--tg-theme-button-text-color,#fff)]',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {isSaving ? 'Сохранение…' : 'Сохранить изменения'}
          </button>
          <button
            type="button"
            onClick={() => void handleReset()}
            disabled={isSaving}
            className={cn(
              'min-h-11 w-full rounded-2xl px-4 text-base font-medium',
              'bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)]',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            Сбросить к базовым ценам
          </button>
        </footer>
      </div>
    </div>
  );
}
