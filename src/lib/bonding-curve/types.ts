export type CurveShape =
  | 'linear'
  | 'exponential'
  | 'multi_segment'
  | 'sigmoidal'
  | 'logarithmic'
  | 'constant_product';

export type QuoteToken = 'SOL' | 'USDC' | 'USDT';

export type MigrationTarget = 'meteora_dlmm' | 'meteora_damm_v2';

export interface PiecewiseSegment {
  id: string;
  name: string;
  supplyPercentage: number; // e.g. 30 (representing 30% of bonding supply)
  shape: 'linear' | 'exponential' | 'flat';
  growthMultiplier: number; // steepness
  targetPriceSol: number;
}

export interface DynamicFeeConfig {
  enabled: boolean;
  baseFeeBps: number; // e.g. 100 = 1.0%
  maxFeeBps: number; // e.g. 500 = 5.0%
  surgeMultiplier: number; // dynamic surge factor during high velocity
  decayRateBpsPerMinute: number; // recovery speed back to base fee
  creatorSharePercentage: number; // e.g. 50%
  protocolSharePercentage: number; // e.g. 50%
}

export interface DLMMConfig {
  binStep: number; // e.g. 10, 20, 25, 50 bps
  feeTierBps: number; // e.g. 25, 100, 200
  initialActiveBinMultiplier: number; // multiplier relative to graduation price
  distributionShape: 'spot_balanced' | 'curve' | 'bid_ask';
  lockedDurationDays: number; // 0 for permanent burn, >0 for locked LP
}

export interface GenomeConfig {
  id: string;
  name: string;
  symbol: string;
  description: string;
  version: string;
  author: string;
  createdAt: number;
  hash: string;
  parentGenomeId?: string | null;
  forkMessage?: string;
  tags: string[];

  // Token Parameters
  totalSupply: number; // e.g. 1,000,000,000
  bondingCurveSupply: number; // e.g. 800,000,000
  decimals: number; // standard 6 or 9

  // Curve Topology
  shape: CurveShape;
  initialPriceSol: number; // e.g. 0.00000002 SOL
  graduationPriceSol: number; // e.g. 0.00000025 SOL
  graduationSolThreshold: number; // e.g. 85 SOL
  exponent: number; // For exponential shape (e.g. 1.8)
  
  // Virtual Reserves (Meteora DBC core feature)
  virtualSolReserve: number; // Virtual SOL offset for initial liquidity & slippage dampening
  virtualTokenReserve: number; // Virtual Token reserve
  
  // Piecewise multi-segment custom config
  segments?: PiecewiseSegment[];

  // Quotes & Migration
  quoteToken: QuoteToken;
  dynamicFees: DynamicFeeConfig;
  migrationTarget: MigrationTarget;
  dlmmConfig: DLMMConfig;
}

export interface CurvePoint {
  supply: number; // tokens sold
  supplyPercentage: number;
  priceSol: number;
  priceUsd: number;
  marketCapSol: number;
  marketCapUsd: number;
  realSolReserve: number;
  virtualSolReserve: number;
  slippage1SolBuy: number; // % slippage for a 1 SOL buy
  slippage10SolBuy: number; // % slippage for a 10 SOL buy
  liquidityDepthSol: number;
}

export interface TradeOrder {
  id: string;
  timestamp: number;
  step: number;
  type: 'BUY' | 'SELL';
  actor: 'Retail' | 'Whale' | 'Sniper' | 'DCA' | 'Bot' | 'PanicSeller';
  solAmount: number;
  tokenAmount: number;
  executionPriceSol: number;
  priceImpactPct: number;
  feePaidSol: number;
  effectiveFeeBps: number;
  cumulativeSolRaised: number;
  cumulativeVolumeSol: number;
  cumulativeFeesSol: number;
  graduationPct: number;
}

export interface SimulationResult {
  scenarioId: string;
  scenarioName: string;
  totalOrders: number;
  totalVolumeSol: number;
  totalFeesCollectedSol: number;
  creatorFeeShareSol: number;
  peakPriceSol: number;
  finalPriceSol: number;
  finalSolRaised: number;
  graduationReached: boolean;
  graduationStep: number | null;
  avgSlippagePct: number;
  maxDrawdownPct: number;
  timeSeries: SimulationPoint[];
  trades: TradeOrder[];
  distributionStats: {
    top10HoldersPct: number;
    retailHoldersCount: number;
    whaleHoldersCount: number;
    giniCoefficient: number; // 0 (perfect equality) to 1 (monopoly)
  };
}

export interface SimulationPoint {
  step: number;
  timestamp: number;
  priceSol: number;
  solRaised: number;
  tokensSold: number;
  volumeSol: number;
  currentFeeBps: number;
  graduationPct: number;
  activeTradersCount: number;
}

export interface AttackVectorResult {
  id: string;
  name: string;
  description: string;
  category: 'Sniper Defense' | 'Slippage Stability' | 'Liquidity Retention' | 'MEV Resistance' | 'Graduation Cliff';
  severity: 'PASS' | 'WARNING' | 'CRITICAL';
  score: number; // 0 to 100
  metricValue: string;
  metricLabel: string;
  explanation: string;
  recommendation: string;
}

export interface StressAuditReport {
  overallResilienceScore: number; // 0 to 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  vectors: AttackVectorResult[];
  vulnerabilitiesFound: number;
  mitigationTips: string[];
}
