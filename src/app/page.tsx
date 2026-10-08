'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation, ActiveTab } from '@/components/layout/Navigation';
import { CurveStudio } from '@/components/studio/CurveStudio';
import { SimulationLab } from '@/components/simulation/SimulationLab';
import { StressLab } from '@/components/stress/StressLab';
import { CurveReplay } from '@/components/replay/CurveReplay';
import { AICurveAnalyst } from '@/components/analyst/AICurveAnalyst';
import { GenomeLibrary } from '@/components/library/GenomeLibrary';
import { LaunchModal } from '@/components/launch/LaunchModal';
import { ForkModal } from '@/components/library/ForkModal';
import { GenomeConfig } from '@/lib/bonding-curve/types';
import { GENOME_PRESETS } from '@/lib/bonding-curve/presets';
import { loadSavedGenomes, saveGenome, deleteGenome } from '@/lib/genome/storage';
import { runStressAudit } from '@/lib/bonding-curve/stress-tester';
import { generateDeployManifestYAML } from '@/lib/meteora/config-builder';
import {
  Sparkles,
  GitFork,
  Rocket,
  Shield,
  Layers,
  ArrowRight,
  Terminal,
  Zap,
} from 'lucide-react';

export default function Home() {
  const [genomes, setGenomes] = useState<GenomeConfig[]>(GENOME_PRESETS);
  const [activeGenome, setActiveGenome] = useState<GenomeConfig>(GENOME_PRESETS[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [network, setNetwork] = useState<'devnet' | 'mainnet-beta'>('devnet');

  // Modals
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showForkModal, setShowForkModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Load genomes from localStorage on client mount
  useEffect(() => {
    const loaded = loadSavedGenomes();
    setGenomes(loaded);
    if (loaded.length > 0) {
      setActiveGenome(loaded[0]);
    }
  }, []);

  const handleUpdateActiveGenome = (updated: GenomeConfig) => {
    setActiveGenome(updated);
    const updatedList = saveGenome(updated);
    setGenomes(updatedList);
  };

  const handleSelectGenome = (g: GenomeConfig) => {
    setActiveGenome(g);
  };

  const handleGenomeCreated = (newGenome: GenomeConfig) => {
    const updatedList = saveGenome(newGenome);
    setGenomes(updatedList);
    setActiveGenome(newGenome);
  };

  const handleDeleteGenome = (id: string) => {
    const updatedList = deleteGenome(id);
    setGenomes(updatedList);
    if (activeGenome.id === id && updatedList.length > 0) {
      setActiveGenome(updatedList[0]);
    }
  };

  const handleApplyPatch = (patch: Partial<GenomeConfig>) => {
    const updated = {
      ...activeGenome,
      ...patch,
    };
    handleUpdateActiveGenome(updated);
    setActiveTab('studio');
  };

  const stressAudit = runStressAudit(activeGenome);

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col selection:bg-brand-cyan/20 selection:text-brand-cyan">
      {/* Sleek Top Navigation Header */}
      <Header
        activeGenome={activeGenome}
        onFork={() => setShowForkModal(true)}
        onDeploy={() => setShowLaunchModal(true)}
        onExport={() => setShowExportModal(true)}
        network={network}
        onToggleNetwork={() =>
          setNetwork((prev) => (prev === 'devnet' ? 'mainnet-beta' : 'devnet'))
        }
      />

      {/* 6-Pillar Tab Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        stressScore={stressAudit.overallResilienceScore}
      />

      {/* Main App Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* Landing Headline Hero Banner */}
        <div className="mb-6 rounded-2xl border border-surface-border bg-gradient-to-br from-surface-100 via-surface-200 to-surface-300 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-cyan/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-brand-purple/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-surface-50 px-3 py-1 text-xs font-mono font-semibold text-brand-cyan border border-brand-cyan/30 mb-2">
                <Zap className="h-3.5 w-3.5 text-brand-cyan" />
                <span>Meteora Dynamic Bonding Curve (DBC) Ecosystem</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                CURVE GENOME
              </h1>
              <p className="text-sm font-semibold text-gray-300 mt-1">
                Design. Stress-test. Replay. Fork. Launch.
              </p>
              <p className="text-xs text-gray-400 mt-1 max-w-2xl font-mono">
                The GitHub for bonding curves: where the curve itself is the PRODUCT. Visual topology editor, realistic micro-order simulation, 5 attack vector stress tests, and verified Meteora DLMM migration.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLaunchModal(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-teal to-brand-green px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-brand-cyan/20 hover:opacity-95 transition-all"
              >
                <Rocket className="h-4 w-4" />
                <span>Launch On-Chain</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content Switching */}
        <div className="transition-all duration-300">
          {activeTab === 'studio' && (
            <CurveStudio
              genome={activeGenome}
              onChangeGenome={handleUpdateActiveGenome}
              onGoToSim={() => setActiveTab('simulation')}
              onGoToStress={() => setActiveTab('stress')}
            />
          )}

          {activeTab === 'simulation' && (
            <SimulationLab
              genome={activeGenome}
              onGoToReplay={() => setActiveTab('replay')}
            />
          )}

          {activeTab === 'stress' && (
            <StressLab
              genome={activeGenome}
              onApplyPatch={handleApplyPatch}
              onGoToStudio={() => setActiveTab('studio')}
            />
          )}

          {activeTab === 'replay' && <CurveReplay genome={activeGenome} />}

          {activeTab === 'analyst' && (
            <AICurveAnalyst
              genome={activeGenome}
              onApplyPresetPatch={handleApplyPatch}
            />
          )}

          {activeTab === 'library' && (
            <GenomeLibrary
              genomes={genomes}
              activeGenome={activeGenome}
              onSelectGenome={handleSelectGenome}
              onGenomeCreated={handleGenomeCreated}
              onDeleteGenome={handleDeleteGenome}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-300 py-6 text-center text-xs text-gray-500 font-mono">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            CURVE GENOME • Built for the Meteora Dynamic Bonding Curve Bounty
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>Solana Devnet & Mainnet</span>
            <span>•</span>
            <span>Meteora DLMM & DAMM v2</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLaunchModal && (
        <LaunchModal
          genome={activeGenome}
          onClose={() => setShowLaunchModal(false)}
          network={network}
        />
      )}

      {showForkModal && (
        <ForkModal
          parentGenome={activeGenome}
          onClose={() => setShowForkModal(false)}
          onForkCreated={handleGenomeCreated}
        />
      )}

      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-xl border border-surface-border bg-surface-100 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Export DBC Genome Manifest
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <pre className="rounded-lg bg-surface-300 p-4 font-mono text-xs text-gray-300 max-h-[300px] overflow-y-auto">
              {generateDeployManifestYAML(activeGenome)}
            </pre>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateDeployManifestYAML(activeGenome));
                  alert('Manifest copied to clipboard!');
                  setShowExportModal(false);
                }}
                className="rounded-lg bg-gradient-to-r from-brand-cyan to-brand-teal px-4 py-2 text-xs font-bold text-black"
              >
                Copy YAML to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
