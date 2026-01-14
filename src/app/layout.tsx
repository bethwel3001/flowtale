import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { AppProviders } from './providers';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'Branching Narratives',
  description: 'An interactive storytelling game where your choices shape the plot.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("min-h-screen font-body antialiased")}>
        <AppProviders>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
