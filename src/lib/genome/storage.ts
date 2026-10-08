import { GenomeConfig } from '../bonding-curve/types';
import { GENOME_PRESETS } from '../bonding-curve/presets';
import { generateGenomeHash } from './hasher';

const STORAGE_KEY = 'curve_genome_registry_v1';

export interface GenomeDiff {
  param: string;
  label: string;
  valA: string | number;
  valB: string | number;
  delta?: string;
  impactExplanation: string;
}

export function loadSavedGenomes(): GenomeConfig[] {
  if (typeof window === 'undefined') return GENOME_PRESETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(GENOME_PRESETS));
      return GENOME_PRESETS;
    }
    const parsed: GenomeConfig[] = JSON.parse(raw);
    return parsed.length > 0 ? parsed : GENOME_PRESETS;
  } catch (e) {
    console.error('Error loading genomes from storage:', e);
    return GENOME_PRESETS;
  }
}

export function saveGenome(genome: GenomeConfig): GenomeConfig[] {
  if (typeof window === 'undefined') return [genome];
  try {
    const current = loadSavedGenomes();
    const existingIndex = current.findIndex((g) => g.id === genome.id);
    const updatedGenome = {
      ...genome,
      hash: generateGenomeHash(genome),
    };

    let updatedList: GenomeConfig[];
    if (existingIndex >= 0) {
      updatedList = [...current];
      updatedList[existingIndex] = updatedGenome;
    } else {
      updatedList = [updatedGenome, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch (e) {
    console.error('Error saving genome:', e);
    return [genome];
  }
}

export function forkGenome(
  parent: GenomeConfig,
  customizations: Partial<GenomeConfig>,
  forkMessage: string
): GenomeConfig {
  const newId = `genome-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const forked: GenomeConfig = {
    ...parent,
    ...customizations,
    id: newId,
    name: customizations.name || `${parent.name} (Fork)`,
    symbol: customizations.symbol || `${parent.symbol}_F`,
    parentGenomeId: parent.id,
    forkMessage: forkMessage || 'Optimized parameters for anti-snipe & DLMM efficiency',
    createdAt: Date.now(),
    version: `${(parseFloat(parent.version) + 0.1).toFixed(1)}.0`,
    author: customizations.author || 'You (Local Dev)',
    hash: '',
  };
  forked.hash = generateGenomeHash(forked);
  saveGenome(forked);
  return forked;
}

export function deleteGenome(id: string): GenomeConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = loadSavedGenomes();
    const filtered = current.filter((g) => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Error deleting genome:', e);
    return [];
  }
}

export function compareGenomes(gA: GenomeConfig, gB: GenomeConfig): GenomeDiff[] {
  const diffs: GenomeDiff[] = [];

  if (gA.shape !== gB.shape) {
    diffs.push({
      param: 'shape',
      label: 'Curve Topology',
      valA: gA.shape,
      valB: gB.shape,
      impactExplanation: `Topology shift from ${gA.shape} to ${gB.shape} fundamentally modifies price discovery velocity across all supply stages.`,
    });
  }

  if (gA.virtualSolReserve !== gB.virtualSolReserve) {
    const delta = gB.virtualSolReserve - gA.virtualSolReserve;
    diffs.push({
      param: 'virtualSolReserve',
      label: 'Virtual SOL Reserve',
      valA: `${gA.virtualSolReserve} SOL`,
      valB: `${gB.virtualSolReserve} SOL`,
      delta: `${delta > 0 ? '+' : ''}${delta} SOL`,
      impactExplanation: delta > 0
        ? `Higher virtual reserve dampens T0 sniper impact and reduces slippage on large tickets.`
        : `Lower virtual reserve increases price volatility and lowers capital required to graduate.`,
    });
  }

  if (gA.initialPriceSol !== gB.initialPriceSol) {
    const ratio = (gB.initialPriceSol / Math.max(gA.initialPriceSol, 1e-9)).toFixed(2);
    diffs.push({
      param: 'initialPriceSol',
      label: 'Starting Price',
      valA: `${gA.initialPriceSol} SOL`,
      valB: `${gB.initialPriceSol} SOL`,
      delta: `${ratio}x`,
      impactExplanation: 'Changes initial entry barrier for first wave of participants.',
    });
  }

  if (gA.graduationSolThreshold !== gB.graduationSolThreshold) {
    const delta = gB.graduationSolThreshold - gA.graduationSolThreshold;
    diffs.push({
      param: 'graduationSolThreshold',
      label: 'Graduation Target',
      valA: `${gA.graduationSolThreshold} SOL`,
      valB: `${gB.graduationSolThreshold} SOL`,
      delta: `${delta > 0 ? '+' : ''}${delta} SOL`,
      impactExplanation: `Directly governs the real SOL pool liquidity migrated into Meteora DLMM upon curve completion.`,
    });
  }

  if (gA.dynamicFees.baseFeeBps !== gB.dynamicFees.baseFeeBps) {
    diffs.push({
      param: 'baseFeeBps',
      label: 'Base Fee Tier',
      valA: `${(gA.dynamicFees.baseFeeBps / 100).toFixed(2)}%`,
      valB: `${(gB.dynamicFees.baseFeeBps / 100).toFixed(2)}%`,
      impactExplanation: 'Alters standard baseline trading fee collected on all swaps.',
    });
  }

  if (gA.dynamicFees.maxFeeBps !== gB.dynamicFees.maxFeeBps) {
    diffs.push({
      param: 'maxFeeBps',
      label: 'Max Dynamic Surge Fee',
      valA: `${(gA.dynamicFees.maxFeeBps / 100).toFixed(2)}%`,
      valB: `${(gB.dynamicFees.maxFeeBps / 100).toFixed(2)}%`,
      impactExplanation: 'Defines the maximum fee shield ceiling during high-velocity volatility and sniper sweeps.',
    });
  }

  if (gA.migrationTarget !== gB.migrationTarget) {
    diffs.push({
      param: 'migrationTarget',
      label: 'Post-Graduation Target',
      valA: gA.migrationTarget === 'meteora_dlmm' ? 'Meteora DLMM' : 'Meteora DAMM v2',
      valB: gB.migrationTarget === 'meteora_dlmm' ? 'Meteora DLMM' : 'Meteora DAMM v2',
      impactExplanation: 'Switches post-graduation liquidity architecture between concentrated bin liquidity (DLMM) and classic pool (DAMM).',
    });
  }

  return diffs;
}
