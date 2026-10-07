import { describe, expect, it } from 'vitest';
import { defaultCatalog } from '../../db/defaultCatalog';
import { calculateEstimate } from '../calculator';
import { defaultMeasurementInput } from '../../store/defaults';
import { formatClientEstimate, formatProcurementList } from './index';

const typicalResult = calculateEstimate(defaultMeasurementInput, defaultCatalog);

describe('formatProcurementList', () => {
  it('включает коммерческие единицы для типового объекта', () => {
    const text = formatProcurementList(typicalResult);

    expect(text).toContain('ВЕДОМОСТЬ ЗАКУПКИ');
    expect(text).toContain('12 хлыстов (6 м)');
    expect(text).toContain('48 листов');
    expect(text).toContain('423 шт');
    expect(text).toContain('мешков');
  });
});

describe('formatClientEstimate', () => {
  it('не содержит себестоимость и маржу', () => {
    const text = formatClientEstimate(typicalResult);

    expect(text).toContain('РАСЧЁТ ЗАБОРА');
    expect(text).toContain('Профнастил С8');
    expect(text).toContain('Откатные ворота 4 м');
    expect(text).toContain('ИТОГО:');
    expect(text).toContain('Аванс');
    expect(text).not.toContain('Себестоимость');
    expect(text).not.toContain('прибыль');
    expect(text).not.toContain('маржа');
  });
});
