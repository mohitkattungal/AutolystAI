"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Integrate with backend auth
    setTimeout(() => setIsLoading(false), 1500);
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

        {/* Google OAuth */}
        <button
          className="w-full h-11 rounded-xl border border-border-default bg-bg-secondary flex items-center justify-center gap-3 text-sm font-medium font-body text-text-primary hover:border-border-strong hover:bg-bg-elevated transition-all cursor-pointer mb-6"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border-default" />
          <span className="text-xs text-text-muted font-body">or sign in with email</span>
          <div className="flex-1 h-px bg-border-default" />
        </div>

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
