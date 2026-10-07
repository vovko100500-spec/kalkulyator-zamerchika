import { describe, expect, it } from 'vitest';
import type { MeasurementInput } from '../../types/measurement';
import { calculateGeometry } from './geometry';
import { calcNetHoleVolumeM3, calculateBulkMaterials } from './bulkMaterials';

const baseInput: MeasurementInput = {
  perimeter: 60,
  height: 2.0,
  postStep: 2.5,
  sheetingType: 'sheet_c8',
  postType: 'pipe_60x40x2',
  railType: 'pipe_40x20x2',
  railRows: 2,
  foundationType: 'ramming_stone',
  holeDepth: 1.0,
  gatesType: 'sliding_4m',
  gatesAutomation: false,
  wicketsCount: 1,
  wicketLock: 'mechanical',
  demolitionLength: 0,
  hardSoil: false,
  noElectricity: false,
};

describe('bulkMaterials', () => {
  it('считает чистый объём лунки с учётом сечения столба', () => {
    const volume60x60 = calcNetHoleVolumeM3(1.0, 0.06 * 0.06);
    expect(volume60x60).toBeCloseTo(0.0278, 3);
  });

  it('считает щебень для забутовки по объёму всех столбов', () => {
    const geometry = calculateGeometry(baseInput);
    const bulk = calculateBulkMaterials(baseInput, geometry);

    expect(geometry.totalPostsCount).toBe(26);
    expect(bulk.totalNetVolumeM3).toBeCloseTo(0.742, 2);
    expect(bulk.totalStoneKg).toBe(1185);
    expect(bulk.totalCementKg).toBe(0);
    expect(bulk.totalSandKg).toBe(0);
  });

  it('считает цемент и песок для бетонирования', () => {
    const input: MeasurementInput = {
      ...baseInput,
      foundationType: 'concreting',
      holeDepth: 1.5,
      postType: 'pipe_60x60x2',
    };
    const geometry = calculateGeometry(input);
    const bulk = calculateBulkMaterials(input, geometry);

    expect(bulk.totalStoneKg).toBe(0);
    expect(bulk.totalCementKg).toBeGreaterThan(0);
    expect(bulk.totalSandKg).toBeGreaterThan(bulk.totalCementKg);
  });

  it('не считает сыпучку для винтовых свай', () => {
    const input: MeasurementInput = {
      ...baseInput,
      foundationType: 'screw_piles',
    };
    const geometry = calculateGeometry(input);
    const bulk = calculateBulkMaterials(input, geometry);

    expect(bulk.totalNetVolumeM3).toBe(0);
    expect(bulk.totalStoneKg).toBe(0);
    expect(bulk.totalCementKg).toBe(0);
    expect(bulk.totalSandKg).toBe(0);
  });
});
