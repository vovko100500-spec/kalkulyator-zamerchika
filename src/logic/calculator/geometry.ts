import type { GatesType, MeasurementInput } from '../../types/measurement';
import type { GeometryResult } from '../../types/calculation';

const WICKET_WIDTH_M = 1.0;
const STOCK_LENGTH_M = 6.0;
const RAIL_OVERLAP_FACTOR = 1.05;

export function getGatesWidth(gatesType: GatesType): number {
  switch (gatesType) {
    case 'none':
      return 0;
    case 'swing_4m':
    case 'sliding_4m':
      return 4.0;
    case 'sliding_5m':
      return 5.0;
  }
}

export function getGatePostsCount(gatesType: GatesType, wicketsCount: number): number {
  let count = 0;

  if (gatesType === 'sliding_4m' || gatesType === 'sliding_5m' || gatesType === 'swing_4m') {
    count += 2;
  }

  count += wicketsCount;
  return count;
}

export function calculateGeometry(input: MeasurementInput): GeometryResult {
  const gatesWidth = getGatesWidth(input.gatesType);
  const netLength = input.perimeter - gatesWidth - input.wicketsCount * WICKET_WIDTH_M;
  const fencePostsCount = Math.ceil(netLength / input.postStep) + 1;
  const gatePostsCount = getGatePostsCount(input.gatesType, input.wicketsCount);
  const postLength = input.height + input.holeDepth;
  const stockPostsCount = Math.ceil((fencePostsCount * postLength) / STOCK_LENGTH_M);
  const rawRailsMeters = netLength * input.railRows * RAIL_OVERLAP_FACTOR;
  const stockRailsCount = Math.ceil(rawRailsMeters / STOCK_LENGTH_M);

  return {
    gatesWidth,
    netLength,
    fencePostsCount,
    gatePostsCount,
    totalPostsCount: fencePostsCount + gatePostsCount,
    postLength,
    stockPostsCount,
    rawRailsMeters,
    stockRailsCount,
  };
}
