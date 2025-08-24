import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'OfficeFlow',
  description: 'Workflow ticketing & approvals for workplaces',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
