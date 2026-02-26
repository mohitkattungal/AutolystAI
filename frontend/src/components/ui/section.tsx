"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("relative py-24 px-4 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeader({
  badge,
  title,
  titleHighlight,
  description,
  className,
}: {
  badge?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("text-center mb-16", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {badge && (
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-medium font-body text-gold border border-border-gold bg-gold-subtle">
          {badge}
        </span>
      )}
      <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[40px] leading-tight text-text-primary">
        {title}{" "}
        {titleHighlight && (
          <span className="gradient-text-gold-cyan">{titleHighlight}</span>
        )}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl mx-auto text-text-secondary text-base sm:text-lg leading-relaxed font-body">
          {description}
        </p>
      )}
    </motion.div>
  );
}

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "glass-card rounded-2xl p-6 overflow-hidden",
        hover && "transition-all duration-300",
        className
      )}
      whileHover={
        hover
          ? {
              y: -2,
              borderColor: "var(--border-gold)",
              boxShadow: "var(--shadow-gold)",
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
