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
  Plus,
  X,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const industries = [
  { key: "retail", label: "Retail", icon: ShoppingCart },
  { key: "finance", label: "Finance", icon: DollarSign },
  { key: "hr", label: "HR", icon: Users },
  { key: "marketing", label: "Marketing", icon: Megaphone },
  { key: "healthcare", label: "Healthcare", icon: HeartPulse },
  { key: "manufacturing", label: "Manufacturing", icon: Factory },
];

const roles = [
  { value: "admin", label: "Admin", desc: "Manage members and run all analysis" },
  { value: "analyst", label: "Analyst", desc: "Upload data and run analysis" },
  { value: "viewer", label: "Viewer", desc: "View shared reports only" },
];

export default function TeamOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [invites, setInvites] = useState<{ email: string; role: string }[]>([
    { email: "", role: "analyst" },
  ]);

  const addInvite = () => {
    setInvites([...invites, { email: "", role: "analyst" }]);
  };

  const removeInvite = (i: number) => {
    setInvites(invites.filter((_, idx) => idx !== i));
  };

  const updateInvite = (i: number, field: "email" | "role", val: string) => {
    const next = [...invites];
    next[i][field] = val;
    setInvites(next);
  };

  const handleComplete = () => {
    router.push("/dashboard");
  };

  return (
    <div className="dot-grid min-h-screen flex items-center justify-center relative">
      <div className="nebula-gold" />
      <div className="nebula-cyan" />

      <div className="relative z-10 w-full max-w-2xl px-4 py-12">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-center gap-1.5 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? "bg-cyan w-10" : "bg-bg-elevated w-6"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={handleComplete}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary font-body transition-colors cursor-pointer"
          >
            Skip <SkipForward size={12} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Workspace Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-2xl p-8"
            >
              <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">
                Set up your workspace
              </h2>
              <p className="text-sm text-text-secondary font-body mb-8">
                Your team&apos;s shared analytics environment.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium font-body text-text-secondary mb-1.5">
                    Workspace Name
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      placeholder="e.g. Marketing Analytics"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium font-body text-text-secondary mb-1.5">
                    Company Name (optional)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company"
                    className="w-full h-11 px-4 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium font-body text-text-secondary mb-1.5">
                    Company Logo (optional — for branded reports)
                  </label>
                  <div className="border border-dashed border-border-default rounded-xl p-6 text-center hover:border-cyan/30 transition-colors">
                    <Building2 size={24} className="mx-auto text-text-muted mb-2" />
                    <p className="text-xs text-text-muted font-body">
                      PNG, SVG, or JPG — max 2MB
                    </p>
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

          {/* Step 2: Industry */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-2xl p-8"
            >
              <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">
                Select your industry
              </h2>
              <p className="text-sm text-text-secondary font-body mb-8">
                This helps the AI tailor its analysis language and KPI detection for your team.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {industries.map((ind) => {
                  const Icon = ind.icon;
                  const isActive = industry === ind.key;
                  return (
                    <button
                      key={ind.key}
                      onClick={() => setIndustry(ind.key)}
                      className={`flex flex-col items-center gap-2 p-5 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-[var(--cyan-subtle)] border-border-cyan text-cyan"
                          : "bg-bg-secondary border-border-default text-text-secondary hover:border-border-strong"
                      }`}
                    >
                      <Icon size={24} />
                      <span className="text-sm font-medium font-body">{ind.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Continue <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Invite Members */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-2xl p-8"
            >
              <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">
                Invite your team
              </h2>
              <p className="text-sm text-text-secondary font-body mb-8">
                Add team members now or invite them later from settings.
              </p>

              <div className="space-y-3">
                {invites.map((inv, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="email"
                      value={inv.email}
                      onChange={(e) => updateInvite(i, "email", e.target.value)}
                      placeholder="colleague@company.com"
                      className="flex-1 h-10 px-3 rounded-lg bg-bg-secondary border border-border-default text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan transition-colors"
                    />
                    <select
                      value={inv.role}
                      onChange={(e) => updateInvite(i, "role", e.target.value)}
                      className="h-10 px-3 rounded-lg bg-bg-secondary border border-border-default text-xs font-body text-text-primary focus:outline-none focus:border-cyan transition-colors cursor-pointer w-28"
                    >
                      {roles.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    {invites.length > 1 && (
                      <button
                        onClick={() => removeInvite(i)}
                        className="p-2 text-text-muted hover:text-semantic-red transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addInvite}
                className="flex items-center gap-1.5 mt-3 text-xs text-cyan hover:text-cyan-bright font-body cursor-pointer transition-colors"
              >
                <Plus size={14} /> Add another
              </button>

              {/* Role descriptions */}
              <div className="mt-6 space-y-2">
                {roles.map((r) => (
                  <div key={r.value} className="flex items-start gap-2">
                    <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded mt-0.5 ${
                      r.value === "admin" ? "bg-gold/10 text-gold" :
                      r.value === "analyst" ? "bg-cyan/10 text-cyan" :
                      "bg-bg-elevated text-text-muted"
                    }`}>
                      {r.label}
                    </span>
                    <span className="text-[11px] text-text-muted font-body">{r.desc}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button onClick={() => setStep(4)}>
                  Continue <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">
                Your workspace is ready! 🚀
              </h2>
              <p className="text-sm text-text-secondary font-body mb-8 max-w-md mx-auto">
                Here are the key areas of your team workspace.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {[
                  { title: "Dataset Library", desc: "Shared team datasets accessible by all members" },
                  { title: "AI Agent", desc: "Ask questions about any shared dataset" },
                  { title: "Shared Reports", desc: "Generate & share analysis reports with the team" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-bg-secondary rounded-xl p-4 border border-border-subtle">
                    <div className="w-7 h-7 rounded-full bg-cyan/10 text-cyan font-mono font-semibold text-xs flex items-center justify-center mx-auto mb-2">
                      {idx + 1}
                    </div>
                    <h3 className="font-heading font-semibold text-xs text-text-primary mb-1">{item.title}</h3>
                    <p className="text-[10px] text-text-muted font-body">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(3)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button onClick={handleComplete} size="lg">
                  Go to Workspace <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
