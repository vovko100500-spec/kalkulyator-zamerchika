import { cn } from '../../lib/cn';
import { useToastStore } from '../../store/useToastStore';

export function Toast() {
  const message = useToastStore((state) => state.message);

  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2',
        'rounded-full px-4 py-3 text-sm font-medium shadow-lg',
        'bg-[var(--tg-theme-button-color,#111827)] text-[var(--tg-theme-button-text-color,#fff)]',
      )}
    >
      {message}
    </div>
  );
}
