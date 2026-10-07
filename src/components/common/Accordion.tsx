import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

interface AccordionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function Accordion({ title, open, onToggle, children }: AccordionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--tg-theme-hint-color,#e5e7eb)]">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left',
          'bg-[var(--tg-theme-secondary-bg-color,#f9fafb)]',
          'text-[var(--tg-theme-text-color,#111827)]',
        )}
        aria-expanded={open}
      >
        <span className="font-medium">{title}</span>
        <ChevronDown
          className={cn('h-5 w-5 shrink-0 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      {open ? <div className="space-y-4 border-t border-[var(--tg-theme-hint-color,#e5e7eb)] p-4">{children}</div> : null}
    </section>
  );
}
