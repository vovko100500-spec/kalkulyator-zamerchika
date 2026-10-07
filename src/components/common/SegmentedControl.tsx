import { hapticLight } from '../../lib/telegram';
import { cn } from '../../lib/cn';

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string | number> {
  label: string;
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-sm font-medium text-[var(--tg-theme-text-color,#111827)]">{label}</p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => {
                if (option.value === value) {
                  return;
                }

                hapticLight();
                onChange(option.value);
              }}
              className={cn(
                'min-h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--tg-theme-button-color,#2563eb)] text-[var(--tg-theme-button-text-color,#fff)]'
                  : 'bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)]',
              )}
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
