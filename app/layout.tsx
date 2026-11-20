import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TKTPASJEGERE',
  description: 'Résolution intelligente de travaux pratiques',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
