import { GenomeConfig } from '../bonding-curve/types';

/**
 * Computes a deterministic 16-character hex hash representation of a genome configuration
 */
export function generateGenomeHash(config: Partial<GenomeConfig>): string {
  const payload = [
    config.shape,
    config.initialPriceSol,
    config.graduationPriceSol,
    config.graduationSolThreshold,
    config.bondingCurveSupply,
    config.virtualSolReserve,
    config.virtualTokenReserve,
    config.exponent,
    config.dynamicFees?.baseFeeBps,
    config.dynamicFees?.maxFeeBps,
    config.dynamicFees?.enabled,
    config.migrationTarget,
    config.dlmmConfig?.binStep,
    config.dlmmConfig?.feeTierBps,
    JSON.stringify(config.segments || []),
  ].join(':');

  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  const hex1 = Math.abs(hash).toString(16).padStart(8, '0');
  // Secondary hash for 16-char uniqueness
  let hash2 = 5381;
  for (let i = 0; i < payload.length; i++) {
    hash2 = (hash2 * 33) ^ payload.charCodeAt(i);
  }
  const hex2 = Math.abs(hash2 >>> 0).toString(16).padStart(8, '0');

  return `${hex1}${hex2}`;
}

/**
 * Validates if two genomes are mathematically identical
 */
export function areGenomesIdentical(g1: GenomeConfig, g2: GenomeConfig): boolean {
  return generateGenomeHash(g1) === generateGenomeHash(g2);
}
