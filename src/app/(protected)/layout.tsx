'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import QuickCapture from '@/components/dashboard/QuickCapture';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--vd-bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--vd-accent)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--vd-text-s)' }}>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      {children}
      <QuickCapture />
    </>
  );
}
