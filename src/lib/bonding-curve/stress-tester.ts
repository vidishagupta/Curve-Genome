import { GenomeConfig, StressAuditReport, AttackVectorResult } from './types';
import { calculateTokensForSol, calculateSolForTokens, calculateInstantaneousPrice } from './math';

export function runStressAudit(genome: GenomeConfig): StressAuditReport {
  const vectors: AttackVectorResult[] = [];
  const mitigationTips: string[] = [];

  // 1. T0 Sniper Supply Monopoly Test
  const sniperBuySol = 25;
  const sniperRes = calculateTokensForSol(sniperBuySol, 0, genome);
  const sniperSupplyPct = (sniperRes.tokensOut / genome.bondingCurveSupply) * 100;

  let sniperScore = 100;
  let sniperSeverity: AttackVectorResult['severity'] = 'PASS';
  let sniperExplanation = '';
  let sniperRec = '';

  if (sniperSupplyPct > 35) {
    sniperScore = 30;
    sniperSeverity = 'CRITICAL';
    sniperExplanation = `A single 25 SOL sniper can seize ${sniperSupplyPct.toFixed(1)}% of total bonding curve supply at T0, posing severe rug/dump vulnerability to early retail participants.`;
    sniperRec = 'Increase virtual SOL reserve (min 35-50 SOL) or implement a Phase 1 anti-snipe flat floor to dampen initial supply grab.';
    mitigationTips.push('Bump virtual SOL reserve or switch to a multi-segment curve with an early anti-snipe floor.');
  } else if (sniperSupplyPct > 20) {
    sniperScore = 65;
    sniperSeverity = 'WARNING';
    sniperExplanation = `A 25 SOL sniper captures ${sniperSupplyPct.toFixed(1)}% of the curve supply. Moderate risk of early token concentration.`;
    sniperRec = 'Consider increasing max dynamic fees to 400-500 bps during T0 high velocity spikes.';
    mitigationTips.push('Enable higher dynamic fee surge multipliers (>2.5x) to tax early bot sweeps.');
  } else {
    sniperScore = 95;
    sniperSeverity = 'PASS';
    sniperExplanation = `Excellent sniper resilience. A 25 SOL buy captures only ${sniperSupplyPct.toFixed(1)}% of supply due to robust virtual reserves.`;
    sniperRec = 'Current virtual reserve parameters are well-calibrated against sniper extraction.';
  }

  vectors.push({
    id: 'vec_sniper',
    name: 'T0 Sniper Supply Monopoly',
    description: 'Simulates a 25 SOL bot snipe at Block 0 to evaluate early supply concentration risk.',
    category: 'Sniper Defense',
    severity: sniperSeverity,
    score: sniperScore,
    metricValue: `${sniperSupplyPct.toFixed(1)}% of Supply`,
    metricLabel: 'Supply Captured',
    explanation: sniperExplanation,
    recommendation: sniperRec,
  });

  // 2. 50 SOL Instant Liquidation Shock Test
  // Test at 50% curve supply
  const midSupply = genome.bondingCurveSupply * 0.5;
  const midPrice = calculateInstantaneousPrice(midSupply, genome);
  const dumpTokens = (30 / midPrice); // 30 SOL worth of tokens dumped at once
  const dumpRes = calculateSolForTokens(dumpTokens, midSupply, genome);
  const dumpImpact = Math.abs(dumpRes.priceImpactPct);

  let dumpScore = 100;
  let dumpSeverity: AttackVectorResult['severity'] = 'PASS';
  let dumpExplanation = '';
  let dumpRec = '';

  if (dumpImpact > 60) {
    dumpScore = 35;
    dumpSeverity = 'CRITICAL';
    dumpExplanation = `A 30 SOL liquidation causes a catastrophic ${dumpImpact.toFixed(1)}% price drop at 50% curve depth. Curve lacks bid resilience.`;
    dumpRec = 'Increase virtual SOL reserve or flatten mid-curve slope to preserve liquidity depth.';
    mitigationTips.push('Increase virtual liquidity reserves to cushion against mid-stage whale sell cascades.');
  } else if (dumpImpact > 35) {
    dumpScore = 70;
    dumpSeverity = 'WARNING';
    dumpExplanation = `Moderate price shock (${dumpImpact.toFixed(1)}%) under heavy sell pressure. Acceptable for high-volatility meme assets.`;
    dumpRec = 'Raise graduation threshold or fine-tune exponential multiplier.';
  } else {
    dumpScore = 92;
    dumpSeverity = 'PASS';
    dumpExplanation = `Robust bid liquidity. 30 SOL dump creates only ${dumpImpact.toFixed(1)}% price impact.`;
    dumpRec = 'Slippage dampening parameters are optimal.';
  }

  vectors.push({
    id: 'vec_dump_shock',
    name: 'Whale Liquidation Shock',
    description: 'Simulates a sudden 30 SOL instant sell at 50% bonding progress to measure bid depth collapse.',
    category: 'Slippage Stability',
    severity: dumpSeverity,
    score: dumpScore,
    metricValue: `${dumpImpact.toFixed(1)}% Shock`,
    metricLabel: 'Price Drop Impact',
    explanation: dumpExplanation,
    recommendation: dumpRec,
  });

  // 3. MEV Sandwich & Front-running Resistance
  const dynamicFeeMax = genome.dynamicFees.enabled ? genome.dynamicFees.maxFeeBps : genome.dynamicFees.baseFeeBps;
  let mevScore = 85;
  let mevSeverity: AttackVectorResult['severity'] = 'PASS';
  let mevExplanation = '';
  let mevRec = '';

  if (!genome.dynamicFees.enabled || dynamicFeeMax < 200) {
    mevScore = 40;
    mevSeverity = 'CRITICAL';
    mevExplanation = `Dynamic fees are disabled or capped below 2.0% (${dynamicFeeMax} bps). MEV searchers can easily sandwich retail orders on Solana RPC mempools.`;
    mevRec = 'Enable Meteora Dynamic Fee Scheduler with a max fee cap of at least 350-500 bps.';
    mitigationTips.push('Activate Meteora Dynamic Fees with a 3.5% - 5.0% surge limit to disincentivize MEV sandwiches.');
  } else if (dynamicFeeMax < 350) {
    mevScore = 75;
    mevSeverity = 'WARNING';
    mevExplanation = `Dynamic fee cap is ${dynamicFeeMax} bps. Provides basic sandwich friction, but high-gas MEV bots may still extract minor value.`;
    mevRec = 'Increase surge multiplier or adjust fee decay rate.';
  } else {
    mevScore = 96;
    mevSeverity = 'PASS';
    mevExplanation = `High dynamic fee ceiling (${dynamicFeeMax} bps) dynamically taxes rapid sandwich attempts, destroying MEV bot profit margins.`;
    mevRec = 'MEV resistance configuration is enterprise-grade.';
  }

  vectors.push({
    id: 'vec_mev',
    name: 'MEV Sandwich Resistance',
    description: 'Evaluates dynamic fee surge defense against sandwich and front-running bots.',
    category: 'MEV Resistance',
    severity: mevSeverity,
    score: mevScore,
    metricValue: `${(dynamicFeeMax / 100).toFixed(2)}% Max Fee`,
    metricLabel: 'Max Dynamic Shield',
    explanation: mevExplanation,
    recommendation: mevRec,
  });

  // 4. Low Demand Stagnation & Fee Retention
  const baseFee = genome.dynamicFees.baseFeeBps;
  let stagnationScore = 80;
  let stagnationSeverity: AttackVectorResult['severity'] = 'PASS';
  let stagnationExplanation = '';
  let stagnationRec = '';

  if (baseFee < 50) {
    stagnationScore = 50;
    stagnationSeverity = 'WARNING';
    stagnationExplanation = `Base fee is very low (${baseFee} bps). In slow or sideways markets, the creator/protocol treasury will generate minimal runway to sustain marketing.`;
    stagnationRec = 'Set base fee to at least 75-100 bps to build creator revenue during low-volume periods.';
    mitigationTips.push('Set base fee to at least 1.0% to guarantee LP and creator revenue during low volume periods.');
  } else {
    stagnationScore = 90;
    stagnationSeverity = 'PASS';
    stagnationExplanation = `Base fee of ${(baseFee / 100).toFixed(2)}% guarantees sustainable protocol and creator revenue accumulation even in slow market cycles.`;
    stagnationRec = 'Fee structure ensures healthy capital retention.';
  }

  vectors.push({
    id: 'vec_stagnation',
    name: 'Low-Volume Capital Retention',
    description: 'Audits treasury fee generation efficiency and liquidity retention during sideways trading.',
    category: 'Liquidity Retention',
    severity: stagnationSeverity,
    score: stagnationScore,
    metricValue: `${(baseFee / 100).toFixed(2)}% Base Fee`,
    metricLabel: 'Baseline Fee Tier',
    explanation: stagnationExplanation,
    recommendation: stagnationRec,
  });

  // 5. Near-Graduation Cliff Resistance
  // Test price gap and DLMM transition smoothness
  const nearGradSupply = genome.bondingCurveSupply * 0.95;
  const pNearGrad = calculateInstantaneousPrice(nearGradSupply, genome);
  const pFinal = genome.graduationPriceSol;
  const cliffGapPct = Math.abs((pFinal - pNearGrad) / pNearGrad) * 100;

  let cliffScore = 90;
  let cliffSeverity: AttackVectorResult['severity'] = 'PASS';
  let cliffExplanation = '';
  let cliffRec = '';

  if (cliffGapPct > 80) {
    cliffScore = 45;
    cliffSeverity = 'WARNING';
    cliffExplanation = `Steep price jump (${cliffGapPct.toFixed(1)}%) in final 5% of curve. Risk of a "graduation wall" where buyers hesitate to push token across the threshold.`;
    cliffRec = 'Smooth the tail-end curvature or reduce exponent to prevent graduation stall.';
    mitigationTips.push('Ease tail-end curve slope to avoid buyer exhaustion right before DLMM migration.');
  } else {
    cliffScore = 94;
    cliffSeverity = 'PASS';
    cliffExplanation = `Smooth graduation gradient (${cliffGapPct.toFixed(1)}% final leg). Token transitions seamlessly into Meteora DLMM active bin.`;
    cliffRec = 'Graduation cliff resistance is optimal.';
  }

  vectors.push({
    id: 'vec_graduation_cliff',
    name: 'Near-Graduation Cliff Resistance',
    description: 'Assesses the price acceleration gradient leading into Meteora DLMM migration.',
    category: 'Graduation Cliff',
    severity: cliffSeverity,
    score: cliffScore,
    metricValue: `${cliffGapPct.toFixed(1)}% Tail Spread`,
    metricLabel: 'Final 5% Spread',
    explanation: cliffExplanation,
    recommendation: cliffRec,
  });

  // Calculate Overall Resilience Score
  const totalScore = vectors.reduce((acc, v) => acc + v.score, 0) / vectors.length;
  const overallResilienceScore = Math.round(totalScore);

  let grade: StressAuditReport['grade'] = 'A';
  if (overallResilienceScore >= 90) grade = 'A+';
  else if (overallResilienceScore >= 80) grade = 'A';
  else if (overallResilienceScore >= 70) grade = 'B';
  else if (overallResilienceScore >= 55) grade = 'C';
  else if (overallResilienceScore >= 40) grade = 'D';
  else grade = 'F';

  const vulnerabilitiesFound = vectors.filter((v) => v.severity !== 'PASS').length;

  return {
    overallResilienceScore,
    grade,
    summary:
      overallResilienceScore >= 80
        ? 'Genome displays exceptional resilience against bot manipulation, sniper extraction, and slippage shocks.'
        : overallResilienceScore >= 60
        ? 'Genome has sound fundamentals but displays vulnerabilities to sniper monopoly or high-impact sell cascades.'
        : 'Genome is vulnerable to exploitation. Virtual reserves or dynamic fee shields require immediate tuning.',
    vectors,
    vulnerabilitiesFound,
    mitigationTips: Array.from(new Set(mitigationTips)),
  };
}
