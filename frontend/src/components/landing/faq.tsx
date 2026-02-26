"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/section";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What file formats does AutolystAI support?",
    a: "AutolystAI currently supports CSV, Excel (.xlsx, .xls), and JSON files. Google Sheets integration is available on paid plans. Database connections (PostgreSQL, MySQL) are available on Expert and Team plans.",
  },
  {
    q: "Do I need technical or coding skills to use AutolystAI?",
    a: "Not at all. AutolystAI is designed for anyone — business managers, marketers, founders, HR leads — not just data scientists. The AI explains everything in plain English and suggests what to analyze. Technical users also benefit from the automation and can inspect the underlying statistical methods.",
  },
  {
    q: "How is AutolystAI different from ChatGPT or other AI tools?",
    a: "ChatGPT is a general-purpose chatbot that can discuss data conceptually. AutolystAI is a purpose-built analytics agent that actually processes your data through an 11-stage lifecycle — cleaning, statistical analysis, machine learning, anomaly detection, and report generation. It produces real statistical results, not just text responses.",
  },
  {
    q: "How does the Team Workspace work?",
    a: "Team workspaces are shared environments where multiple people can upload datasets, run analyses, and share results. The workspace has role-based access control — Owners manage billing, Admins manage members, Analysts upload and analyze, and Viewers can only see shared reports. Each workspace has shared dataset and report libraries.",
  },
  {
    q: "What roles are available in team workspaces and what can each role do?",
    a: "There are four roles: Owner (full access including billing, cannot be removed), Admin (manage members and run all analysis, no billing), Analyst (upload data and run analysis, no member management), and Viewer (see shared reports only, no uploads or analysis).",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All data is encrypted in transit and at rest. Files are stored with UUID-based keys, never original filenames. Authentication uses httpOnly JWT cookies. API keys for custom LLM integration are encrypted. We never use your data to train any models. You can delete your data at any time.",
  },
  {
    q: "What happens if the AI makes a mistake?",
    a: "Every AI output includes the underlying data and methodology so you can verify findings. Statistical results include p-values and confidence intervals. ML model results include evaluation metrics. The AI labels its confidence level on insights. We recommend treating AI outputs as a powerful starting point that you validate, not as final truth.",
  },
  {
    q: "Can I cancel or change my plan anytime?",
    a: "Yes. All plans are month-to-month with no long-term commitment. You can upgrade, downgrade, or cancel at any time. When you downgrade, you keep access to your current plan until the billing period ends. Your data is always exportable.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section id="faq">
      <SectionHeader
        badge="FAQ"
        title="Frequently Asked"
        titleHighlight="Questions"
      />

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              className="glass-card rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
              >
                <span className="font-body font-medium text-sm text-text-primary pr-4">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={18} className="text-text-muted flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-6 pb-4 text-sm text-text-secondary font-body leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
