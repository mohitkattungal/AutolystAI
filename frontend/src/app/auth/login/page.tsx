"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error: authError } = await login(email, password);
    if (authError) {
      setError(authError);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Link href="/">
          <Logo size="large" />
        </Link>
      </div>

      {/* Card */}
      <div className="glass-card rounded-2xl p-8">
        <h1 className="font-heading font-bold text-2xl text-text-primary text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-text-secondary font-body text-center mb-8">
          Sign in to continue your analysis
        </p>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-semantic-red/10 border border-semantic-red/20 mb-6">
            <AlertCircle size={16} className="text-semantic-red flex-shrink-0" />
            <p className="text-xs text-semantic-red font-body">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium font-body text-text-secondary mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium font-body text-text-secondary mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-11 pl-10 pr-11 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border-default bg-bg-secondary accent-gold"
              />
              <span className="text-xs text-text-secondary font-body">Remember me</span>
            </label>
            <a href="#" className="text-xs text-gold hover:text-gold-bright font-body transition-colors">
              Forgot password?
            </a>
          </div>

          <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary font-body mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-gold hover:text-gold-bright font-medium transition-colors"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
