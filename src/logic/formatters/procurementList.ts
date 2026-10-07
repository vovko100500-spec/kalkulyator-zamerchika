import type { CalculationResult } from '../../types/calculation';
import { POST_LABELS, RAIL_LABELS, SHEETING_LABELS } from './labels';

export const STONE_BAG_KG = 25;

export function formatProcurementList(result: CalculationResult): string {
  const { input, geometry, materials } = result;
  const lines: string[] = [
    '📋 ВЕДОМОСТЬ ЗАКУПКИ',
    `Периметр: ${input.perimeter} м | Чистая длина: ${geometry.netLength} м`,
    `Высота полотна: ${input.height} м`,
    '',
    'Материалы (коммерческие единицы):',
  ];

  if (geometry.stockPostsCount > 0) {
    lines.push(
      `• ${POST_LABELS[input.postType]} — ${geometry.stockPostsCount} хлыстов (6 м)`,
    );
  }

  if (geometry.gatePostsCount > 0) {
    lines.push(`• 80×80×3 (усиленный) — ${geometry.gatePostsCount} хлыстов (6 м)`);
  }

  if (geometry.stockRailsCount > 0) {
    lines.push(
      `• ${RAIL_LABELS[input.railType]} — ${geometry.stockRailsCount} хлыстов (6 м)`,
    );
  }

  if (materials.sheetsCount > 0) {
    lines.push(
      `• ${SHEETING_LABELS[input.sheetingType]}, H=${input.height} м — ${materials.sheetsCount} листов`,
    );
  }

  if (materials.picketCount > 0) {
    lines.push(
      `• ${SHEETING_LABELS[input.sheetingType]}, H=${input.height} м — ${Math.ceil(materials.picketCount)} шт`,
    );
  }

  if (materials.screwsCount > 0) {
    lines.push(`• Саморезы кровельные — ${materials.screwsCount} шт`);
  }

  if (materials.capsCount > 0) {
    lines.push(`• Заглушки пластиковые на столбы — ${materials.capsCount} шт`);
  }

  if (input.foundationType === 'ramming_stone' && materials.totalStoneKg > 0) {
    const stoneBags = Math.ceil(materials.totalStoneKg / STONE_BAG_KG);
    lines.push(
      `• Щебень для забутовки — ${stoneBags} мешков (по ${STONE_BAG_KG} кг, ~${materials.totalStoneKg} кг)`,
    );
  }

  if (input.foundationType === 'concreting') {
    const concreteBags = Math.ceil(geometry.totalPostsCount * 2);
    lines.push(`• Пескобетон М300 — ${concreteBags} мешков (по 25 кг, ориентир)`);
  }

  if (input.noElectricity) {
    lines.push('• Аренда бензогенератора — 1 смена');
  }

  lines.push('');
  lines.push(`Позиций: ${lines.filter((line) => line.startsWith('•')).length}`);
  lines.push('Готово к отправке снабженцу / металлобазе.');

  return lines.join('\n');
}
