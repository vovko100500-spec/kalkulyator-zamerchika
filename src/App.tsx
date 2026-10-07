import { useEffect } from 'react';
import { MeasurementForm } from './components/calculator/MeasurementForm';
import { Toast } from './components/common/Toast';
import { Header } from './components/layout/Header';
import { SummaryCard } from './components/summary/SummaryCard';
import { initTelegramApp } from './lib/telegram';
import { useCatalogStore } from './store/useCatalogStore';
import { useMeasurementStore } from './store/useMeasurementStore';

function App() {
  const loadCatalog = useCatalogStore((state) => state.loadCatalog);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const result = useMeasurementStore((state) => state.result);

  useEffect(() => {
    const cleanupTelegram = initTelegramApp();
    void loadCatalog();

    return cleanupTelegram;
  }, [loadCatalog]);

  return (
    <div className="flex min-h-svh flex-col bg-[var(--tg-theme-bg-color,#fff)] text-[var(--tg-theme-text-color,#111827)]">
      <Header />

      <main className="flex-1 space-y-4 px-4 py-6">
        {isCatalogLoading ? (
          <p className="text-sm text-[var(--tg-theme-hint-color,#6b7280)]">Загрузка прайса…</p>
        ) : (
          <>
            <MeasurementForm />
            {result ? (
              <SummaryCard result={result} />
            ) : (
              <p className="text-sm text-[var(--tg-theme-hint-color,#6b7280)]">
                Загрузите прайс, чтобы увидеть расчёт.
              </p>
            )}
          </>
        )}
      </main>

      <Toast />
    </div>
  );
}

export default App;
