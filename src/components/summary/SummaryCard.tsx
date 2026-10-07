import { ClipboardCopy, FileText } from 'lucide-react';
import type { CalculationResult } from '../../types/calculation';
import { formatClientEstimate, formatProcurementList } from '../../logic/formatters';
import { copyTextToClipboard } from '../../lib/clipboard';
import { cn } from '../../lib/cn';
import { hapticSuccess } from '../../lib/telegram';
import { useToastStore } from '../../store/useToastStore';

interface SummaryCardProps {
  result: CalculationResult;
}

export function SummaryCard({ result }: SummaryCardProps) {
  const showToast = useToastStore((state) => state.showToast);
  const { financial } = result;

  const handleCopy = async (text: string) => {
    try {
      await copyTextToClipboard(text);
      hapticSuccess();
      showToast('Скопировано в буфер');
    } catch {
      showToast('Не удалось скопировать');
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--tg-theme-hint-color,#e5e7eb)] p-4">
      <div>
        <h2 className="text-base font-semibold text-[var(--tg-theme-text-color,#111827)]">
          Итоги расчёта
        </h2>
        <p className="mt-2 text-sm text-[var(--tg-theme-hint-color,#6b7280)]">
          Себестоимость: {financial.totalCost.toLocaleString('ru-RU')} ₽
        </p>
        <p className="text-sm text-[var(--tg-theme-hint-color,#6b7280)]">
          Цена клиенту: {financial.recommendedPrice.toLocaleString('ru-RU')} ₽
        </p>
        <p className="text-sm text-[var(--tg-theme-hint-color,#6b7280)]">
          Чистая прибыль: {financial.profit.toLocaleString('ru-RU')} ₽
        </p>
      </div>

      <div className="grid gap-2">
        <button
          type="button"
          onClick={() => void handleCopy(formatProcurementList(result))}
          className={cn(
            'flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-medium',
            'bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)]',
          )}
        >
          <ClipboardCopy className="h-4 w-4 shrink-0" aria-hidden="true" />
          Скопировать ведомость закупки
        </button>

        <button
          type="button"
          onClick={() => void handleCopy(formatClientEstimate(result))}
          className={cn(
            'flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-medium',
            'bg-[var(--tg-theme-button-color,#2563eb)] text-[var(--tg-theme-button-text-color,#fff)]',
          )}
        >
          <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
          Расчёт для клиента
        </button>
      </div>
    </section>
  );
}
