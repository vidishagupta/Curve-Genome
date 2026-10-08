'use client';

import React from 'react';
import { TradeOrder, GenomeConfig } from '@/lib/bonding-curve/types';
import { ArrowUpRight, ArrowDownRight, Bot, User, Crosshair, Zap } from 'lucide-react';

interface OrderBookTapeProps {
  trades: TradeOrder[];
  genome: GenomeConfig;
  maxVisible?: number;
}

export const OrderBookTape: React.FC<OrderBookTapeProps> = ({
  trades,
  genome,
  maxVisible = 15,
}) => {
  const visibleTrades = trades.slice(0, maxVisible);

  const getActorBadge = (actor: TradeOrder['actor']) => {
    switch (actor) {
      case 'Sniper':
        return (
          <span className="flex items-center gap-1 rounded bg-brand-rose/10 px-1.5 py-0.5 text-[10px] font-bold text-brand-rose border border-brand-rose/30">
            <Crosshair className="h-3 w-3" /> Sniper
          </span>
        );
      case 'Whale':
        return (
          <span className="flex items-center gap-1 rounded bg-brand-purple/10 px-1.5 py-0.5 text-[10px] font-bold text-brand-purple border border-brand-purple/30">
            Whale
          </span>
        );
      case 'DCA':
        return (
          <span className="flex items-center gap-1 rounded bg-brand-teal/10 px-1.5 py-0.5 text-[10px] font-bold text-brand-teal border border-brand-teal/30">
            <Bot className="h-3 w-3" /> DCA Bot
          </span>
        );
      case 'PanicSeller':
        return (
          <span className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
            Panic Sell
          </span>
        );
      case 'Retail':
      default:
        return (
          <span className="flex items-center gap-1 rounded bg-surface-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-300 border border-surface-border">
            <User className="h-3 w-3 text-gray-400" /> Retail
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-surface-border bg-surface-100 p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-brand-yellow" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Simulated Trade Tape
          </h3>
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          {trades.length} Simulated Orders
        </span>
      </div>

      <div className="mt-2 divide-y divide-surface-border/40 overflow-y-auto max-h-[360px] font-mono text-xs">
        {visibleTrades.map((t) => {
          const isBuy = t.type === 'BUY';
          return (
            <div
              key={t.id}
              className="flex items-center justify-between py-2 px-1 hover:bg-surface-200/50 transition-colors rounded"
            >
              {/* Type & Actor */}
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded ${
                    isBuy
                      ? 'bg-brand-green/10 text-brand-green'
                      : 'bg-brand-rose/10 text-brand-rose'
                  }`}
                >
                  {isBuy ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                </span>
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className={isBuy ? 'text-brand-green' : 'text-brand-rose'}>
                      {t.type}
                    </span>
                    <span className="text-gray-400 text-[10px]">T+{t.step}</span>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {t.tokenAmount.toLocaleString()} {genome.symbol}
                  </div>
                </div>
              </div>

              {/* Actor Tag */}
              <div className="hidden sm:block">{getActorBadge(t.actor)}</div>

              {/* Sol Amount & Dynamic Fee */}
              <div className="text-right">
                <div className="font-bold text-white">
                  {isBuy ? '+' : '-'}{t.solAmount} SOL
                </div>
                <div className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                  <span>Impact: {t.priceImpactPct}%</span>
                  <span className="text-brand-orange">
                    ({(t.effectiveFeeBps / 100).toFixed(1)}% Fee)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
