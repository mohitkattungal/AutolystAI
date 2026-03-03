"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Megaphone,
  HeartPulse,
  Factory,
  ArrowRight,
  ArrowLeft,
  SkipForward,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";

const industries = [
  { key: "retail", label: "Retail", icon: ShoppingCart },
  { key: "finance", label: "Finance", icon: DollarSign },
  { key: "hr", label: "HR", icon: Users },
  { key: "marketing", label: "Marketing", icon: Megaphone },
  { key: "healthcare", label: "Healthcare", icon: HeartPulse },
  { key: "manufacturing", label: "Manufacturing", icon: Factory },
];

const jobTitles = [
  "Founder / CEO",
  "Data Analyst",
  "Business Analyst",
  "Marketing Manager",
  "Product Manager",
  "Consultant",
  "Researcher",
  "Software Engineer",
  "Finance Manager",
  "Other",
];

export default function IndividualOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");

  const handleComplete = async () => {
    try {
      // Save onboarding data — name, industry, job title
      if (name) {
        await authApi.updateProfile({ full_name: name });
      }
      await authApi.completeOnboarding({
        account_type: "individual",
        industry: industry || undefined,
        job_title: jobTitle || undefined,
      });
    } catch {
      // Continue to dashboard even if backend call fails
    }
    router.push("/dashboard");
  };

  return (
    <div className="dot-grid min-h-screen flex items-center justify-center relative">
      <div className="nebula-gold" />
      <div className="nebula-cyan" />

      <div className="relative z-10 w-full max-w-2xl px-4 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                s === step
                  ? "bg-gold w-8"
                  : s < step
                  ? "bg-gold/50"
                  : "bg-bg-elevated"
              }`}
            />
          ))}
        </div>

        {/* Skip Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleComplete}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary font-body transition-colors cursor-pointer"
          >
            Skip <SkipForward size={12} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Profile */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-2xl p-8"
            >
              <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">
                Tell us about yourself
              </h2>
              <p className="text-sm text-text-secondary font-body mb-8">
                This helps the AI tailor its analysis language to your background.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium font-body text-text-secondary mb-1.5">
                    What should we call you?
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full h-11 px-4 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium font-body text-text-secondary mb-1.5">
                    Job Title
                  </label>
                  <select
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary focus:outline-none focus:border-gold transition-colors cursor-pointer appearance-none"
                  >
                    <option value="">Select your role</option>
                    {jobTitles.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium font-body text-text-secondary mb-3">
                    Industry Focus
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {industries.map((ind) => {
                      const Icon = ind.icon;
                      const isActive = industry === ind.key;
                      return (
                        <button
                          key={ind.key}
                          onClick={() => setIndustry(ind.key)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${
                            isActive
                              ? "bg-[var(--gold-subtle)] border-border-gold text-gold"
                              : "bg-bg-secondary border-border-default text-text-secondary hover:border-border-strong"
                          }`}
                        >
                          <Icon size={22} />
                          <span className="text-xs font-medium font-body">{ind.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button onClick={() => setStep(2)}>
                  Continue <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Quick Tour */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">
                You&apos;re all set! 🎉
              </h2>
              <p className="text-sm text-text-secondary font-body mb-8 max-w-md mx-auto">
                Here&apos;s a quick look at the three most important areas of your workspace.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    num: "1",
                    title: "Upload Zone",
                    desc: "Drag & drop any data file to start analysis",
                  },
                  {
                    num: "2",
                    title: "AI Agent Chat",
                    desc: "Ask questions about your data in plain English",
                  },
                  {
                    num: "3",
                    title: "Analysis Results",
                    desc: "Charts, insights, and recommendations appear here",
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="bg-bg-secondary rounded-xl p-5 border border-border-subtle"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold/15 text-gold font-mono font-semibold text-sm flex items-center justify-center mx-auto mb-3">
                      {item.num}
                    </div>
                    <h3 className="font-heading font-semibold text-sm text-text-primary mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-text-muted font-body">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button onClick={handleComplete} size="lg">
                  Go to Dashboard <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
