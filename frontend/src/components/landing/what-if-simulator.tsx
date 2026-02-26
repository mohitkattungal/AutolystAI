"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/section";

const sliders = [
  { name: "Monthly Spend ($)", min: 0, max: 500, default: 200, step: 10 },
  { name: "Usage Frequency (days/mo)", min: 0, max: 30, default: 15, step: 1 },
  { name: "Support Tickets", min: 0, max: 20, default: 3, step: 1 },
];

function predict(values: number[]): { label: string; probability: number; color: string } {
  const spend = values[0];
  const usage = values[1];
  const tickets = values[2];
  const score = spend * 0.003 + usage * 0.04 - tickets * 0.06;
  const prob = Math.min(Math.max(score, 0.05), 0.98);
  if (prob > 0.7) return { label: "Low Risk", probability: prob, color: "var(--green)" };
  if (prob > 0.4) return { label: "Medium Risk", probability: prob, color: "var(--amber)" };
  return { label: "High Risk", probability: prob, color: "var(--red)" };
}

export function WhatIfSimulator() {
  const [values, setValues] = useState(sliders.map((s) => s.default));
  const result = predict(values);

  return (
    <Section id="simulator">
      <SectionHeader
        badge="INTERACTIVE DEMO"
        title="What-If"
        titleHighlight="Simulator"
        description="See how AutolystAI's predictive models work. Adjust the inputs and watch the prediction change in real time."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left — Explanation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-heading font-semibold text-2xl text-text-primary mb-4">
            Predict Customer Churn Risk
          </h3>
          <p className="text-text-secondary font-body text-sm leading-relaxed mb-6">
            This demo uses a sample customer churn model. Move the sliders to change
            customer attributes and see how the predicted churn risk updates instantly.
            In the real product, this works with your own trained models.
          </p>
          <div className="glass-card rounded-xl p-4 border-l-2 border-gold">
            <p className="text-xs font-body text-text-secondary leading-relaxed">
              <span className="text-gold font-medium">AI Recommendation: </span>
              {result.label === "High Risk"
                ? "This customer profile shows high churn risk. Consider proactive outreach, loyalty offers, or account review."
                : result.label === "Medium Risk"
                ? "Moderate churn risk detected. Monitor engagement metrics and consider targeted retention campaigns."
                : "This customer profile shows strong retention signals. Focus on upselling and expanding their usage."}
            </p>
          </div>
        </motion.div>

        {/* Right — Interactive Widget */}
        <motion.div
          className="glass-card rounded-2xl p-8"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          {/* Sliders */}
          <div className="space-y-6 mb-8">
            {sliders.map((slider, i) => (
              <div key={slider.name}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-body text-text-secondary">
                    {slider.name}
                  </label>
                  <span className="font-mono text-sm font-medium text-text-primary">
                    {values[i]}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={values[i]}
                  onChange={(e) => {
                    const next = [...values];
                    next[i] = Number(e.target.value);
                    setValues(next);
                  }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--gold) 0%, var(--gold) ${((values[i] - slider.min) / (slider.max - slider.min)) * 100}%, var(--bg-secondary) ${((values[i] - slider.min) / (slider.max - slider.min)) * 100}%, var(--bg-secondary) 100%)`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Prediction Output */}
          <div className="border-t border-border-subtle pt-6">
            <p className="text-xs text-text-muted font-body mb-3 uppercase tracking-wider">
              Predicted Churn Risk
            </p>
            <div className="flex items-end gap-4">
              <motion.div
                key={result.label}
                className="text-4xl font-mono font-bold"
                style={{ color: result.color }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {result.label}
              </motion.div>
              <motion.span
                className="text-lg font-mono text-text-secondary mb-1"
                key={result.probability.toFixed(2)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {(result.probability * 100).toFixed(1)}% confidence
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
