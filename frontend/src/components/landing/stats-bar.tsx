"use client";

import { AnimatedCounter } from "@/components/ui/animated-counter";
import { motion } from "framer-motion";

const stats = [
  { value: 50000, suffix: "+", label: "Datasets Analyzed" },
  { value: 12, suffix: "M+", label: "Rows Processed" },
  { value: 30, suffix: "s", label: "Avg. Time to Insights" },
  { value: 98, suffix: "%", label: "User Satisfaction" },
];

export function StatsBar() {
  return (
    <section className="relative border-y border-border-subtle bg-bg-primary/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                className="text-3xl sm:text-4xl font-mono font-semibold text-gold"
              />
              <p className="mt-1.5 text-sm text-text-secondary font-body">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
