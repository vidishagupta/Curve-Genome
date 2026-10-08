import { GenomeConfig, SimulationResult, StressAuditReport } from '../bonding-curve/types';
import { calculateInstantaneousPrice, calculateTokensForSol } from '../bonding-curve/math';

export interface AIAnalysisReport {
  summaryTitle: string;
  executiveSummary: string;
  tokenomicProfile: {
    archetype: 'Fair Launch' | 'High Velocity Momentum' | 'Institutional Deep Liquidity' | 'Anti-Snipe Defensive' | 'Custom Experimental';
    capitalEfficiencyRating: string;
    sniperRiskIndex: string;
    liquidityDepthGrade: string;
  };
  behavioralDiagnostics: {
    phase: string;
    description: string;
    mechanicsWhy: string;
  }[];
  mathematicalInsights: {
    title: string;
    value: string;
    impact: string;
  }[];
  recommendedFixes: {
    actionName: string;
    rationale: string;
    parameterChange: string;
    presetPatch: Partial<GenomeConfig>;
  }[];
}

export function generateAICurveAnalysis(
  genome: GenomeConfig,
  simResult?: SimulationResult,
  stressAudit?: StressAuditReport
): AIAnalysisReport {
  const p0 = genome.initialPriceSol;
  const pGrad = genome.graduationPriceSol;
  const priceGrowthMultiplier = (pGrad / Math.max(p0, 1e-9));
  const vSol = genome.virtualSolReserve;
  const gradSol = genome.graduationSolThreshold;
  const dynFeeMax = genome.dynamicFees.enabled ? genome.dynamicFees.maxFeeBps : genome.dynamicFees.baseFeeBps;

  // 1. Determine Archetype
  let archetype: AIAnalysisReport['tokenomicProfile']['archetype'] = 'Fair Launch';
  if (vSol >= 50 && genome.dynamicFees.baseFeeBps <= 50) {
    archetype = 'Institutional Deep Liquidity';
  } else if (genome.shape === 'exponential' && genome.exponent > 1.8) {
    archetype = 'High Velocity Momentum';
  } else if (vSol >= 30 && dynFeeMax >= 350) {
    archetype = 'Anti-Snipe Defensive';
  } else if (genome.shape === 'multi_segment') {
    archetype = 'Fair Launch';
  } else {
    archetype = 'Custom Experimental';
  }

  // 2. Compute Capital Efficiency & Sniper Risk
  const testBuy10Sol = calculateTokensForSol(10, 0, genome);
  const sniperCapturePct = (testBuy10Sol.tokensOut / genome.bondingCurveSupply) * 100;
  const sniperRisk = sniperCapturePct > 20 ? 'HIGH' : sniperCapturePct > 10 ? 'MODERATE' : 'LOW';
  const capitalEfficiency = ((gradSol / (vSol + gradSol)) * 100).toFixed(1) + '% Real Capital Utilization';

  // 3. Behavioral Diagnostics (Why it behaves this way)
  const behavioralDiagnostics: AIAnalysisReport['behavioralDiagnostics'] = [];

  // Stage 1 (0-20% supply)
  behavioralDiagnostics.push({
    phase: 'T0 Inception & Initial Discovery (0% - 25% Supply)',
    description: `Starting price is ${p0} SOL with ${vSol} SOL virtual cushion.`,
    mechanicsWhy: vSol > 25
      ? `High virtual SOL reserve (V_sol = ${vSol} SOL) flattens early price impact, requiring ~${(vSol * 0.3).toFixed(1)} SOL before noticeable price inflection occurs. This shields early retail from being immediately priced out by bot frontrunners.`
      : `Low virtual SOL reserve (V_sol = ${vSol} SOL) creates high price sensitivity: small initial buys will cause rapid vertical spikes, rewarding first-block buyers with high paper multipliers.`,
  });

  // Stage 2 (25-75% supply)
  behavioralDiagnostics.push({
    phase: 'Mid-Curve Expansion (25% - 75% Supply)',
    description: `Shape: ${genome.shape.toUpperCase()} topology with dynamic fee schedule (${(genome.dynamicFees.baseFeeBps / 100).toFixed(2)}% - ${(dynFeeMax / 100).toFixed(2)}%).`,
    mechanicsWhy: genome.dynamicFees.enabled
      ? `Dynamic fee surge mechanism taxes high trading velocity during aggressive volume bursts, routing extra LP yield (${genome.dynamicFees.creatorSharePercentage}% creator share) to the pool and increasing slippage for toxic MEV flow.`
      : `Static fee structure keeps trading costs predictable, but leaves retail exposed to sandwich arbitrage if volatility accelerates.`,
  });

  // Stage 3 (Graduation Leg)
  behavioralDiagnostics.push({
    phase: 'Graduation Trigger & DLMM Transition (75% - 100%)',
    description: `Target: ${gradSol} SOL raised -> ${genome.migrationTarget === 'meteora_dlmm' ? `Meteora DLMM (${genome.dlmmConfig.binStep} bps bins)` : 'Meteora DAMM v2'}.`,
    mechanicsWhy: `Upon crossing ${gradSol} SOL, the curve automatically migrates all accumulated SOL (${gradSol} SOL) alongside remaining tokens into Meteora DLMM with a bin step of ${genome.dlmmConfig.binStep} bps, ensuring zero gap liquidity at active bin price ${pGrad} SOL.`,
  });

  // 4. Mathematical Insights
  const mathematicalInsights = [
    {
      title: 'Price Expansion Multiple',
      value: `${priceGrowthMultiplier.toFixed(1)}x`,
      impact: priceGrowthMultiplier > 25 ? 'High momentum / speculative curve' : 'Sustainable organic growth range',
    },
    {
      title: 'Virtual Reserve Damping Factor',
      value: `${vSol} SOL`,
      impact: vSol >= 30 ? 'Strong resistance against bot sweeps' : 'High early price volatility',
    },
    {
      title: 'Dynamic Fee Ceiling',
      value: `${(dynFeeMax / 100).toFixed(2)}%`,
      impact: dynFeeMax >= 300 ? 'Active MEV sandwich suppression' : 'Standard DEX fee profile',
    },
    {
      title: 'DLMM Migration Active Bin Step',
      value: `${genome.dlmmConfig.binStep} bps (${(genome.dlmmConfig.binStep / 100).toFixed(2)}%)`,
      impact: 'Determines tick width and post-graduation price efficiency',
    },
  ];

  // 5. Actionable Recommendations
  const recommendedFixes: AIAnalysisReport['recommendedFixes'] = [];

  if (vSol < 25) {
    recommendedFixes.push({
      actionName: 'Deepen Virtual Liquidity Buffer',
      rationale: 'Virtual SOL is under 25 SOL, making Block 0 susceptible to sniper monopolization.',
      parameterChange: 'Increase Virtual SOL Reserve from ' + vSol + ' to 35 SOL',
      presetPatch: { virtualSolReserve: 35 },
    });
  }

  if (!genome.dynamicFees.enabled || dynFeeMax < 300) {
    recommendedFixes.push({
      actionName: 'Activate Meteora Dynamic Fee Shield',
      rationale: 'Protect retail orders from mempool sandwiching by enabling dynamic surge fees up to 4.0%.',
      parameterChange: 'Enable Dynamic Fees with maxFeeBps = 400',
      presetPatch: {
        dynamicFees: {
          ...genome.dynamicFees,
          enabled: true,
          maxFeeBps: 400,
          surgeMultiplier: 2.5,
        },
      },
    });
  }

  if (priceGrowthMultiplier > 40) {
    recommendedFixes.push({
      actionName: 'Smooth Tail Graduation Slope',
      rationale: 'Price increases over 40x, creating a late-stage buyer hesitation cliff near graduation.',
      parameterChange: 'Adjust graduation price to ' + (p0 * 20).toFixed(8) + ' SOL (20x)',
      presetPatch: { graduationPriceSol: p0 * 20 },
    });
  }

  if (genome.shape === 'linear') {
    recommendedFixes.push({
      actionName: 'Upgrade to Piecewise Multi-Segment',
      rationale: 'Multi-segment topology allows dedicated anti-snipe flat pricing early on, followed by exponential graduation.',
      parameterChange: 'Switch to Multi-Segment with 3-stage curve',
      presetPatch: {
        shape: 'multi_segment',
        segments: [
          { id: 's1', name: 'Anti-Snipe Discovery', supplyPercentage: 25, shape: 'flat', growthMultiplier: 1, targetPriceSol: p0 * 1.5 },
          { id: 's2', name: 'Organic Expansion', supplyPercentage: 50, shape: 'linear', growthMultiplier: 1.2, targetPriceSol: p0 * 6 },
          { id: 's3', name: 'Graduation Thrust', supplyPercentage: 25, shape: 'exponential', growthMultiplier: 2.0, targetPriceSol: pGrad },
        ],
      },
    });
  }

  return {
    summaryTitle: `${archetype} Topology (${priceGrowthMultiplier.toFixed(1)}x Multiple)`,
    executiveSummary: `This Genome represents a ${archetype.toLowerCase()} architecture. It is engineered with a starting price of ${p0} SOL scaling to ${pGrad} SOL (${priceGrowthMultiplier.toFixed(1)}x). Virtual SOL reserve is calibrated at ${vSol} SOL with ${genome.dynamicFees.enabled ? `dynamic fee protection up to ${(dynFeeMax / 100).toFixed(2)}%` : 'fixed fees'}.`,
    tokenomicProfile: {
      archetype,
      capitalEfficiencyRating: capitalEfficiency,
      sniperRiskIndex: sniperRisk,
      liquidityDepthGrade: vSol >= 40 ? 'Grade A (Deep)' : vSol >= 25 ? 'Grade B (Standard)' : 'Grade C (Shallow)',
    },
    behavioralDiagnostics,
    mathematicalInsights,
    recommendedFixes,
  };
}
