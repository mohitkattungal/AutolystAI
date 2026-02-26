"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Users, Sparkles, BarChart3, MessageSquare, Activity } from "lucide-react";
import Link from "next/link";

const audiences = {
  individuals: {
    description:
      "Upload any CSV or Excel file and get a complete data analysis in seconds. No coding, no complex tools, no waiting for a data team. Perfect for freelancers, consultants, researchers, and solo founders.",
    cta: "Start Analyzing Free",
    ctaLink: "/auth/signup?type=individual",
  },
  teams: {
    description:
      "Give your entire team the power of a senior data scientist. Share datasets, collaborate on analyses, and make data-driven decisions together. Built for marketing, finance, HR, and operations teams.",
    cta: "See Team Plans",
    ctaLink: "/auth/signup?type=team",
  },
};

export function Hero() {
  const [audience, setAudience] = useState<"individuals" | "teams">("individuals");
  const current = audiences[audience];

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Nebula glows */}
      <div className="nebula-gold animate-[pulse_20s_ease-in-out_infinite]" />
      <div className="nebula-cyan animate-[pulse_20s_ease-in-out_infinite_10s]" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center">
          {/* Left Column — Text */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-gold bg-[var(--gold-subtle)] mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} className="text-gold" />
              <span className="text-xs font-medium font-body text-gold">
                AI-Powered · Agentic · For Everyone
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-[72px] leading-[1.05] tracking-tight">
              Your Data.
              <br />
              <span className="gradient-text-gold-cyan">Fully Analyzed.</span>
              <br />
              Instantly.
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg text-text-secondary font-body max-w-lg leading-relaxed">
              Upload any dataset to AutolystAI and let our intelligent agent run the
              complete analytics lifecycle — from cleaning to predictions to
              boardroom-ready reports. No code required.
            </p>

            {/* Audience Tabs */}
            <div className="mt-8 inline-flex rounded-xl border border-border-default bg-bg-secondary p-1 gap-1">
              <button
                onClick={() => setAudience("individuals")}
                className={`px-5 py-2 rounded-lg text-sm font-medium font-body transition-all cursor-pointer ${
                  audience === "individuals"
                    ? "bg-gold/15 text-gold border border-border-gold"
                    : "text-text-secondary hover:text-text-primary border border-transparent"
                }`}
              >
                For Individuals
              </button>
              <button
                onClick={() => setAudience("teams")}
                className={`px-5 py-2 rounded-lg text-sm font-medium font-body transition-all cursor-pointer ${
                  audience === "teams"
                    ? "bg-cyan/10 text-cyan border border-border-cyan"
                    : "text-text-secondary hover:text-text-primary border border-transparent"
                }`}
              >
                For Teams
              </button>
            </div>

            {/* Dynamic Description */}
            <motion.p
              key={audience}
              className="mt-4 text-sm text-text-secondary font-body max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {current.description}
            </motion.p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={current.ctaLink}>
                <Button size="hero">
                  {current.cta}
                  <ArrowRight size={18} />
                </Button>
              </Link>
              {audience === "individuals" ? (
                <Link href="/auth/signup?type=team">
                  <Button variant="secondary" size="hero">
                    See Team Plans
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signup?type=individual">
                  <Button variant="secondary" size="hero">
                    Start Analyzing Free
                  </Button>
                </Link>
              )}
            </div>

            {/* Caption */}
            <p className="mt-5 text-xs text-text-muted font-body">
              No credit card required · CSV, Excel, JSON · Results in under 30
              seconds
            </p>
          </motion.div>

          {/* Right Column — Floating Product Mockup */}
          <motion.div
            className="relative z-10 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="w-full max-w-[440px]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="glass-card rounded-2xl border border-border-gold/30 shadow-gold overflow-hidden">
                {/* Header Bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-gold" />
                    <span className="text-sm font-heading font-semibold text-text-primary">
                      AutolystAI Agent
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan pulse-cyan" />
                    <span className="text-[11px] font-body text-cyan">
                      AI Active
                    </span>
                  </div>
                </div>

                {/* File Row */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-border-subtle">
                  <Upload size={14} className="text-text-muted" />
                  <span className="text-xs font-mono text-text-secondary">
                    sales_data_2025.csv
                  </span>
                  <span className="ml-auto text-[10px] font-body text-semantic-green bg-semantic-green/10 px-2 py-0.5 rounded-full">
                    12,847 rows
                  </span>
                </div>

                {/* AI Message */}
                <div className="px-5 py-4">
                  <div className="bg-bg-secondary rounded-xl p-3.5 border-l-2 border-gold">
                    <p className="text-xs font-body text-text-secondary leading-relaxed">
                      I&apos;ve analyzed your sales data and found{" "}
                      <span className="text-gold font-medium">3 critical insights</span>.
                      Revenue grew 23% QoQ but customer churn increased in the Enterprise segment.
                      I recommend investigating pricing changes from Q2.
                    </p>
                  </div>
                </div>

                {/* Metric Preview Cards */}
                <div className="grid grid-cols-3 gap-3 px-5 pb-4">
                  <div className="bg-bg-secondary rounded-lg p-3 text-center">
                    <BarChart3 size={14} className="mx-auto text-gold mb-1" />
                    <p className="text-[11px] text-text-muted font-body">Revenue</p>
                    <p className="text-sm font-mono font-semibold text-semantic-green">
                      +23%
                    </p>
                  </div>
                  <div className="bg-bg-secondary rounded-lg p-3 text-center">
                    <Activity size={14} className="mx-auto text-cyan mb-1" />
                    <p className="text-[11px] text-text-muted font-body">Churn</p>
                    <p className="text-sm font-mono font-semibold text-semantic-red">
                      +4.2%
                    </p>
                  </div>
                  <div className="bg-bg-secondary rounded-lg p-3 text-center">
                    <MessageSquare size={14} className="mx-auto text-violet mb-1" />
                    <p className="text-[11px] text-text-muted font-body">AI Insights</p>
                    <p className="text-sm font-mono font-semibold text-text-primary">
                      12
                    </p>
                  </div>
                </div>

                {/* Team Avatars */}
                <div className="flex items-center gap-2 px-5 py-3 border-t border-border-subtle">
                  <div className="flex -space-x-2">
                    {["bg-gold", "bg-cyan", "bg-violet", "bg-semantic-green"].map(
                      (color, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-full ${color} border-2 border-bg-primary flex items-center justify-center`}
                        >
                          <Users size={10} className="text-bg-void" />
                        </div>
                      )
                    )}
                  </div>
                  <span className="text-[10px] font-body text-text-muted ml-1">
                    +3 team members collaborating
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
