import type { HoleDepth, MeasurementInput, PostType } from '../../types/measurement';
import type { GeometryResult } from '../../types/calculation';

/** Диаметр лунки под столб, м (Ø200 мм по SPEC). */
export const HOLE_DIAMETER_M = 0.2;
const HOLE_RADIUS_M = HOLE_DIAMETER_M / 2;

const STONE_DENSITY_KG_M3 = 1450;
/** Бетон М200 (1 : 3 : 4 по массе): кг на 1 м³ чистого объёма лунки. */
const CEMENT_KG_PER_M3 = 300;
const SAND_KG_PER_M3 = 900;
const GRAVEL_KG_PER_M3 = 1200;
const BULK_RESERVE_FACTOR = 1.1;

const POST_CROSS_SECTION_M2: Record<PostType, number> = {
  pipe_60x40x2: 0.06 * 0.04,
  pipe_60x60x2: 0.06 * 0.06,
  pipe_60x60x3: 0.06 * 0.06,
  pipe_80x80x3: 0.08 * 0.08,
  pipe_100x100x3: 0.1 * 0.1,
};

const GATE_POST_CROSS_SECTION_M2 = 0.08 * 0.08;

export interface BulkMaterialsResult {
  totalNetVolumeM3: number;
  /** Щебень для забутовки (ramming_stone). */
  totalStoneKg: number;
  totalCementKg: number;
  totalSandKg: number;
  /** Щебень в составе бетона (concreting). */
  totalGravelKg: number;
}

export function calcNetHoleVolumeM3(holeDepth: HoleDepth, postCrossSectionM2: number): number {
  const holeVolumeM3 = Math.PI * HOLE_RADIUS_M ** 2 * holeDepth;
  const postVolumeM3 = postCrossSectionM2 * holeDepth;
  return Math.max(0, holeVolumeM3 - postVolumeM3);
}

export function calculateBulkMaterials(
  input: MeasurementInput,
  geometry: GeometryResult,
): BulkMaterialsResult {
  const fencePostSection = POST_CROSS_SECTION_M2[input.postType];
  const fenceVolumeM3 =
    geometry.fencePostsCount * calcNetHoleVolumeM3(input.holeDepth, fencePostSection);
  const gateVolumeM3 =
    geometry.gatePostsCount * calcNetHoleVolumeM3(input.holeDepth, GATE_POST_CROSS_SECTION_M2);
  const totalNetVolumeM3 = fenceVolumeM3 + gateVolumeM3;

  if (input.foundationType === 'screw_piles' || totalNetVolumeM3 <= 0) {
    return {
      totalNetVolumeM3: 0,
      totalStoneKg: 0,
      totalCementKg: 0,
      totalSandKg: 0,
      totalGravelKg: 0,
    };
  }

  if (input.foundationType === 'ramming_stone') {
    return {
      totalNetVolumeM3,
      totalStoneKg: Math.ceil(totalNetVolumeM3 * STONE_DENSITY_KG_M3 * BULK_RESERVE_FACTOR),
      totalCementKg: 0,
      totalSandKg: 0,
      totalGravelKg: 0,
    };
  }

  const reserve = totalNetVolumeM3 * BULK_RESERVE_FACTOR;
  return {
    totalNetVolumeM3,
    totalStoneKg: 0,
    totalCementKg: Math.ceil(reserve * CEMENT_KG_PER_M3),
    totalSandKg: Math.ceil(reserve * SAND_KG_PER_M3),
    totalGravelKg: Math.ceil(reserve * GRAVEL_KG_PER_M3),
  };
}
