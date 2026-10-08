'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { CurvePoint, GenomeConfig } from '@/lib/bonding-curve/types';
import { Eye, TrendingUp, DollarSign, Shield, Layers } from 'lucide-react';

interface CurveChartProps {
  points: CurvePoint[];
  genome: GenomeConfig;
  currentSupplyProgress?: number; // 0 to 100
}

export const CurveChart: React.FC<CurveChartProps> = ({
  points,
  genome,
  currentSupplyProgress,
}) => {
  const [viewMetric, setViewMetric] = useState<'price' | 'marketCap' | 'slippage' | 'reserve'>('price');

  const formatPrice = (val: number) => {
    if (val < 0.000001) return val.toExponential(3);
    if (val < 0.01) return val.toFixed(7);
    return val.toFixed(4);
  };

  const chartData = points.map((p) => ({
    supplyPct: p.supplyPercentage,
    supplyTokens: p.supply,
    priceSol: p.priceSol,
    priceUsd: p.priceUsd,
    marketCapSol: p.marketCapSol,
    marketCapUsd: p.marketCapUsd,
    realSolReserve: p.realSolReserve,
    slippage10SolBuy: p.slippage10SolBuy,
    liquidityDepthSol: p.liquidityDepthSol,
  }));

  const getYKey = () => {
    switch (viewMetric) {
      case 'marketCap':
        return 'marketCapSol';
      case 'slippage':
        return 'slippage10SolBuy';
      case 'reserve':
        return 'realSolReserve';
      case 'price':
      default:
        return 'priceSol';
    }
  };

  const getYLabel = () => {
    switch (viewMetric) {
      case 'marketCap':
        return 'Market Cap (SOL)';
      case 'slippage':
        return 'Slippage on 10 SOL Buy (%)';
      case 'reserve':
        return 'Accumulated Real SOL';
      case 'price':
      default:
        return 'Price (SOL)';
    }
  };

  const getYColor = () => {
    switch (viewMetric) {
      case 'marketCap':
        return '#9B5DE5'; // purple
      case 'slippage':
        return '#F15BB5'; // pink
      case 'reserve':
        return '#00BBF9'; // blue
      case 'price':
      default:
        return '#00F5D4'; // cyan
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-surface-border bg-surface-100 p-5 shadow-xl">
      {/* Chart Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-surface-border/60">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-cyan" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              BONDING CURVE TOPOLOGY: {genome.shape.toUpperCase().replace('_', ' ')}
            </h3>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Real-time mathematical trajectory & slippage gradient
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center rounded-lg bg-surface-200 p-1 border border-surface-border text-xs">
          <button
            onClick={() => setViewMetric('price')}
            className={`rounded px-2.5 py-1 font-medium transition-all ${
              viewMetric === 'price'
                ? 'bg-brand-cyan/20 text-brand-cyan shadow-sm border border-brand-cyan/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Price (SOL)
          </button>
          <button
            onClick={() => setViewMetric('marketCap')}
            className={`rounded px-2.5 py-1 font-medium transition-all ${
              viewMetric === 'marketCap'
                ? 'bg-brand-purple/20 text-brand-purple shadow-sm border border-brand-purple/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Market Cap
          </button>
          <button
            onClick={() => setViewMetric('reserve')}
            className={`rounded px-2.5 py-1 font-medium transition-all ${
              viewMetric === 'reserve'
                ? 'bg-brand-teal/20 text-brand-teal shadow-sm border border-brand-teal/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            SOL Reserves
          </button>
          <button
            onClick={() => setViewMetric('slippage')}
            className={`rounded px-2.5 py-1 font-medium transition-all ${
              viewMetric === 'slippage'
                ? 'bg-brand-pink/20 text-brand-pink shadow-sm border border-brand-pink/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Slippage Map
          </button>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-[360px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="curveColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getYColor()} stopOpacity={0.4} />
                <stop offset="95%" stopColor={getYColor()} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1f2333" vertical={false} />

            <XAxis
              dataKey="supplyPct"
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={{ stroke: '#232738' }}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(v) => {
                if (viewMetric === 'slippage') return `${v.toFixed(1)}%`;
                if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
                if (v < 0.00001) return v.toExponential(1);
                return v.toFixed(3);
              }}
              tickLine={false}
              axisLine={{ stroke: '#232738' }}
              domain={['auto', 'auto']}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as (typeof chartData)[0];
                  return (
                    <div className="rounded-lg border border-surface-borderLight bg-surface-300/95 p-3 shadow-2xl backdrop-blur-md">
                      <div className="text-[11px] font-mono text-gray-400 border-b border-surface-border pb-1.5 mb-1.5 flex items-center justify-between gap-4">
                        <span>Supply Sold: {data.supplyPct.toFixed(1)}%</span>
                        <span className="text-brand-cyan">
                          {(data.supplyTokens / 1_000_000).toFixed(1)}M {genome.symbol}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Price:</span>
                          <span className="font-bold text-brand-cyan">
                            {formatPrice(data.priceSol)} SOL
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Market Cap:</span>
                          <span className="text-brand-purple">
                            {data.marketCapSol.toFixed(1)} SOL (~${data.marketCapUsd.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Real SOL In Pool:</span>
                          <span className="text-brand-teal">
                            {data.realSolReserve.toFixed(2)} SOL
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Slippage (10 SOL):</span>
                          <span className={data.slippage10SolBuy > 20 ? 'text-brand-rose font-bold' : 'text-brand-green'}>
                            {data.slippage10SolBuy.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Current Supply Tracker Line */}
            {currentSupplyProgress !== undefined && (
              <ReferenceLine
                x={currentSupplyProgress}
                stroke="#FEE440"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{
                  value: 'Active Point',
                  fill: '#FEE440',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey={getYKey()}
              stroke={getYColor()}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#curveColor)"
              dot={false}
              activeDot={{ r: 5, fill: getYColor(), stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-2 border-t border-surface-border/60 text-xs font-mono">
        <div className="rounded bg-surface-200/80 p-2 border border-surface-border">
          <div className="text-[10px] text-gray-400">STARTING PRICE</div>
          <div className="text-brand-cyan font-bold truncate">
            {formatPrice(genome.initialPriceSol)} SOL
          </div>
        </div>
        <div className="rounded bg-surface-200/80 p-2 border border-surface-border">
          <div className="text-[10px] text-gray-400">GRADUATION PRICE</div>
          <div className="text-brand-purple font-bold truncate">
            {formatPrice(genome.graduationPriceSol)} SOL
          </div>
        </div>
        <div className="rounded bg-surface-200/80 p-2 border border-surface-border">
          <div className="text-[10px] text-gray-400">VIRTUAL SOL OFFSET</div>
          <div className="text-brand-teal font-bold">{genome.virtualSolReserve} SOL</div>
        </div>
        <div className="rounded bg-surface-200/80 p-2 border border-surface-border">
          <div className="text-[10px] text-gray-400">GRADUATION TARGET</div>
          <div className="text-brand-green font-bold">{genome.graduationSolThreshold} SOL</div>
        </div>
      </div>
    </div>
  );
};
