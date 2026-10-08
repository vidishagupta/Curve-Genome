import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { WalletContextProvider } from '@/components/wallet/WalletContextProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CURVE GENOME | GitHub for Meteora Dynamic Bonding Curves',
  description:
    'Design. Stress-test. Replay. Fork. Launch. The production-grade bonding curve simulation laboratory & registry built for Meteora DBC on Solana.',
  keywords: [
    'Meteora DBC',
    'Bonding Curve',
    'Solana',
    'Tokenomics',
    'DLMM',
    'Dynamic AMM',
    'DeFi Simulator',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#07080c] font-sans antialiased text-slate-100 selection:bg-brand-cyan/20 selection:text-brand-cyan">
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
