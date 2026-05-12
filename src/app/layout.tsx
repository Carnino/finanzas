import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Finanzas PWA',
  description: 'Controla tus gastos de forma sencilla y elegante',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Finanzas',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <div className="app-shell">{children}</div>
        <Navigation />
      </body>
    </html>
  );
}
