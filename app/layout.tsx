import './globals.css';
import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

const instrumentSans = Instrument_Sans({ subsets: ['latin'], weight: ['600'] });

export const metadata: Metadata = {
  title: 'ConfigGuard',
  description: 'Audit AI coding-agent configurations for security misconfigurations.',
  icons: { icon: '/favicon.svg' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={instrumentSans.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
