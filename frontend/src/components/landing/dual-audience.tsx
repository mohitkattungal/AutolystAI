"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/section";
import { Check, User, Users } from "lucide-react";

const individualBenefits = [
  "Complete data analysis in under 30 seconds",
  "No coding or technical skills required",
  "Auto-generated boardroom-ready PDF reports",
  "AI explains every finding in plain English",
];

const teamBenefits = [
  "Shared datasets and collaborative analysis",
  "Role-based access for Admins, Analysts & Viewers",
  "Company-branded PDF reports for clients",
  "Team activity feed and usage analytics",
];

export function DualAudience() {
  return (
    <Section id="audience">
      <SectionHeader
        badge="BUILT FOR EVERYONE"
        title="One Platform."
        titleHighlight="Two Experiences."
        description="Whether you work solo or with a team, AutolystAI adapts to how you work."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative">
        {/* Divider */}
        <div className="hidden lg:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex-col items-center justify-center z-10">
          <div className="w-px h-full bg-border-default" />
          <span className="absolute top-1/2 -translate-y-1/2 bg-bg-void px-3 py-1.5 rounded-full border border-border-default text-xs font-body text-text-muted">
            OR
          </span>
        </div>

        {/* Individual Panel */}
        <motion.div
          className="p-8 lg:p-12 rounded-2xl lg:rounded-r-none border border-border-subtle bg-[var(--gold-subtle)]"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-border-gold mb-6">
            <User size={14} className="text-gold" />
            <span className="text-xs font-medium font-body text-gold">Personal</span>
          </div>
          <h3 className="font-heading font-bold text-2xl text-text-primary mb-2">
            For Individual Users
          </h3>
          <p className="text-text-secondary text-sm font-body mb-6 leading-relaxed">
            Freelancers, consultants, researchers, and startup founders who need fast, powerful analysis without a team.
          </p>
          <ul className="space-y-3">
            {individualBenefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Check size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm font-body text-text-primary">{b}</span>
              </li>
            ))}
          </ul>
          <a
            href="/auth/signup?type=individual"
            className="inline-flex items-center gap-1.5 mt-8 text-sm font-medium font-body text-gold hover:text-gold-bright transition-colors"
          >
            Start analyzing for free →
          </a>
        </motion.div>

        {/* Team Panel */}
        <motion.div
          className="p-8 lg:p-12 rounded-2xl lg:rounded-l-none border border-border-subtle bg-[var(--cyan-subtle)]"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-border-cyan mb-6">
            <Users size={14} className="text-cyan" />
            <span className="text-xs font-medium font-body text-cyan">Teams</span>
          </div>
          <h3 className="font-heading font-bold text-2xl text-text-primary mb-2">
            For Teams & Companies
          </h3>
          <p className="text-text-secondary text-sm font-body mb-6 leading-relaxed">
            Marketing, finance, HR, and operations teams that need collaborative data intelligence.
          </p>
          <ul className="space-y-3">
            {teamBenefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Check size={16} className="text-cyan mt-0.5 flex-shrink-0" />
                <span className="text-sm font-body text-text-primary">{b}</span>
              </li>
            ))}
          </ul>
          <a
            href="/auth/signup?type=team"
            className="inline-flex items-center gap-1.5 mt-8 text-sm font-medium font-body text-cyan hover:text-cyan-bright transition-colors"
          >
            Explore team plans →
          </a>
        </motion.div>
      </div>
    </Section>
  );
}
