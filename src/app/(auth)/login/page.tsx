'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiOutlineFilm, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Google login failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md mx-4">
      <div className="card-vd !p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--vd-accent)] flex items-center justify-center">
              <HiOutlineFilm className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--vd-text)' }}>Welcome back</h1>
          <p className="text-sm" style={{ color: 'var(--vd-text-s)' }}>Sign in to continue your cinematic journey</p>
        </div>

        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border transition-all hover:bg-[var(--vd-accent-soft)] mb-6" style={{ borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}>
          <FcGoogle className="w-5 h-5" />
          <span className="text-sm font-medium">Continue with Google</span>
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ background: 'var(--vd-border)' }} />
          <span className="text-xs" style={{ color: 'var(--vd-text-m)' }}>or</span>
          <div className="flex-1 h-px" style={{ background: 'var(--vd-border)' }} />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="relative">
            <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--vd-text-m)' }} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all border focus:border-[var(--vd-accent)]" style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }} />
          </div>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--vd-text-m)' }} />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full pl-11 pr-11 py-3 rounded-xl text-sm outline-none transition-all border focus:border-[var(--vd-accent)]" style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--vd-text-m)' }}>
              {showPassword ? <HiOutlineEyeSlash className="w-4.5 h-4.5" /> : <HiOutlineEye className="w-4.5 h-4.5" />}
            </button>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-3 rounded-xl text-sm disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--vd-text-s)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium hover:underline" style={{ color: 'var(--vd-accent)' }}>Create one</Link>
        </p>
      </div>
    </motion.div>
  );
}
