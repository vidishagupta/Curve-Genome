import { PublicKey } from '@solana/web3.js';
import { GenomeConfig } from '../bonding-curve/types';

export const METEORA_DBC_PROGRAM_ID_DEVNET = new PublicKey(
  'dbcd77Mmxk5MEyifNmJbvpmNmFFV6Z3bVf4gYF1t3zW'
);

export const METEORA_DLMM_PROGRAM_ID = new PublicKey(
  'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo'
);

export const WSOL_MINT = new PublicKey(
  'So11111111111111111111111111111111111111112'
);

export const USDC_MINT = new PublicKey(
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
);

export interface MeteoraDBCDeployParams {
  genomeId: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  totalSupply: bigint;
  bondingCurveSupply: bigint;
  initialVirtualSolLamports: bigint;
  initialVirtualTokenUnits: bigint;
  graduationThresholdLamports: bigint;
  baseFeeBps: number;
  maxFeeBps: number;
  dynamicFeeEnabled: boolean;
  creatorShareBps: number;
  dlmmBinStep: number;
  dlmmFeeTierBps: number;
  quoteMint: PublicKey;
  migrationTarget: 'meteora_dlmm' | 'meteora_damm_v2';
}

export interface DBCPoolState {
  poolAddress: string;
  creator: string;
  tokenMint: string;
  tokenSymbol: string;
  tokenName: string;
  quoteMint: string;
  realSolReserveLamports: bigint;
  virtualSolReserveLamports: bigint;
  tokensSold: bigint;
  bondingCurveSupply: bigint;
  graduationThresholdLamports: bigint;
  isGraduated: boolean;
  dlmmPoolAddress?: string;
  totalVolumeSol: number;
  totalFeesCollectedSol: number;
  createdAt: number;
}
