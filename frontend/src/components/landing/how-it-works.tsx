"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/section";
import { Upload, Brain, Lightbulb, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload Your Data",
    description:
      "Drag & drop any CSV, Excel, or JSON file. Or connect to Google Sheets or a database.",
    accent: "gold",
  },
  {
    icon: Brain,
    number: "02",
    title: "AI Takes Over",
    description:
      "Our agent runs the 11-stage analytics lifecycle automatically — cleaning, EDA, modeling, and more.",
    accent: "cyan",
  },
  {
    icon: Lightbulb,
    number: "03",
    title: "Insights Surface",
    description:
      "Get ranked findings, explained anomalies, auto-generated KPIs, and strategic recommendations.",
    accent: "gold",
  },
  {
    icon: Download,
    number: "04",
    title: "Export & Act",
    description:
      "Download boardroom-ready PDFs, share with your team, or explore further with the AI agent.",
    accent: "cyan",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="overflow-hidden">
      <SectionHeader
        badge="SIMPLE WORKFLOW"
        title="How It"
        titleHighlight="Works"
        description="From raw data to smart decisions in four steps. The AI handles everything in between."
      />

      <div className="relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-px bg-border-default">
          <motion.div
            className="h-full bg-gradient-to-r from-gold via-cyan to-gold"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isGold = step.accent === "gold";
            return (
              <motion.div
                key={step.number}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {/* Icon circle */}
                <div
                  className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border ${
                    isGold
                      ? "bg-[var(--gold-subtle)] border-border-gold"
                      : "bg-[var(--cyan-subtle)] border-border-cyan"
                  }`}
                >
                  <Icon
                    size={24}
                    className={isGold ? "text-gold" : "text-cyan"}
                  />
                </div>

                {/* Number */}
                <span
                  className={`font-mono text-xs font-semibold mb-2 ${
                    isGold ? "text-gold" : "text-cyan"
                  }`}
                >
                  {step.number}
                </span>

                {/* Title */}
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-secondary font-body leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
