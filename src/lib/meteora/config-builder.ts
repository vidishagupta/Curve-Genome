import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { GenomeConfig } from '../bonding-curve/types';
import { MeteoraDBCDeployParams, WSOL_MINT, USDC_MINT } from './types';

export function compileGenomeToMeteoraParams(genome: GenomeConfig): MeteoraDBCDeployParams {
  const decimalMultiplier = BigInt(10 ** genome.decimals);
  const totalSupplyUnits = BigInt(genome.totalSupply) * decimalMultiplier;
  const bondingSupplyUnits = BigInt(genome.bondingCurveSupply) * decimalMultiplier;
  
  const virtualSolLamports = BigInt(Math.round(genome.virtualSolReserve * LAMPORTS_PER_SOL));
  const virtualTokenUnits = BigInt(Math.round(genome.virtualTokenReserve)) * decimalMultiplier;
  const gradLamports = BigInt(Math.round(genome.graduationSolThreshold * LAMPORTS_PER_SOL));

  const quoteMint = genome.quoteToken === 'USDC' ? USDC_MINT : WSOL_MINT;

  return {
    genomeId: genome.id,
    tokenName: genome.name,
    tokenSymbol: genome.symbol,
    tokenDecimals: genome.decimals,
    totalSupply: totalSupplyUnits,
    bondingCurveSupply: bondingSupplyUnits,
    initialVirtualSolLamports: virtualSolLamports,
    initialVirtualTokenUnits: virtualTokenUnits,
    graduationThresholdLamports: gradLamports,
    baseFeeBps: genome.dynamicFees.baseFeeBps,
    maxFeeBps: genome.dynamicFees.maxFeeBps,
    dynamicFeeEnabled: genome.dynamicFees.enabled,
    creatorShareBps: genome.dynamicFees.creatorSharePercentage * 100,
    dlmmBinStep: genome.dlmmConfig.binStep,
    dlmmFeeTierBps: genome.dlmmConfig.feeTierBps,
    quoteMint,
    migrationTarget: genome.migrationTarget,
  };
}

export function generateDeployManifestYAML(genome: GenomeConfig): string {
  const params = compileGenomeToMeteoraParams(genome);

  return `# CURVE GENOME -> METEORA DBC DEPLOYMENT MANIFEST
# Protocol: Meteora Dynamic Bonding Curve (DBC)
# Genome Fingerprint: ${genome.hash}
# Version: ${genome.version}

metadata:
  name: "${genome.name}"
  symbol: "${genome.symbol}"
  decimals: ${genome.decimals}
  author: "${genome.author}"
  created_at: ${new Date(genome.createdAt).toISOString()}

bonding_curve:
  shape: ${genome.shape}
  total_supply: ${genome.totalSupply.toLocaleString()}
  curve_supply: ${genome.bondingCurveSupply.toLocaleString()}
  virtual_sol_reserve: ${genome.virtualSolReserve} SOL (${params.initialVirtualSolLamports.toString()} lamports)
  virtual_token_reserve: ${genome.virtualTokenReserve.toLocaleString()}
  graduation_threshold: ${genome.graduationSolThreshold} SOL (${params.graduationThresholdLamports.toString()} lamports)
  initial_price_sol: ${genome.initialPriceSol}
  graduation_price_sol: ${genome.graduationPriceSol}

dynamic_fees:
  enabled: ${genome.dynamicFees.enabled}
  base_fee_bps: ${genome.dynamicFees.baseFeeBps} (${(genome.dynamicFees.baseFeeBps / 100).toFixed(2)}%)
  max_fee_bps: ${genome.dynamicFees.maxFeeBps} (${(genome.dynamicFees.maxFeeBps / 100).toFixed(2)}%)
  surge_multiplier: ${genome.dynamicFees.surgeMultiplier}x
  creator_share: ${genome.dynamicFees.creatorSharePercentage}%

migration_target:
  target: ${genome.migrationTarget}
  dlmm_bin_step: ${genome.dlmmConfig.binStep} bps
  dlmm_fee_tier: ${genome.dlmmConfig.feeTierBps} bps
  locked_duration_days: ${genome.dlmmConfig.lockedDurationDays}
`;
}
