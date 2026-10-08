import { CurvePoint, GenomeConfig } from './types';

export const SOL_PRICE_USD = 150; // Reference conversion price

/**
 * Calculates instantaneous price P(s) at given supply `s` (tokens sold so far)
 */
export function calculateInstantaneousPrice(
  s: number,
  config: GenomeConfig
): number {
  const S_max = Math.max(config.bondingCurveSupply, 1);
  const p0 = Math.max(config.initialPriceSol, 1e-9);
  const pGrad = Math.max(config.graduationPriceSol, p0 * 1.01);
  const progress = Math.min(Math.max(s / S_max, 0), 1);

  switch (config.shape) {
    case 'linear': {
      // P(s) = p0 + (pGrad - p0) * (s / S_max)
      return p0 + (pGrad - p0) * progress;
    }

    case 'exponential': {
      // P(s) = p0 + (pGrad - p0) * (s / S_max)^k
      const k = config.exponent || 2.0;
      return p0 + (pGrad - p0) * Math.pow(progress, k);
    }

    case 'sigmoidal': {
      // S-curve centered at 50% supply
      const sigmoid = 1 / (1 + Math.exp(-10 * (progress - 0.5)));
      const sig0 = 1 / (1 + Math.exp(5));
      const sig1 = 1 / (1 + Math.exp(-5));
      const normalizedSig = (sigmoid - sig0) / (sig1 - sig0);
      return p0 + (pGrad - p0) * normalizedSig;
    }

    case 'logarithmic': {
      // Fast initial growth, diminishing returns near graduation
      const logVal = Math.log(1 + 9 * progress) / Math.log(10);
      return p0 + (pGrad - p0) * logVal;
    }

    case 'multi_segment': {
      if (!config.segments || config.segments.length === 0) {
        return p0 + (pGrad - p0) * progress;
      }
      
      let accumSupplyPct = 0;
      let prevPrice = p0;
      const currentPct = progress * 100;

      for (const seg of config.segments) {
        const segEnd = accumSupplyPct + seg.supplyPercentage;
        if (currentPct <= segEnd || seg === config.segments[config.segments.length - 1]) {
          const segProgress = Math.min(
            Math.max((currentPct - accumSupplyPct) / Math.max(seg.supplyPercentage, 1), 0),
            1
          );
          if (seg.shape === 'exponential') {
            return prevPrice + (seg.targetPriceSol - prevPrice) * Math.pow(segProgress, seg.growthMultiplier || 2);
          } else if (seg.shape === 'flat') {
            return prevPrice;
          } else {
            return prevPrice + (seg.targetPriceSol - prevPrice) * segProgress;
          }
        }
        accumSupplyPct = segEnd;
        prevPrice = seg.targetPriceSol;
      }
      return pGrad;
    }

    case 'constant_product':
    default: {
      // Meteora virtual reserve CPMM: P(s) = (V_sol + R_sol(s)) / (V_token - s)
      const vSol = Math.max(config.virtualSolReserve, 1);
      const vToken = Math.max(config.virtualTokenReserve, config.bondingCurveSupply);
      const remainingToken = Math.max(vToken - s, 1);
      const k = vSol * vToken;
      // Price = dSol / dToken = k / (remainingToken^2)
      return k / (remainingToken * remainingToken);
    }
  }
}

/**
 * Calculates total SOL required to buy tokens from supply `s1` to `s2` (Numerical integration)
 */
export function calculateSolRequired(
  s1: number,
  s2: number,
  config: GenomeConfig,
  steps = 50
): number {
  if (s2 <= s1) return 0;
  const delta = (s2 - s1) / steps;
  let solTotal = 0;

  // Trapezoidal rule integration with virtual SOL damping
  for (let i = 0; i < steps; i++) {
    const a = s1 + i * delta;
    const b = a + delta;
    const pA = calculateInstantaneousPrice(a, config);
    const pB = calculateInstantaneousPrice(b, config);
    solTotal += ((pA + pB) / 2) * delta;
  }

  return solTotal;
}

/**
 * Given `solIn` amount of SOL, calculates how many tokens will be received starting at current supply `sCurrent`
 */
export function calculateTokensForSol(
  solIn: number,
  sCurrent: number,
  config: GenomeConfig
): { tokensOut: number; avgPriceSol: number; priceImpactPct: number; newSupply: number } {
  const maxAvailable = Math.max(config.bondingCurveSupply - sCurrent, 0);
  if (solIn <= 0 || maxAvailable <= 0) {
    const currentP = calculateInstantaneousPrice(sCurrent, config);
    return { tokensOut: 0, avgPriceSol: currentP, priceImpactPct: 0, newSupply: sCurrent };
  }

  // Binary search for supply target
  let low = sCurrent;
  let high = config.bondingCurveSupply;
  const maxSolPossible = calculateSolRequired(sCurrent, high, config, 40);

  if (solIn >= maxSolPossible) {
    const tokensOut = high - sCurrent;
    const avgPriceSol = maxSolPossible / tokensOut;
    const pStart = calculateInstantaneousPrice(sCurrent, config);
    const pEnd = calculateInstantaneousPrice(high, config);
    const priceImpactPct = ((pEnd - pStart) / pStart) * 100;
    return { tokensOut, avgPriceSol, priceImpactPct, newSupply: high };
  }

  for (let iter = 0; iter < 32; iter++) {
    const mid = (low + high) / 2;
    const solForMid = calculateSolRequired(sCurrent, mid, config, 20);
    if (Math.abs(solForMid - solIn) < 0.0001 * solIn) {
      low = mid;
      break;
    }
    if (solForMid < solIn) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const newSupply = low;
  const tokensOut = newSupply - sCurrent;
  const avgPriceSol = solIn / Math.max(tokensOut, 1);
  const pStart = calculateInstantaneousPrice(sCurrent, config);
  const pEnd = calculateInstantaneousPrice(newSupply, config);
  const priceImpactPct = ((pEnd - pStart) / Math.max(pStart, 1e-9)) * 100;

  return { tokensOut, avgPriceSol, priceImpactPct, newSupply };
}

/**
 * Given `tokensIn` amount of tokens to sell, calculates how much SOL will be returned
 */
export function calculateSolForTokens(
  tokensIn: number,
  sCurrent: number,
  config: GenomeConfig
): { solOut: number; avgPriceSol: number; priceImpactPct: number; newSupply: number } {
  const actualTokens = Math.min(tokensIn, sCurrent);
  if (actualTokens <= 0) {
    const currentP = calculateInstantaneousPrice(sCurrent, config);
    return { solOut: 0, avgPriceSol: currentP, priceImpactPct: 0, newSupply: sCurrent };
  }

  const targetSupply = sCurrent - actualTokens;
  const solOut = calculateSolRequired(targetSupply, sCurrent, config, 40);
  const avgPriceSol = solOut / actualTokens;
  const pStart = calculateInstantaneousPrice(sCurrent, config);
  const pEnd = calculateInstantaneousPrice(targetSupply, config);
  const priceImpactPct = ((pStart - pEnd) / Math.max(pStart, 1e-9)) * 100;

  return { solOut, avgPriceSol, priceImpactPct, newSupply: targetSupply };
}

/**
 * Generates N discrete points along the curve for visualization
 */
export function generateCurvePoints(
  config: GenomeConfig,
  numPoints = 80
): CurvePoint[] {
  const points: CurvePoint[] = [];
  const totalSupply = config.bondingCurveSupply;

  for (let i = 0; i <= numPoints; i++) {
    const progress = i / numPoints;
    const supply = progress * totalSupply;
    const priceSol = calculateInstantaneousPrice(supply, config);
    const priceUsd = priceSol * SOL_PRICE_USD;
    const marketCapSol = priceSol * config.totalSupply;
    const marketCapUsd = marketCapSol * SOL_PRICE_USD;
    const realSolReserve = calculateSolRequired(0, supply, config, 30);

    // Slippage calculation for 1 SOL and 10 SOL buys
    const buy1 = calculateTokensForSol(1, supply, config);
    const slippage1SolBuy = Math.max(0, buy1.priceImpactPct);

    const buy10 = calculateTokensForSol(10, supply, config);
    const slippage10SolBuy = Math.max(0, buy10.priceImpactPct);

    // Liquidity Depth: SOL needed to move price by 2%
    const pPlus2 = priceSol * 1.02;
    const depthSol = calculateSolRequired(supply, Math.min(supply + totalSupply * 0.02, totalSupply), config, 10);

    points.push({
      supply,
      supplyPercentage: progress * 100,
      priceSol,
      priceUsd,
      marketCapSol,
      marketCapUsd,
      realSolReserve,
      virtualSolReserve: config.virtualSolReserve,
      slippage1SolBuy,
      slippage10SolBuy,
      liquidityDepthSol: depthSol,
    });
  }

  return points;
}
