export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: 'var(--vd-hero-gradient)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, var(--vd-accent) 0%, transparent 70%)', top: '-10%', right: '-10%' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, var(--vd-accent) 0%, transparent 70%)', bottom: '-10%', left: '-10%' }} />
      </div>
      {children}
    </div>
  );
}
