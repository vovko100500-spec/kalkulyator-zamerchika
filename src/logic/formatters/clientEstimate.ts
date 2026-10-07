import type { CalculationResult } from '../../types/calculation';
import {
  FOUNDATION_LABELS,
  formatRub,
  GATES_LABELS,
  SHEETING_LABELS,
} from './labels';

const DEFAULT_ADVANCE_RATE = 0.5;

export function formatClientEstimate(
  result: CalculationResult,
  advanceRate = DEFAULT_ADVANCE_RATE,
): string {
  const { input, geometry, financial } = result;
  const advanceAmount = Math.round(financial.recommendedPrice * advanceRate);
  const lines: string[] = [
    '🏠 РАСЧЁТ ЗАБОРА',
    '',
    'Параметры объекта:',
    `• Периметр: ${input.perimeter} м`,
    `• Высота полотна: ${input.height} м`,
    `• Полотно: ${SHEETING_LABELS[input.sheetingType]}`,
    `• Шаг столбов: ${input.postStep} м`,
    `• Фундамент: ${FOUNDATION_LABELS[input.foundationType]}`,
    `• Ворота: ${GATES_LABELS[input.gatesType]}`,
  ];

  if (input.gatesAutomation && input.gatesType !== 'none') {
    lines.push('• Автоматика ворот: да');
  }

  if (input.wicketsCount > 0) {
    lines.push(`• Калитки: ${input.wicketsCount} шт`);
  }

  if (input.demolitionLength > 0) {
    lines.push(`• Демонтаж старого ограждения: ${input.demolitionLength} м`);
  }

  if (input.hardSoil) {
    lines.push('• Сложный грунт: учтён');
  }

  lines.push('');
  lines.push('Состав работ и материалов:');
  lines.push(`• Каркас забора, ${geometry.netLength} м погонных`);
  lines.push(`• ${SHEETING_LABELS[input.sheetingType]} с монтажом`);

  if (input.gatesType !== 'none') {
    lines.push(`• ${GATES_LABELS[input.gatesType]} с установкой`);
  }

  if (input.wicketsCount > 0) {
    lines.push(`• Калитка — ${input.wicketsCount} шт с установкой`);
  }

  if (input.demolitionLength > 0) {
    lines.push(`• Демонтаж — ${input.demolitionLength} м`);
  }

  lines.push('');
  lines.push(`ИТОГО: ${formatRub(financial.recommendedPrice)}`);
  lines.push(
    `Аванс ${Math.round(advanceRate * 100)}%: ${formatRub(advanceAmount)}`,
  );
  lines.push('');
  lines.push('Срок и детали монтажа уточняются при заключении договора.');

  return lines.join('\n');
}
