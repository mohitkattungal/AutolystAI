"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/section";
import { Tooltip } from "@/components/ui/tooltip";
import {
  FileSearch,
  Upload,
  Sparkles,
  BarChart3,
  Wrench,
  FlaskConical,
  Cpu,
  CheckCircle,
  Lightbulb,
  FileText,
  Activity,
} from "lucide-react";

const stages = [
  {
    icon: FileSearch,
    name: "Business Understanding",
    num: 1,
    description: "AI infers goals & suggests analyses",
  },
  {
    icon: Upload,
    name: "Data Ingestion",
    num: 2,
    description: "Reads & profiles your uploaded file",
  },
  {
    icon: Sparkles,
    name: "Data Cleaning",
    num: 3,
    description: "Fixes quality issues automatically",
  },
  {
    icon: BarChart3,
    name: "Exploratory Analysis",
    num: 4,
    description: "Full statistical exploration & charts",
  },
  {
    icon: Wrench,
    name: "Feature Engineering",
    num: 5,
    description: "Creates optimized variables for ML",
  },
  {
    icon: FlaskConical,
    name: "Statistical Analysis",
    num: 6,
    description: "Runs correct tests automatically",
  },
  {
    icon: Cpu,
    name: "Predictive Modeling",
    num: 7,
    description: "Trains & compares ML models",
  },
  {
    icon: CheckCircle,
    name: "Model Evaluation",
    num: 8,
    description: "SHAP, ROC, confusion matrices",
  },
  {
    icon: Lightbulb,
    name: "Insight Generation",
    num: 9,
    description: "Ranked findings & anomaly explanations",
  },
  {
    icon: FileText,
    name: "Report Creation",
    num: 10,
    description: "Boardroom-ready PDF generation",
  },
  {
    icon: Activity,
    name: "Data Monitoring",
    num: 11,
    description: "Tracks changes over future uploads",
  },
];

export function LifecycleSection() {
  return (
    <Section id="lifecycle" className="overflow-hidden">
      <SectionHeader
        badge="ARCHITECTURALLY DIFFERENT"
        title="How AutolystAI Thinks —"
        titleHighlight="The Complete Analytics Lifecycle"
        description="Not just a chart generator. AutolystAI runs the full 11-stage Data Analytics Lifecycle that senior data scientists follow — automatically."
      />

      {/* Horizontal scrollable pipeline */}
      <div className="relative -mx-4 px-4">
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max py-4">
            {stages.map((stage, i) => {
              const Icon = stage.icon;
              const isLast = i === stages.length - 1;
              return (
                <div key={stage.num} className="flex items-center">
                  <motion.div
                    className="flex flex-col items-center gap-3 w-[140px] group"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    {/* Node */}
                    <Tooltip
                      content={`Stage ${stage.num}: ${stage.name} — ${stage.description}`}
                      side="top"
                    >
                      <div className="relative w-14 h-14 rounded-xl border border-border-gold bg-[var(--gold-subtle)] flex items-center justify-center group-hover:border-gold group-hover:shadow-gold transition-all duration-300 cursor-pointer">
                        <Icon size={22} className="text-gold" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-bg-primary border border-border-gold text-[10px] font-mono font-semibold text-gold flex items-center justify-center">
                          {stage.num}
                        </span>
                      </div>
                    </Tooltip>

                    {/* Label */}
                    <div className="text-center">
                      <p className="text-xs font-heading font-semibold text-text-primary leading-tight">
                        {stage.name}
                      </p>
                      <p className="text-[10px] text-text-muted font-body mt-0.5 leading-tight">
                        {stage.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Connector */}
                  {!isLast && (
                    <motion.div
                      className="w-8 h-px bg-border-gold mx-1 flex-shrink-0"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 + 0.1 }}
                      style={{ transformOrigin: "left" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
