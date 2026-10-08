'use client';

import React from 'react';
import {
  Sliders,
  Activity,
  ShieldAlert,
  PlayCircle,
  Brain,
  FolderGit2,
} from 'lucide-react';

export type ActiveTab =
  | 'studio'
  | 'simulation'
  | 'stress'
  | 'replay'
  | 'analyst'
  | 'library';

interface NavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  stressScore?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  stressScore = 92,
}) => {
  const tabs = [
    {
      id: 'studio' as ActiveTab,
      label: 'Curve Studio',
      icon: Sliders,
      badge: null,
      desc: 'Visual DBC Topology & Parameters',
    },
    {
      id: 'simulation' as ActiveTab,
      label: 'Simulation Lab',
      icon: Activity,
      badge: 'Real-time',
      desc: 'Market Demand & Tape Simulation',
    },
    {
      id: 'stress' as ActiveTab,
      label: 'Stress Lab',
      icon: ShieldAlert,
      badge: `${stressScore}/100`,
      badgeColor: stressScore >= 80 ? 'text-brand-green bg-brand-green/10' : 'text-amber-400 bg-amber-400/10',
      desc: 'Battle-test 5 Attack Vectors',
    },
    {
      id: 'replay' as ActiveTab,
      label: 'Curve Replay',
      icon: PlayCircle,
      badge: 'Timeline',
      desc: 'Launch -> Graduation Milestone Scrub',
    },
    {
      id: 'analyst' as ActiveTab,
      label: 'AI Analyst',
      icon: Brain,
      badge: 'Intelligence',
      desc: 'Tokenomic Diagnostics & Tuning',
    },
    {
      id: 'library' as ActiveTab,
      label: 'Genome Library',
      icon: FolderGit2,
      badge: null,
      desc: 'Registry, Forks & Diff Inspector',
    },
  ];

  return (
    <div className="w-full border-b border-surface-border bg-surface-200/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav className="flex space-x-2 overflow-x-auto py-2.5 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`group relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-surface-100 text-white shadow-sm border border-surface-borderLight'
                    : 'text-gray-400 hover:bg-surface-100/50 hover:text-gray-200'
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-brand-cyan' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                />
                <span>{tab.label}</span>

                {tab.badge && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold ${
                      tab.badgeColor || 'bg-surface-50 text-gray-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}

                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
