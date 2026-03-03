"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const { error: authError } = await signup({ email, password, full_name: name });
    if (authError) {
      setError(authError);
      return;
    }

    router.push("/auth/account-type");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-center mb-8">
        <Link href="/">
          <Logo size="large" />
        </Link>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <h1 className="font-heading font-bold text-2xl text-text-primary text-center mb-2">
          Create Your Account
        </h1>
        <p className="text-sm text-text-secondary font-body text-center mb-8">
          Start analyzing your data in seconds
        </p>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-semantic-red/10 border border-semantic-red/20 mb-6">
            <AlertCircle size={16} className="text-semantic-red flex-shrink-0" />
            <p className="text-xs text-semantic-red font-body">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium font-body text-text-secondary mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
          </div>

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
                placeholder="Min 8 characters"
                className="w-full h-11 pl-10 pr-11 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
                required
                minLength={8}
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

          <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted font-body mt-4 leading-relaxed">
          By signing up, you agree to our{" "}
          <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Privacy Policy</a>
        </p>

        <p className="text-center text-sm text-text-secondary font-body mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-gold hover:text-gold-bright font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
