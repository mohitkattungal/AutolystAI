"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader, GlassCard } from "@/components/ui/section";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Sparkles,
  BarChart3,
  LineChart,
  MessageSquare,
  Database,
  Cpu,
  BookOpen,
  AlertTriangle,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    name: "Auto Data Cleaning",
    description:
      "Automatically detects and fixes missing values, duplicates, type errors, and formatting issues.",
    tooltip:
      "What it is: Automated data quality repair. Why it matters: Clean data is the foundation of accurate analysis. You never have to wrangle messy spreadsheets again.",
  },
  {
    icon: BarChart3,
    name: "Smart Exploratory Analysis",
    description:
      "Runs a full statistical exploration and surfaces the most interesting patterns automatically.",
    tooltip:
      "What it is: Automated EDA (Exploratory Data Analysis). Why it matters: Finds hidden patterns, correlations, and distributions you'd miss without hours of manual work.",
  },
  {
    icon: LineChart,
    name: "Auto Visualization",
    description:
      "Selects the best chart type for each insight and generates publication-ready visualizations.",
    tooltip:
      "What it is: AI-selected chart generation. Why it matters: No guessing which chart to use — the AI picks the most effective visualization for each finding.",
  },
  {
    icon: MessageSquare,
    name: "Natural Language Q&A",
    description:
      "Ask questions about your data in plain English and get instant answers with supporting evidence.",
    tooltip:
      "What it is: Chat with your data using natural language. Why it matters: Anyone on your team can get answers without knowing SQL or statistics.",
  },
  {
    icon: Database,
    name: "Text-to-SQL",
    description:
      "Generates optimized SQL queries from natural language questions for technical users.",
    tooltip:
      "What it is: Converts plain English to SQL queries. Why it matters: Technical users get the exact query they can verify and customize. Best for: analysts and engineers.",
  },
  {
    icon: Cpu,
    name: "AutoML Predictions",
    description:
      "Trains multiple ML models automatically, evaluates them, and selects the best performer.",
    tooltip:
      "What it is: Automated machine learning model training. Why it matters: Get predictive models (churn, revenue, fraud) without writing any ML code.",
  },
  {
    icon: BookOpen,
    name: "AI Insight Narrator",
    description:
      "Translates statistical findings into plain English narratives that anyone can understand.",
    tooltip:
      "What it is: AI-written analysis narratives. Why it matters: Every chart and metric comes with a human-readable explanation of what it means for your business.",
  },
  {
    icon: AlertTriangle,
    name: "Anomaly Explainer",
    description:
      "Detects unusual data points and explains why they exist with probable causes and recommendations.",
    tooltip:
      "What it is: Root cause analysis for anomalies. Why it matters: Doesn't just flag outliers — tells you WHY they happened and what to do about them.",
  },
  {
    icon: FileText,
    name: "Board-Ready Reports",
    description:
      "Generates complete PDF reports with executive summaries, charts, and strategic recommendations.",
    tooltip:
      "What it is: Auto-generated professional reports. Why it matters: Present findings to leadership in minutes, not days. Includes cover page, charts, and action items.",
  },
];

export function FeaturesGrid() {
  return (
    <Section id="features">
      <SectionHeader
        badge="POWERFUL FEATURES"
        title="Everything You Need to Go From Data to"
        titleHighlight="Decisions"
        description="Nine AI-powered capabilities that automate the entire data analytics workflow."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--gold-subtle)] border border-border-gold flex items-center justify-center">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <Tooltip content={feature.tooltip} iconOnly side="left" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">
                  {feature.name}
                </h3>
                <p className="text-sm text-text-secondary font-body leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
