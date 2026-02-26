"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";
import Link from "next/link";

interface PlanType {
  name: string;
  price: string;
  period: string;
  popular: boolean;
  features: string[];
  subtitle?: string;
}

const individualPlans: PlanType[] = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    popular: false,
    features: [
      "5 analyses per month",
      "50,000 row limit",
      "Auto EDA & visualizations",
      "10 AI questions per month",
      "Watermarked PDF reports",
      "Community support",
    ],
  },
  {
    name: "Solo Pro",
    price: "₹799",
    period: "/month",
    popular: true,
    features: [
      "Unlimited analyses",
      "500,000 row limit",
      "Full AutoML predictions",
      "Unlimited NL Q&A",
      "What-If Simulator",
      "Anomaly Explainer",
      "Clean PDF reports",
      "Google Sheets connection",
      "90-day history",
      "Priority support",
    ],
  },
  {
    name: "Solo Expert",
    price: "₹1,499",
    period: "/month",
    popular: false,
    features: [
      "Everything in Solo Pro",
      "Database connection",
      "API access",
      "Custom LLM key integration",
      "1-year history",
      "White-label PDF reports",
    ],
  },
];

const teamPlans: PlanType[] = [
  {
    name: "Team Starter",
    price: "₹3,499",
    period: "/month",
    subtitle: "5 seats",
    popular: false,
    features: [
      "5 member seats",
      "Role-based access (RBAC)",
      "Shared team workspace",
      "Shared dataset library",
      "Shared report library",
      "Team activity feed",
      "Company-branded PDFs",
      "1M row limit",
      "1 database connection",
      "180-day history",
    ],
  },
  {
    name: "Team Growth",
    price: "₹8,999",
    period: "/month",
    subtitle: "15 seats",
    popular: true,
    features: [
      "15 member seats",
      "Everything in Starter",
      "Scheduled auto-analysis",
      "3 database connections",
      "SSO login",
      "Dataset versioning",
      "Usage analytics for admins",
      "API access",
      "5M row limit",
      "1-year history",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    subtitle: "Unlimited seats",
    popular: false,
    features: [
      "Unlimited seats",
      "Everything in Growth",
      "On-premise deployment",
      "Custom LLM integration",
      "Compliance features",
      "SLA guarantees",
      "Dedicated CSM",
    ],
  },
];

export function Pricing() {
  const [tab, setTab] = useState<"individual" | "teams">("individual");
  const plans = tab === "individual" ? individualPlans : teamPlans;

  return (
    <Section id="pricing">
      <SectionHeader
        badge="SIMPLE PRICING"
        title="Plans That Scale"
        titleHighlight="With You"
        description="Start free. Upgrade when you need more power. Cancel anytime."
      />

      {/* Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-xl border border-border-default bg-bg-secondary p-1 gap-1">
          <button
            onClick={() => setTab("individual")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium font-body transition-all cursor-pointer ${
              tab === "individual"
                ? "bg-gold/15 text-gold border border-border-gold"
                : "text-text-secondary hover:text-text-primary border border-transparent"
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => setTab("teams")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium font-body transition-all cursor-pointer ${
              tab === "teams"
                ? "bg-cyan/10 text-cyan border border-border-cyan"
                : "text-text-secondary hover:text-text-primary border border-transparent"
            }`}
          >
            Teams
          </button>
        </div>
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`glass-card rounded-2xl p-7 flex flex-col ${
                plan.popular
                  ? "border-gold/40 ring-1 ring-gold/20 shadow-gold relative"
                  : ""
              }`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-text-inverse text-xs font-medium font-body">
                    <Crown size={12} />
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="font-heading font-semibold text-xl text-text-primary">
                {plan.name}
              </h3>
              {plan.subtitle && (
                <p className="text-xs text-text-muted font-body mt-0.5">
                  {plan.subtitle}
                </p>
              )}

              <div className="mt-4 mb-6">
                <span className="text-4xl font-heading font-bold text-text-primary">
                  {plan.price}
                </span>
                <span className="text-sm text-text-muted font-body ml-1">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-2.5 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      size={15}
                      className={`mt-0.5 flex-shrink-0 ${
                        plan.popular ? "text-gold" : "text-text-muted"
                      }`}
                    />
                    <span className="text-sm text-text-secondary font-body">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/signup">
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  size="lg"
                  className="w-full"
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
