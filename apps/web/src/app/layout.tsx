
import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Ostium Trading | Decentralized & Seamless',
  description: 'Pro-grade decentralized trading platform powered by Ostium.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-forge-bg text-forge-text font-sans antialiased min-h-screen selection:bg-accent-cyan/30">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
