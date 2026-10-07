import { useState } from 'react';
import { Settings, WifiOff } from 'lucide-react';
import { cn } from '../../lib/cn';
import { PriceSettingsModal } from '../settings/PriceSettingsModal';

interface HeaderProps {
  offline?: boolean;
}

export function Header({ offline = false }: HeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 flex min-h-14 items-center justify-between gap-3',
          'border-b border-[var(--tg-theme-hint-color,#e5e7eb)] px-4 py-2',
          'bg-[var(--tg-theme-bg-color,#fff)]/95 backdrop-blur',
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-[var(--tg-theme-text-color,#111827)]">
            Калькулятор замерщика
          </p>
          {offline ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-amber-600">
              <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
              Оффлайн
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Настройки прайса"
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
            'bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)]',
            'text-[var(--tg-theme-text-color,#111827)]',
          )}
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <PriceSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
