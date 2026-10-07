import { cn } from '../../lib/cn';

interface PriceFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function PriceField({
  label,
  value,
  onChange,
  suffix = '₽',
  min = 0,
  max,
  step = 1,
  disabled = false,
}: PriceFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-[var(--tg-theme-hint-color,#6b7280)]">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={Number.isFinite(value) ? value : 0}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (!Number.isNaN(next)) {
              onChange(next);
            }
          }}
          className={cn(
            'min-h-11 w-full rounded-xl border px-3 py-2 pr-10 text-base',
            'border-[var(--tg-theme-hint-color,#d1d5db)] bg-[var(--tg-theme-bg-color,#fff)]',
            'text-[var(--tg-theme-text-color,#111827)]',
            'focus:border-[var(--tg-theme-button-color,#2563eb)] focus:outline-none focus:ring-2',
            'focus:ring-[var(--tg-theme-button-color,#2563eb)]/20',
            disabled && 'opacity-60',
          )}
        />
        {suffix ? (
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--tg-theme-hint-color,#6b7280)]"
          >
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}
