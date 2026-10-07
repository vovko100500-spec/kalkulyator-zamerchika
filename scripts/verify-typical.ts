import { defaultCatalog } from '../src/db/defaultCatalog';
import { calculateEstimate } from '../src/logic/calculator';
import type { MeasurementInput } from '../src/types/measurement';

const typicalInput: MeasurementInput = {
  perimeter: 60,
  height: 2.0,
  postStep: 2.5,
  sheetingType: 'sheet_c8',
  postType: 'pipe_60x60x2',
  railType: 'pipe_40x20x2',
  railRows: 2,
  foundationType: 'ramming_stone',
  holeDepth: 1.5,
  gatesType: 'sliding_4m',
  gatesAutomation: false,
  wicketsCount: 1,
  wicketLock: 'mechanical',
  demolitionLength: 0,
  hardSoil: false,
  noElectricity: false,
};

function formatRub(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

const result = calculateEstimate(typicalInput, defaultCatalog);
const { geometry, materials, labor, financial } = result;

console.log('\n=== Типовой объект: 60 м, профнастил С8 2.0 м, откатные ворота 4 м, 1 калитка ===\n');

console.log('--- Геометрия ---');
console.log(`Чистая длина ограждения:     ${geometry.netLength} м`);
console.log(`Столбы забора:               ${geometry.fencePostsCount} шт`);
console.log(`Столбы ворот/калитки:        ${geometry.gatePostsCount} шт`);
console.log(`Хлысты столбов 6 м:          ${geometry.stockPostsCount} шт`);
console.log(`Хлысты лаг 6 м:              ${geometry.stockRailsCount} шт`);
console.log(`Листы профнастила С8:        ${materials.sheetsCount} лист`);
console.log(`Саморезы:                    ${materials.screwsCount} шт`);
console.log(`Заглушки:                    ${materials.capsCount} шт`);
console.log(`Щебень:                      ${materials.totalStoneKg} кг`);

console.log('\n--- Материалы ---');
for (const item of materials.items) {
  console.log(
    `${item.name}: ${item.quantity} ${item.unit} × ${formatRub(item.unitPrice)} = ${formatRub(item.totalPrice)}`,
  );
}
console.log(`Итого материалы:             ${formatRub(materials.totalCost)}`);

console.log('\n--- Работы ---');
for (const item of labor.items) {
  console.log(
    `${item.name}: ${item.quantity} ${item.unit} × ${formatRub(item.unitPrice)} = ${formatRub(item.totalPrice)}`,
  );
}
console.log(`Итого работы:                ${formatRub(labor.totalCost)}`);

console.log('\n--- Финансы ---');
console.log(`Себестоимость материалов:    ${formatRub(financial.materialCost)}`);
console.log(`Оплата монтажникам:         ${formatRub(financial.laborCost)}`);
console.log(`Доставка:                    ${formatRub(financial.deliveryCost)}`);
console.log(`Полная себестоимость:        ${formatRub(financial.totalCost)}`);
console.log(`Рекомендованная цена:        ${formatRub(financial.recommendedPrice)}`);
console.log(`Порог торга (мин. цена):     ${formatRub(financial.minPrice)}`);
console.log(`Чистая прибыль:              ${formatRub(financial.profit)}`);
console.log('');
