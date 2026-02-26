"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionHeader, GlassCard } from "@/components/ui/section";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Megaphone,
  HeartPulse,
  Factory,
} from "lucide-react";

const industries = [
  {
    key: "retail",
    label: "Retail",
    icon: ShoppingCart,
    useCases: [
      {
        title: "Sales Trend Forecasting",
        description: "Predict next quarter's revenue by product category",
        aiOutput:
          '"Your Electronics category shows a 34% revenue increase YoY, but returns are up 12%. I recommend investigating quality issues in the top 3 returned SKUs before scaling ad spend."',
      },
      {
        title: "Customer Segmentation",
        description: "Identify high-value customer clusters automatically",
        aiOutput:
          '"I found 4 distinct customer segments. Your \'Premium Loyalists\' (8% of customers) drive 41% of revenue. Targeted retention for this group could be 3x more effective than broad campaigns."',
      },
      {
        title: "Inventory Optimization",
        description: "Detect overstocked and understocked products",
        aiOutput:
          '"17 SKUs have over 90 days of unsold inventory ($234K tied up). Meanwhile, 8 fast-moving items are at risk of stockout within 2 weeks."',
      },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    icon: DollarSign,
    useCases: [
      {
        title: "Fraud Detection",
        description: "Identify suspicious transactions automatically",
        aiOutput:
          '"I detected 23 transactions matching fraud patterns — unusual amounts, off-hours timing, and new merchant categories. Confidence: 89%. Recommend immediate review."',
      },
      {
        title: "Credit Risk Assessment",
        description: "Predict default probability for loan applicants",
        aiOutput:
          '"The XGBoost model achieves 92% AUC on your loan data. Top risk factors: debt-to-income ratio (32% importance), payment history gaps (24%), and credit utilization (18%)."',
      },
      {
        title: "Revenue Forecasting",
        description: "Project quarterly financials with confidence intervals",
        aiOutput:
          '"Q3 revenue forecast: ₹4.2Cr (±8%). The seasonal pattern suggests a dip in August. This aligns with the last 3 years of data."',
      },
    ],
  },
  {
    key: "hr",
    label: "HR",
    icon: Users,
    useCases: [
      {
        title: "Employee Attrition Prediction",
        description: "Identify employees at risk of leaving",
        aiOutput:
          '"12 employees in Engineering show high attrition risk (>75% probability). Key factors: no promotion in 3+ years, below-market compensation, and low engagement scores."',
      },
      {
        title: "Compensation Analysis",
        description: "Find pay equity gaps across demographics",
        aiOutput:
          '"A statistically significant pay gap of 8.3% exists between male and female employees at the Senior level (p=0.003). This persists after controlling for tenure and performance."',
      },
      {
        title: "Hiring Funnel Optimization",
        description: "Identify bottlenecks in your recruitment pipeline",
        aiOutput:
          '"Your biggest drop-off is between Technical Screen and Onsite (67% loss). Engineering roles take 47 days to fill vs. company average of 32 days."',
      },
    ],
  },
  {
    key: "marketing",
    label: "Marketing",
    icon: Megaphone,
    useCases: [
      {
        title: "Campaign ROI Analysis",
        description: "Compare performance across all marketing channels",
        aiOutput:
          '"Email campaigns deliver 4.2x ROI vs 1.8x for paid social. However, paid social drives 3x more top-of-funnel awareness. I recommend a blended strategy."',
      },
      {
        title: "Customer Lifetime Value",
        description: "Predict CLV by acquisition channel",
        aiOutput:
          '"Organic search customers have 2.3x higher CLV (₹12,400) than paid ad customers (₹5,400). Investing in SEO content could yield better long-term returns."',
      },
      {
        title: "A/B Test Analysis",
        description: "Get statistically rigorous experiment results",
        aiOutput:
          '"Variant B shows a 7.2% conversion lift over control (p=0.012, significant). Effect size is medium (Cohen\'s d=0.34). Recommend full rollout."',
      },
    ],
  },
  {
    key: "healthcare",
    label: "Healthcare",
    icon: HeartPulse,
    useCases: [
      {
        title: "Patient Readmission Risk",
        description: "Predict 30-day readmission probability",
        aiOutput:
          '"142 patients show >60% readmission risk. Top factors: chronic conditions count, days since last admission, and medication adherence score. Early intervention recommended."',
      },
      {
        title: "Resource Utilization",
        description: "Optimize bed occupancy and staff scheduling",
        aiOutput:
          '"ICU occupancy peaks on Tuesdays (94%) and dips on weekends (61%). Elective surgery scheduling adjustment could smooth utilization and reduce overtime costs by 15%."',
      },
      {
        title: "Treatment Outcome Analysis",
        description: "Compare effectiveness across treatment protocols",
        aiOutput:
          '"Protocol B shows 23% better outcomes than Protocol A for patients aged 45-65 (p=0.008). No significant difference for other age groups."',
      },
    ],
  },
  {
    key: "manufacturing",
    label: "Manufacturing",
    icon: Factory,
    useCases: [
      {
        title: "Defect Rate Prediction",
        description: "Predict quality issues before they occur",
        aiOutput:
          '"Line 3\'s defect rate increased 340% when ambient humidity exceeds 72%. I recommend humidity control investment — estimated ROI: 890% annually."',
      },
      {
        title: "Predictive Maintenance",
        description: "Forecast equipment failures before downtime",
        aiOutput:
          '"Machine M-204 shows vibration patterns matching pre-failure signatures. Predicted failure window: 7-12 days. Scheduled maintenance recommended within 5 days."',
      },
      {
        title: "Supply Chain Optimization",
        description: "Identify supplier risks and delivery patterns",
        aiOutput:
          '"Supplier #7 has delivered late 34% of the time in Q4, up from 12% in Q3. Alternative suppliers in the same region show 95%+ on-time rates."',
      },
    ],
  },
];

export function IndustryUseCases() {
  const [active, setActive] = useState("retail");
  const current = industries.find((i) => i.key === active)!;

  return (
    <Section id="use-cases">
      <SectionHeader
        badge="INDUSTRY SOLUTIONS"
        title="Built for"
        titleHighlight="Every Industry"
        description="See how AutolystAI delivers specific, actionable insights for your domain."
      />

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {industries.map((ind) => {
          const Icon = ind.icon;
          const isActive = ind.key === active;
          return (
            <button
              key={ind.key}
              onClick={() => setActive(ind.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium font-body transition-all cursor-pointer ${
                isActive
                  ? "bg-gold/15 text-gold border border-border-gold"
                  : "text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-default"
              }`}
            >
              <Icon size={16} />
              {ind.label}
            </button>
          );
        })}
      </div>

      {/* Use Cases */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {current.useCases.map((uc, i) => (
            <GlassCard key={uc.title} hover={false}>
              <h4 className="font-heading font-semibold text-lg text-text-primary mb-1">
                {uc.title}
              </h4>
              <p className="text-xs text-text-muted font-body mb-4">
                {uc.description}
              </p>
              {/* AI Output Card */}
              <div className="bg-bg-secondary rounded-xl p-3.5 border-l-2 border-gold">
                <p className="text-xs text-text-secondary font-body leading-relaxed italic">
                  {uc.aiOutput}
                </p>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
