'use client';

import React from 'react';
import { DynamicFeeConfig, DLMMConfig, MigrationTarget } from '@/lib/bonding-curve/types';
import { Shield, Flame, Percent, ArrowRightLeft, Layers } from 'lucide-react';

interface DynamicFeeConfigProps {
  dynamicFees: DynamicFeeConfig;
  dlmmConfig: DLMMConfig;
  migrationTarget: MigrationTarget;
  onChangeFees: (fees: DynamicFeeConfig) => void;
  onChangeDLMM: (dlmm: DLMMConfig) => void;
  onChangeTarget: (target: MigrationTarget) => void;
}

export const DynamicFeeConfigPanel: React.FC<DynamicFeeConfigProps> = ({
  dynamicFees,
  dlmmConfig,
  migrationTarget,
  onChangeFees,
  onChangeDLMM,
  onChangeTarget,
}) => {
  const updateFee = <K extends keyof DynamicFeeConfig>(key: K, val: DynamicFeeConfig[K]) => {
    onChangeFees({
      ...dynamicFees,
      [key]: val,
    });
  };

  const updateDLMM = <K extends keyof DLMMConfig>(key: K, val: DLMMConfig[K]) => {
    onChangeDLMM({
      ...dlmmConfig,
      [key]: val,
    });
  };

  return (
    <div className="flex flex-col space-y-5 rounded-xl border border-surface-border bg-surface-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-brand-teal" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Dynamic Fee Scheduler & DLMM Migration
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Dynamic Surge:</span>
          <button
            onClick={() => updateFee('enabled', !dynamicFees.enabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              dynamicFees.enabled ? 'bg-brand-cyan' : 'bg-surface-50'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                dynamicFees.enabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dynamic Fees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Base Fee */}
        <div className="rounded-lg bg-surface-200/70 p-3 border border-surface-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-300">Base Fee Tier</span>
            <span className="font-mono text-xs font-bold text-brand-cyan">
              {(dynamicFees.baseFeeBps / 100).toFixed(2)}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="300"
            step="10"
            value={dynamicFees.baseFeeBps}
            onChange={(e) => updateFee('baseFeeBps', Number(e.target.value))}
            className="w-full accent-brand-cyan bg-surface-50 h-1.5 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-gray-400 mt-1">Normal steady-state swap fee.</p>
        </div>

        {/* Max Dynamic Surge Fee */}
        <div className="rounded-lg bg-surface-200/70 p-3 border border-surface-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-300 flex items-center gap-1">
              <Flame className="h-3 w-3 text-brand-orange" />
              <span>Max Surge Fee</span>
            </span>
            <span className="font-mono text-xs font-bold text-brand-orange">
              {(dynamicFees.maxFeeBps / 100).toFixed(2)}%
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="25"
            disabled={!dynamicFees.enabled}
            value={dynamicFees.maxFeeBps}
            onChange={(e) => updateFee('maxFeeBps', Number(e.target.value))}
            className="w-full accent-brand-orange bg-surface-50 h-1.5 rounded-lg cursor-pointer disabled:opacity-40"
          />
          <p className="text-[10px] text-gray-400 mt-1">Taxes high-velocity bot bursts.</p>
        </div>

        {/* Creator Share */}
        <div className="rounded-lg bg-surface-200/70 p-3 border border-surface-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-300">Creator Fee Share</span>
            <span className="font-mono text-xs font-bold text-brand-purple">
              {dynamicFees.creatorSharePercentage}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={dynamicFees.creatorSharePercentage}
            onChange={(e) => updateFee('creatorSharePercentage', Number(e.target.value))}
            className="w-full accent-brand-purple bg-surface-50 h-1.5 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-gray-400 mt-1">Direct creator revenue allocation.</p>
        </div>
      </div>

      {/* Post-Graduation Meteora Target */}
      <div className="rounded-lg bg-surface-200/50 p-3.5 border border-surface-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-brand-teal" />
            <span>Meteora Migration Protocol</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onChangeTarget('meteora_dlmm')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
                migrationTarget === 'meteora_dlmm'
                  ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40'
                  : 'bg-surface-100 text-gray-400 border border-surface-border'
              }`}
            >
              Meteora DLMM (Bins)
            </button>
            <button
              onClick={() => onChangeTarget('meteora_damm_v2')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
                migrationTarget === 'meteora_damm_v2'
                  ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/40'
                  : 'bg-surface-100 text-gray-400 border border-surface-border'
              }`}
            >
              DAMM v2 Pool
            </button>
          </div>
        </div>

        {/* DLMM Bin Configuration */}
        {migrationTarget === 'meteora_dlmm' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-surface-border/60 text-xs">
            <div>
              <span className="text-gray-400 text-[10px]">BIN STEP (TICKS)</span>
              <select
                value={dlmmConfig.binStep}
                onChange={(e) => updateDLMM('binStep', Number(e.target.value))}
                className="w-full mt-1 rounded bg-surface-100 p-1.5 font-mono text-xs text-white border border-surface-border"
              >
                <option value={10}>10 bps (0.10% - Tightest)</option>
                <option value={20}>20 bps (0.20% - Standard)</option>
                <option value={25}>25 bps (0.25% - Volatile)</option>
                <option value={50}>50 bps (0.50% - Wide Meme)</option>
              </select>
            </div>

            <div>
              <span className="text-gray-400 text-[10px]">POST-GRAD FEE TIER</span>
              <select
                value={dlmmConfig.feeTierBps}
                onChange={(e) => updateDLMM('feeTierBps', Number(e.target.value))}
                className="w-full mt-1 rounded bg-surface-100 p-1.5 font-mono text-xs text-white border border-surface-border"
              >
                <option value={25}>0.25% Fee Tier</option>
                <option value={100}>1.00% Fee Tier</option>
                <option value={200}>2.00% Fee Tier</option>
              </select>
            </div>

            <div>
              <span className="text-gray-400 text-[10px]">LP LOCK SCHEDULE</span>
              <select
                value={dlmmConfig.lockedDurationDays}
                onChange={(e) => updateDLMM('lockedDurationDays', Number(e.target.value))}
                className="w-full mt-1 rounded bg-surface-100 p-1.5 font-mono text-xs text-white border border-surface-border"
              >
                <option value={0}>Permanent Burn (100% Locked)</option>
                <option value={180}>6 Months Locked</option>
                <option value={365}>1 Year Locked</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
