import { hapticLight } from '../../lib/telegram';
import { cn } from '../../lib/cn';

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSwitch({ label, description, checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => {
        hapticLight();
        onChange(!checked);
      }}
      className={cn(
        'flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left',
        'bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)]',
      )}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-[var(--tg-theme-text-color,#111827)]">
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-xs text-[var(--tg-theme-hint-color,#6b7280)]">
            {description}
          </span>
        ) : null}
      </span>

      <span
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors',
          checked ? 'bg-[var(--tg-theme-button-color,#2563eb)]' : 'bg-[var(--tg-theme-hint-color,#d1d5db)]',
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  );
}
