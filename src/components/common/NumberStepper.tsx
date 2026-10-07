import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { hapticLight } from '../../lib/telegram';
import { cn } from '../../lib/cn';

interface NumberStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  showSlider?: boolean;
}

function roundToStep(value: number, step: number): number {
  const decimals = step.toString().includes('.') ? step.toString().split('.')[1].length : 0;
  return Number(value.toFixed(decimals));
}

function clampValue(value: number, min: number, max: number, step: number): number {
  return roundToStep(Math.min(max, Math.max(min, value)), step);
}

export function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  suffix = 'м',
  showSlider = true,
}: NumberStepperProps) {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const applyValue = (next: number, withHaptic = false) => {
    const clamped = clampValue(next, min, max, step);

    if (clamped !== value && withHaptic) {
      hapticLight();
    }

    onChange(clamped);
    setInputValue(String(clamped));
  };

  const decrease = () => {
    applyValue(value - step, true);
  };

  const increase = () => {
    applyValue(value + step, true);
  };

  const commitInput = () => {
    const normalized = inputValue.trim().replace(',', '.');
    const parsed = Number(normalized);

    if (Number.isNaN(parsed)) {
      setInputValue(String(value));
      return;
    }

    applyValue(parsed, true);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[var(--tg-theme-text-color,#111827)]">{label}</p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrease}
          aria-label={`Уменьшить ${label}`}
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
            'bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)]',
            'text-[var(--tg-theme-text-color,#111827)]',
          )}
        >
          <Minus className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onBlur={commitInput}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.currentTarget.blur();
              }
            }}
            aria-label={label}
            className={cn(
              'min-h-11 w-full rounded-2xl px-3 pr-10 text-center text-lg font-semibold',
              'border border-[var(--tg-theme-hint-color,#d1d5db)]',
              'bg-[var(--tg-theme-bg-color,#fff)]',
              'text-[var(--tg-theme-text-color,#111827)]',
              'focus:border-[var(--tg-theme-button-color,#2563eb)] focus:outline-none focus:ring-2',
              'focus:ring-[var(--tg-theme-button-color,#2563eb)]/20',
            )}
          />
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--tg-theme-hint-color,#6b7280)]"
          >
            {suffix}
          </span>
        </div>

        <button
          type="button"
          onClick={increase}
          aria-label={`Увеличить ${label}`}
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
            'bg-[var(--tg-theme-button-color,#2563eb)]',
            'text-[var(--tg-theme-button-text-color,#fff)]',
          )}
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {showSlider ? (
        <div className="space-y-1 px-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => applyValue(Number(event.target.value))}
            aria-label={`${label}, ползунок`}
            className={cn(
              'h-11 w-full cursor-pointer appearance-none rounded-full',
              'bg-[var(--tg-theme-secondary-bg-color,#e5e7eb)]',
              'accent-[var(--tg-theme-button-color,#2563eb)]',
            )}
          />
          <div className="flex justify-between text-xs text-[var(--tg-theme-hint-color,#6b7280)]">
            <span>{min} {suffix}</span>
            <span>{max} {suffix}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
