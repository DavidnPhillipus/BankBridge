import { AppProviders } from '@/providers/app-providers';
import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FinConnect — Open Banking for Namibia',
  description:
    'One standardized API to connect banks, customers, and fintech apps across Namibia.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
