import type { Metadata } from 'next';

import './global.css';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/components/providers/auth_provider';

export const metadata: Metadata = {
  title: 'OfficeFlow',
  description: 'Ticketing & approvals with AI assistance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
