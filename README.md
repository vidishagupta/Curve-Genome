# CURVE GENOME
> **The "GitHub for Bonding Curves" built for the Meteora Dynamic Bonding Curve (DBC) Ecosystem on Solana.**
> *Design. Stress-test. Replay. Fork. Launch.*

---

## 🌟 Executive Summary

**CURVE GENOME** treats the bonding curve topology itself as the **PRODUCT** — not merely a token launch interface. 

Decentralized token launches frequently suffer from predatory bot snipes, sudden liquidity vacuums, high slippage, and poorly calibrated graduation parameters. Curve Genome empowers builders, quants, DAOs, and degen communities to visually sculpt, mathematically simulate, stress-audit, replay, fork, and deploy production-grade **Meteora Dynamic Bonding Curves (DBC)** with seamless post-graduation migration into **Meteora DLMM (Dynamic Liquidity Market Maker)** active bins or **DAMM v2 pools**.

---

## 🔬 The 6 Core Pillars

### 1. Curve Studio (Interactive DBC Topology Engine)
- **Mathematical Topologies**: Linear, Exponential ($k$-power law), Multi-Segment Piecewise (Anti-Snipe Floor $\to$ Organic Expansion $\to$ Graduation Thrust), Sigmoidal (S-Curve), Logarithmic, and Constant Product CPMM.
- **Meteora DBC Parameter Calibration**:
  - Virtual SOL Reserve ($V_{sol}$) for slippage dampening and anti-snipe defense.
  - Virtual Token Reserve ($V_{token}$) & total supply partition.
  - Graduation threshold in SOL & target token price.
  - **Dynamic Fee Scheduler**: Real-time surge tax on high-velocity bursts (up to 10.0%), base fee tier, decay rate, and creator revenue sharing.
  - **Post-Graduation DLMM Mapping**: Customizable Bin Step (10, 20, 25, 50 bps), fee tier conversion, and LP burn/lock schedules.
- **Real-Time Visualization**: Switch between instantaneous Price vs Supply, Market Cap, Real SOL Reserve accumulation, and 10 SOL Buy Slippage heatmaps.

### 2. Simulation Lab (Dynamic Market Stress Engine)
- **High-Fidelity Micro-Transaction Simulator**:
  - **Organic Retail Discovery**: Realistic Poisson arrivals of retail buyers with profit-taking cycles.
  - **Whale Heavy Inflow & Momentum**: Large tickets testing liquidity depth.
  - **T0 Sniper Bot Barrage & Dump**: Bot swarms sweeping Block 0 supply.
  - **Cascading Panic Sell-off**: Stress testing bid depth on the downside.
  - **Pump-and-Dump Syndicate**: Steep accumulation followed by 80% liquidation blocks.
  - **Continuous DCA Protocol**: Algorithmic systematic accumulation.
- **Live Telemetry & Gini Metric**: Real-time Gini distribution equality index, Top 10 holder monopoly %, total volume, dynamic fees generated, and LP creator yield.

### 3. Stress Lab (Battle-Test Audit & Resilience Rating)
- Automated execution of **5 core attack vectors**:
  1. **T0 Sniper Supply Monopoly Test**: Evaluates how much % of bonding curve supply a 25 SOL bot captures at Block 0.
  2. **50 SOL Whale Liquidation Shock**: Measures instantaneous price collapse under large dump orders.
  3. **MEV Sandwich Vulnerability Index**: Audits dynamic fee surge efficiency in destroying mempool front-running margins.
  4. **Low-Volume Treasury Retention**: Verifies creator runway accumulation during stagnant markets.
  5. **Near-Graduation Cliff Resistance**: Tests for "graduation walls" in the final 5% of curve progress.
- Generates a quantified **Resilience Score (0-100)**, letter grade ($A^+$ to $F$), and **1-Click Auto-Patching** for vulnerable parameters.

### 4. Curve Replay (Timeline Scrubber & Milestone Animator)
- Interactive time-travel scrubber across the curve lifecycle (Block 0 $\to$ Growth $\to$ Graduation).
- Playback speeds (1x, 2x, 5x, 10x).
- Visual milestone triggers:
  - `T0`: Pool Inception & Virtual Reserve Initialization.
  - `25%`: Early Discovery Phase.
  - `50%`: Dynamic Surge Threshold.
  - `75%`: Pre-Graduation Acceleration.
  - `100%`: **Meteora DLMM Graduation Event** with automatic bin allocation and confetti celebration.

### 5. AI Curve Analyst (Tokenomic Diagnostics Engine)
- Non-generic, mathematically-grounded reasoning engine analyzing the exact genome topology.
- Breaks down **behavioral mechanics ("Why does the curve behave this way?")** across inception, mid-curve, and graduation.
- Generates quantitative archetype classification, capital efficiency score, and targeted 1-click optimization patches.

### 6. Genome Registry & Lineage System ("GitHub for Bonding Curves")
- Unique Genome IDs and 16-character cryptographic fingerprints (`#8f92a4...`).
- **1-Click Forking**: Branch existing curves with lineage tracking (`parentGenomeId`, commit messages, version increments).
- **Parameter Diff Inspector**: Side-by-side comparison of curve parameters with delta impact explanations.
- **Export Formats**: YAML Deployment Manifest, TypeScript SDK snippets, JSON genome exports.

---

## ⛓️ Real Meteora Integration & Solana Architecture

- **Official Meteora DBC Program**: `dbcd77Mmxk5MEyifNmJbvpmNmFFV6Z3bVf4gYF1t3zW`
- **Official Meteora DLMM Program**: `LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo`
- **Transparent Pre-Flight Simulation**: Previews exact rent exemption costs (~0.024 SOL), gas (~0.00005 SOL), accounts created (4 PDAs), and simulated instruction traces.
- **Safety First**: Non-custodial wallet adapter integration (`@solana/wallet-adapter-react`). Never asks for or stores private keys or seed phrases.
- **Devnet / Mainnet Toggle**: Test risk-free on Solana Devnet or prepare for Mainnet-Beta deployment.

---

## 🚀 Quickstart & Development

### 1. Prerequisites
- Node.js 18+ (tested on Node v24.20.0)
- npm or pnpm

### 2. Installation
\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/curve-genome.git
cd curve-genome

# Install dependencies
npm install --legacy-peer-deps
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\` in your browser.

### 4. Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

---

## 🏆 2-Minute Winning Demo Flow for Hackathon Judges

1. **Inception & Curve Studio (0:00 - 0:30)**:
   - Land on Curve Genome. Notice the obsidian/cyan scientific developer UI.
   - Inspect the active preset **"Meteora Alpha Smooth"** (Piecewise Multi-Segment).
   - Toggle between **Price**, **Market Cap**, **Reserves**, and **Slippage Heatmaps**.
   - Adjust the **Virtual SOL Reserve** slider and observe how the starting price impact flattens in real-time.
2. **Simulation Lab & Order Tape (0:30 - 1:00)**:
   - Switch to **Simulation Lab**.
   - Select **"T0 Sniper Bot Barrage & Dump"** and click **Re-seed Simulation**.
   - Watch the simulated order tape log sniper entries, observe the dynamic fee surge tax, and track the **Graduation Radar** approaching 85 SOL.
3. **Stress Lab & Battle-Test (1:00 - 1:25)**:
   - Switch to **Stress Lab**.
   - Review the **Overall Resilience Score (92/100, Grade A+)**.
   - Inspect the 5 attack vectors (T0 Sniper Monopoly, Whale Dump, MEV Sandwich Resistance).
   - Click **"Auto-Fix Vulnerabilities"** to apply recommended virtual reserve bumps.
4. **Curve Replay & DLMM Graduation (1:25 - 1:45)**:
   - Switch to **Curve Replay** and press **Play (5x)**.
   - Watch the price trajectory animate through milestones until it hits 100% graduation $\to$ triggering the **Meteora DLMM Active Bin Migration** celebration!
5. **Forking & On-Chain Launch Preview (1:45 - 2:00)**:
   - Open **Genome Library**, click **Fork**, enter custom token metadata, and view the **Diff Inspector**.
   - Click **Launch DBC**, inspect the transparent transaction simulation logs, rent fee breakdown, and connect your Solana wallet.

---

## 📜 License
MIT License. Built with ❤️ for the Meteora DBC Hackathon.
