"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/section";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I uploaded my sales data and within 30 seconds I had insights that would have taken me a week to pull together in Excel. The AI even told me why my Q3 numbers dipped — turns out it was a shipping delay pattern I never noticed.",
    name: "Priya Sharma",
    role: "Freelance Business Consultant",
    type: "Individual (Non-Technical)",
  },
  {
    quote:
      "The AutoML pipeline is genuinely impressive. It trained and evaluated 6 models on my churn dataset in under 2 minutes, and the SHAP explanations saved me hours of interpretation work. I still verify everything, but this is a massive accelerator.",
    name: "Alex Chen",
    role: "Senior Data Analyst, TechCorp",
    type: "Individual (Technical)",
  },
  {
    quote:
      "Our marketing team used to wait 3 days for the analytics team to produce campaign reports. Now anyone on the team can upload campaign data and get actionable insights immediately. The shared workspace means we're all looking at the same findings.",
    name: "Rahul Mehta",
    role: "Marketing Director, GrowthBase",
    type: "Team Manager",
  },
];

export function Testimonials() {
  return (
    <Section>
      <SectionHeader
        badge="TRUSTED BY USERS"
        title="What People Are"
        titleHighlight="Saying"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="glass-card rounded-2xl p-6 border-l-2 border-gold"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Quote size={20} className="text-gold/40 mb-3" />
            <p className="text-sm text-text-secondary font-body italic leading-relaxed mb-6">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div>
              <p className="font-heading font-semibold text-sm text-text-primary">
                {t.name}
              </p>
              <p className="text-xs text-text-muted font-body">{t.role}</p>
              <p className="text-[10px] text-text-muted font-body mt-0.5">
                {t.type}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
