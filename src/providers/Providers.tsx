'use client';

import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--vd-bg-s)',
            color: 'var(--vd-text)',
            border: '1px solid var(--vd-border)',
            borderRadius: '12px',
          },
        }}
      />
    </ThemeProvider>
  );
}
