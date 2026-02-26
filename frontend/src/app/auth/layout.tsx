export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dot-grid min-h-screen flex items-center justify-center relative">
      {/* Nebula effects */}
      <div className="nebula-gold" />
      <div className="nebula-cyan" />
      <div className="relative z-10 w-full max-w-md px-4 py-12">{children}</div>
    </div>
  );
}
