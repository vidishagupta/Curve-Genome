import { GenomeConfig, SimulationResult, SimulationPoint, TradeOrder } from './types';
import { calculateTokensForSol, calculateSolForTokens, calculateInstantaneousPrice } from './math';

export interface SimulationScenarioConfig {
  id: string;
  name: string;
  description: string;
  totalSteps: number;
  marketSentiment: 'bullish' | 'bearish' | 'volatile' | 'sniper_heavy' | 'organic';
  whaleFrequency: number; // 0 to 1
  panicProbability: number; // 0 to 1
}

export const SIMULATION_SCENARIOS: SimulationScenarioConfig[] = [
  {
    id: 'organic_retail',
    name: 'Organic Retail Discovery',
    description: 'Steady wave of retail participants entering with varied order sizes (0.2 - 3.5 SOL) and healthy profit-taking cycles.',
    totalSteps: 75,
    marketSentiment: 'organic',
    whaleFrequency: 0.05,
    panicProbability: 0.1,
  },
  {
    id: 'whale_fomo',
    name: 'Whale Heavy Inflow & Momentum',
    description: 'High-capital liquidity providers and whales executing large ticket buys (10 - 25 SOL), pushing curve rapidly toward graduation.',
    totalSteps: 55,
    marketSentiment: 'bullish',
    whaleFrequency: 0.35,
    panicProbability: 0.15,
  },
  {
    id: 'sniper_barrage',
    name: 'T0 Sniper Bot Barrage & Dump',
    description: 'Ultra-fast bot clusters front-running early curve supply in the first 5 blocks, followed by aggressive profit extraction.',
    totalSteps: 60,
    marketSentiment: 'sniper_heavy',
    whaleFrequency: 0.2,
    panicProbability: 0.4,
  },
  {
    id: 'panic_cascade',
    name: 'Cascading Panic Sell-off',
    description: 'Market-wide liquidity shock triggering multiple consecutive sell walls testing the bid depth and dynamic fee shield.',
    totalSteps: 65,
    marketSentiment: 'bearish',
    whaleFrequency: 0.1,
    panicProbability: 0.65,
  },
  {
    id: 'pump_dump',
    name: 'Pump-and-Dump Syndicate',
    description: 'Coordinated syndicate rapidly inflates price to 70% graduation before dumping 80% of holdings in 3 consecutive blocks.',
    totalSteps: 70,
    marketSentiment: 'volatile',
    whaleFrequency: 0.4,
    panicProbability: 0.5,
  },
  {
    id: 'dca_accumulation',
    name: 'Continuous DCA Protocol Inflow',
    description: 'Algorithmic automated DCA bots accumulating consistent buy volume with minimal sell pressure.',
    totalSteps: 80,
    marketSentiment: 'bullish',
    whaleFrequency: 0.02,
    panicProbability: 0.05,
  },
];

export function runBondingSimulation(
  genome: GenomeConfig,
  scenarioId = 'organic_retail',
  randomSeed = 42
): SimulationResult {
  const scenario =
    SIMULATION_SCENARIOS.find((s) => s.id === scenarioId) ||
    SIMULATION_SCENARIOS[0];

  let currentSupply = 0;
  let currentSolRaised = 0;
  let totalVolumeSol = 0;
  let totalFeesCollectedSol = 0;
  let peakPriceSol = calculateInstantaneousPrice(0, genome);
  let graduationReached = false;
  let graduationStep: number | null = null;

  // Dynamic fee state tracker
  let dynamicFeeBps = genome.dynamicFees.baseFeeBps;

  const trades: TradeOrder[] = [];
  const timeSeries: SimulationPoint[] = [];
  const holderBalances: Map<string, number> = new Map();

  // Pseudo-random generator with fixed seed for determinism
  let seed = randomSeed;
  const pseudoRand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const startTime = Date.now() - scenario.totalSteps * 60 * 1000;

  for (let step = 1; step <= scenario.totalSteps; step++) {
    const time = startTime + step * 60 * 1000;
    const isEarlyBlock = step <= 5;
    const isLateBlock = step > scenario.totalSteps * 0.7;

    // Decay dynamic fee gradually toward baseFeeBps
    if (genome.dynamicFees.enabled) {
      dynamicFeeBps = Math.max(
        genome.dynamicFees.baseFeeBps,
        dynamicFeeBps - genome.dynamicFees.decayRateBpsPerMinute
      );
    }

    // Determine trade action based on scenario
    let isBuy = true;
    let actor: TradeOrder['actor'] = 'Retail';
    let solSize = 0;

    if (scenario.id === 'sniper_barrage') {
      if (isEarlyBlock) {
        isBuy = true;
        actor = 'Sniper';
        solSize = 8 + pseudoRand() * 15;
      } else if (step >= 8 && step <= 15 && pseudoRand() < 0.75) {
        isBuy = false;
        actor = 'Sniper';
        solSize = 6 + pseudoRand() * 12;
      } else {
        isBuy = pseudoRand() > 0.45;
        actor = isBuy ? 'Retail' : 'PanicSeller';
        solSize = 0.5 + pseudoRand() * 2.5;
      }
    } else if (scenario.id === 'pump_dump') {
      if (step < scenario.totalSteps * 0.5) {
        isBuy = true;
        actor = pseudoRand() < 0.4 ? 'Whale' : 'Retail';
        solSize = actor === 'Whale' ? 10 + pseudoRand() * 15 : 1 + pseudoRand() * 4;
      } else if (step < scenario.totalSteps * 0.65) {
        // The Dump phase
        isBuy = false;
        actor = 'Whale';
        solSize = 12 + pseudoRand() * 20;
      } else {
        isBuy = pseudoRand() > 0.6;
        actor = isBuy ? 'Retail' : 'PanicSeller';
        solSize = 0.5 + pseudoRand() * 3;
      }
    } else if (scenario.id === 'panic_cascade') {
      if (step < 15) {
        isBuy = true;
        actor = 'Retail';
        solSize = 1 + pseudoRand() * 4;
      } else {
        isBuy = pseudoRand() < 0.25;
        actor = isBuy ? 'DCA' : 'PanicSeller';
        solSize = isBuy ? 0.5 + pseudoRand() * 1.5 : 3 + pseudoRand() * 10;
      }
    } else if (scenario.id === 'whale_fomo') {
      isBuy = pseudoRand() > 0.22;
      if (pseudoRand() < scenario.whaleFrequency) {
        actor = 'Whale';
        solSize = 8 + pseudoRand() * 22;
      } else {
        actor = isBuy ? 'Retail' : 'DCA';
        solSize = 0.5 + pseudoRand() * 4;
      }
    } else {
      // Organic Retail & DCA
      isBuy = pseudoRand() > (isLateBlock ? 0.38 : 0.28);
      actor = isBuy ? (pseudoRand() < 0.15 ? 'DCA' : 'Retail') : 'Retail';
      solSize = 0.3 + pseudoRand() * (isBuy ? 3.8 : 2.5);
    }

    // Dynamic fee surge on large trades
    if (genome.dynamicFees.enabled && solSize > 5) {
      const surge = (solSize / 5) * genome.dynamicFees.surgeMultiplier * 30;
      dynamicFeeBps = Math.min(genome.dynamicFees.maxFeeBps, dynamicFeeBps + surge);
    }

    const feePct = dynamicFeeBps / 10000;
    let tokensExchanged = 0;
    let executionPrice = calculateInstantaneousPrice(currentSupply, genome);
    let priceImpact = 0;
    let feePaid = 0;

    const traderWallet = `Wallet_${actor}_${Math.floor(pseudoRand() * 30)}`;

    if (isBuy) {
      const netSol = solSize * (1 - feePct);
      feePaid = solSize * feePct;
      const res = calculateTokensForSol(netSol, currentSupply, genome);
      tokensExchanged = res.tokensOut;
      executionPrice = res.avgPriceSol;
      priceImpact = res.priceImpactPct;
      currentSupply = Math.min(genome.bondingCurveSupply, res.newSupply);
      currentSolRaised += netSol;

      // Update holder balances
      holderBalances.set(
        traderWallet,
        (holderBalances.get(traderWallet) || 0) + tokensExchanged
      );
    } else {
      // Sell order: convert solSize equivalent tokens to sell
      const tokensToSell = (solSize / Math.max(executionPrice, 1e-9));
      const res = calculateSolForTokens(tokensToSell, currentSupply, genome);
      const grossSol = res.solOut;
      feePaid = grossSol * feePct;
      const netSol = Math.max(0, grossSol - feePaid);
      tokensExchanged = tokensToSell;
      executionPrice = res.avgPriceSol;
      priceImpact = res.priceImpactPct;
      currentSupply = Math.max(0, res.newSupply);
      currentSolRaised = Math.max(0, currentSolRaised - grossSol);

      // Reduce holder balance
      const currentH = holderBalances.get(traderWallet) || 0;
      holderBalances.set(traderWallet, Math.max(0, currentH - tokensExchanged));
    }

    totalVolumeSol += solSize;
    totalFeesCollectedSol += feePaid;
    const currentPrice = calculateInstantaneousPrice(currentSupply, genome);
    if (currentPrice > peakPriceSol) peakPriceSol = currentPrice;

    const gradPct = Math.min(
      (currentSolRaised / Math.max(genome.graduationSolThreshold, 1)) * 100,
      100
    );

    if (!graduationReached && (gradPct >= 100 || currentSupply >= genome.bondingCurveSupply)) {
      graduationReached = true;
      graduationStep = step;
    }

    const trade: TradeOrder = {
      id: `tx-${step}-${Math.floor(pseudoRand() * 99999)}`,
      timestamp: time,
      step,
      type: isBuy ? 'BUY' : 'SELL',
      actor,
      solAmount: Number(solSize.toFixed(4)),
      tokenAmount: Number(tokensExchanged.toFixed(2)),
      executionPriceSol: executionPrice,
      priceImpactPct: Number(priceImpact.toFixed(2)),
      feePaidSol: Number(feePaid.toFixed(5)),
      effectiveFeeBps: Math.round(dynamicFeeBps),
      cumulativeSolRaised: Number(currentSolRaised.toFixed(3)),
      cumulativeVolumeSol: Number(totalVolumeSol.toFixed(2)),
      cumulativeFeesSol: Number(totalFeesCollectedSol.toFixed(4)),
      graduationPct: Number(gradPct.toFixed(1)),
    };

    trades.push(trade);

    timeSeries.push({
      step,
      timestamp: time,
      priceSol: currentPrice,
      solRaised: currentSolRaised,
      tokensSold: currentSupply,
      volumeSol: totalVolumeSol,
      currentFeeBps: Math.round(dynamicFeeBps),
      graduationPct: gradPct,
      activeTradersCount: holderBalances.size,
    });
  }

  // Distribution Stats
  const balances = Array.from(holderBalances.values()).filter((b) => b > 0);
  balances.sort((a, b) => b - a);
  const totalHeld = balances.reduce((a, b) => a + b, 0);
  const top10Total = balances.slice(0, 10).reduce((a, b) => a + b, 0);
  const top10HoldersPct = totalHeld > 0 ? (top10Total / totalHeld) * 100 : 0;

  // Gini coefficient calculation
  let gini = 0;
  if (balances.length > 1 && totalHeld > 0) {
    const n = balances.length;
    let sumOfDiffs = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        sumOfDiffs += Math.abs(balances[i] - balances[j]);
      }
    }
    gini = sumOfDiffs / (2 * n * n * (totalHeld / n));
  }

  // Max Drawdown calculation
  let maxDrawdown = 0;
  let runningPeak = timeSeries[0]?.priceSol || 1e-9;
  for (const pt of timeSeries) {
    if (pt.priceSol > runningPeak) runningPeak = pt.priceSol;
    const dd = ((runningPeak - pt.priceSol) / runningPeak) * 100;
    if (dd > maxDrawdown) maxDrawdown = dd;
  }

  const avgSlippage =
    trades.reduce((acc, t) => acc + Math.abs(t.priceImpactPct), 0) /
    Math.max(trades.length, 1);

  const creatorShare =
    totalFeesCollectedSol * (genome.dynamicFees.creatorSharePercentage / 100);

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    totalOrders: trades.length,
    totalVolumeSol: Number(totalVolumeSol.toFixed(2)),
    totalFeesCollectedSol: Number(totalFeesCollectedSol.toFixed(4)),
    creatorFeeShareSol: Number(creatorShare.toFixed(4)),
    peakPriceSol,
    finalPriceSol: timeSeries[timeSeries.length - 1]?.priceSol || 0,
    finalSolRaised: Number(currentSolRaised.toFixed(2)),
    graduationReached,
    graduationStep,
    avgSlippagePct: Number(avgSlippage.toFixed(2)),
    maxDrawdownPct: Number(maxDrawdown.toFixed(2)),
    timeSeries,
    trades,
    distributionStats: {
      top10HoldersPct: Number(top10HoldersPct.toFixed(1)),
      retailHoldersCount: balances.filter((_, i) => i >= 10).length,
      whaleHoldersCount: Math.min(balances.length, 5),
      giniCoefficient: Number(Math.min(1, Math.max(0, gini)).toFixed(3)),
    },
  };
}
