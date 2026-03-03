"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Eye,
  ChevronRight,
  Zap,
  Star,
  ArrowRight,
  BarChart3,
  PieChart,
  Target,
  Shield,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

/* ─────────── Types ─────────── */

interface Insight {
  id: string;
  type: "anomaly" | "opportunity" | "risk" | "trend" | "fact";
  severity: "high" | "medium" | "low";
  title: string;
  summary: string;
  detail: string;
  metric?: string;
  metricValue?: string;
  metricChange?: string;
  metricDirection?: "up" | "down" | "neutral";
  action?: string;
  icon: React.ElementType;
}

interface QuickAnswer {
  id: string;
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  color: "gold" | "cyan" | "violet" | "green" | "red" | "orange";
}

/* ─────────── Generate insights by category ─────────── */

function generateInsights(category: string): Insight[] {
  if (category === "sales" || category === "ecommerce" || category === "e-commerce") {
    return [
      {
        id: "pricing-anomaly",
        type: "anomaly",
        severity: "high",
        title: "Pricing Anomaly Detected",
        summary: "\"Wireless Charger\" is priced at $12.99 in West but $18.99 everywhere else.",
        detail: "The West region is selling 4x more units of this product than any other region. This is likely an unintentional price discrepancy — you're either losing $6 per unit or running a forgotten pricing experiment. At current volume, this costs approximately $2,340/month in lost revenue.",
        metric: "Revenue Impact",
        metricValue: "-$2,340/mo",
        metricChange: "per month",
        metricDirection: "down",
        action: "Review and standardize pricing for this product across all regions.",
        icon: AlertTriangle,
      },
      {
        id: "fake-best-month",
        type: "anomaly",
        severity: "high",
        title: "Your Best Month Might Be Misleading",
        summary: "62% of November orders came from a single customer (ID: C-4921).",
        detail: "Customer C-4921 placed 847 orders in 3 days during November. This is either a bulk corporate purchase or a data error. Either way, it's inflating your 'average monthly revenue' by approximately 28% and skewing trend analysis. All growth metrics may be overstated.",
        metric: "Data Skew",
        metricValue: "28%",
        metricChange: "metrics affected",
        metricDirection: "neutral",
        action: "Verify this customer's orders. Consider separating bulk purchases from regular analysis.",
        icon: AlertTriangle,
      },
      {
        id: "customer-churn-risk",
        type: "risk",
        severity: "high",
        title: "You're About to Lose Your 3rd Biggest Customer",
        summary: "Meridian Corp's orders dropped 80% in the last 2 months after 14 months of consistent buying.",
        detail: "This pattern matches what happened with 2 other customers (Apex Ltd and DataFlow Inc) before they stopped ordering entirely. Meridian Corp contributed $45,200 in revenue over the past year. If they leave, your monthly revenue will drop approximately 6%.",
        metric: "Revenue at Risk",
        metricValue: "$45.2K",
        metricChange: "annual value",
        metricDirection: "down",
        action: "Reach out to Meridian Corp immediately. Offer retention incentives before they churn.",
        icon: Shield,
      },
      {
        id: "hidden-cross-sell",
        type: "opportunity",
        severity: "medium",
        title: "Hidden Cross-Sell Opportunity",
        summary: "Customers who buy Product A also buy Product C 67% of the time — but you never cross-sell them.",
        detail: "There's a strong purchase correlation between these products, but they're never shown together or bundled. Implementing a simple 'Frequently bought together' recommendation could increase average order value by an estimated 12-18%.",
        metric: "AOV Potential",
        metricValue: "+15%",
        metricChange: "estimated lift",
        metricDirection: "up",
        action: "Create a bundle or 'frequently bought together' recommendation for these products.",
        icon: DollarSign,
      },
      {
        id: "weekend-gap",
        type: "trend",
        severity: "low",
        title: "Saturday Is Your Best Day, Monday Is Your Worst",
        summary: "Saturday revenue is 23% above average while Monday revenue is 31% below.",
        detail: "This pattern is consistent across all 12 months. You could optimize marketing spend, staffing, and promotional campaigns around this weekly cycle. Running promotions on low-traffic days might be more effective than competing for attention on busy ones.",
        metric: "Sat vs Mon",
        metricValue: "54%",
        metricChange: "gap",
        metricDirection: "up",
        action: "Shift ad spend toward Saturday peak and run promotions on Monday to even out revenue.",
        icon: TrendingUp,
      },
    ];
  }

  if (category === "hr" || category === "employee" || category === "attrition") {
    return [
      {
        id: "overtime-risk",
        type: "risk",
        severity: "high",
        title: "Overtime Is Your Biggest Attrition Driver",
        summary: "Employees working overtime are 3.2x more likely to leave than those who don't.",
        detail: "This is the single strongest predictor of attrition in your data — stronger than salary, satisfaction, or commute distance. 38% of your overtime workers have left, compared to 12% of non-overtime workers. R&D and Sales departments have the highest overtime rates.",
        metric: "Attrition Risk",
        metricValue: "3.2x",
        metricChange: "higher for OT",
        metricDirection: "up",
        action: "Audit overtime policies. Consider hiring in R&D and Sales to distribute workload.",
        icon: AlertTriangle,
      },
      {
        id: "promotion-gap",
        type: "risk",
        severity: "high",
        title: "47 Employees Haven't Been Promoted in 5+ Years",
        summary: "Employees stuck without promotion for 5+ years have a 26% attrition rate vs. 8% average.",
        detail: "These 47 employees represent a $2.1M annual payroll investment. If even half leave, recruitment and training costs would exceed $500K. Many are in mid-level roles with high institutional knowledge that's hard to replace.",
        metric: "At-Risk Payroll",
        metricValue: "$2.1M",
        metricChange: "annual",
        metricDirection: "down",
        action: "Review promotion pipeline. Fast-track high performers who've been overlooked.",
        icon: Shield,
      },
      {
        id: "satisfaction-dept",
        type: "anomaly",
        severity: "medium",
        title: "R&D Satisfaction Is Unusually Low",
        summary: "R&D satisfaction score is 2.1/4 — the lowest of any department by a wide margin.",
        detail: "The company average is 2.73/4. R&D is 23% below average. Combined with the highest overtime rate, this department is a ticking time bomb for turnover. Management satisfaction is 3.4/4 for comparison.",
        metric: "Satisfaction Gap",
        metricValue: "-23%",
        metricChange: "below average",
        metricDirection: "down",
        action: "Conduct focused engagement survey in R&D. Address overtime and career growth concerns.",
        icon: TrendingDown,
      },
      {
        id: "commute-insight",
        type: "trend",
        severity: "low",
        title: "Remote Work Could Save 15% of Attrition",
        summary: "Employees commuting 20+ miles have 21% higher attrition — remote options could retain them.",
        detail: "Distance from home is the 4th strongest predictor of attrition. 184 employees commute over 20 miles. Offering even 2-3 remote days per week for this group could significantly reduce turnover, saving an estimated $240K in annual replacement costs.",
        metric: "Potential Savings",
        metricValue: "$240K",
        metricChange: "per year",
        metricDirection: "up",
        action: "Pilot a hybrid work policy for employees with long commutes.",
        icon: Lightbulb,
      },
    ];
  }

  if (category === "marketing" || category === "campaign") {
    return [
      {
        id: "budget-waste",
        type: "risk",
        severity: "high",
        title: "34% of Your Ad Budget Is Underperforming",
        summary: "Display campaigns have a ROAS of 0.8x — you're losing $0.20 for every $1 spent.",
        detail: "Display campaigns account for $408K of total spend but generate only $326K in revenue. Meanwhile, Email campaigns deliver 4.2x ROAS. Shifting just 50% of Display budget to Email would generate approximately $170K in additional revenue.",
        metric: "Wasted Spend",
        metricValue: "$82K",
        metricChange: "negative ROI",
        metricDirection: "down",
        action: "Reduce Display budget by 50%. Reallocate to Email and Organic Social.",
        icon: AlertTriangle,
      },
      {
        id: "audience-goldmine",
        type: "opportunity",
        severity: "high",
        title: "One Audience Segment Converts 4x Better Than Others",
        summary: "The '25-34 Professional' segment has a 12.3% conversion rate vs. 3.1% average.",
        detail: "This segment is your sweet spot — they convert more, have 2x higher LTV, and cost 30% less to acquire. Currently, only 18% of your budget targets this segment. Increasing focus here could dramatically improve overall campaign efficiency.",
        metric: "Conversion Rate",
        metricValue: "12.3%",
        metricChange: "vs 3.1% avg",
        metricDirection: "up",
        action: "Increase budget allocation to the 25-34 Professional segment by 30-40%.",
        icon: Target,
      },
      {
        id: "creative-fatigue",
        type: "anomaly",
        severity: "medium",
        title: "Your Best Creative Stopped Working 3 Weeks Ago",
        summary: "Video Ad variant B had 8.5% CTR initially but has dropped to 2.1% — creative fatigue.",
        detail: "After approximately 50,000 impressions, click-through rates decay rapidly. This pattern is consistent across all your video creatives. You need to refresh creatives every 3-4 weeks to maintain performance. Static image ads show less fatigue, lasting 6-8 weeks.",
        metric: "CTR Decline",
        metricValue: "-75%",
        metricChange: "in 3 weeks",
        metricDirection: "down",
        action: "Rotate video creatives every 3 weeks. Build a creative production pipeline.",
        icon: TrendingDown,
      },
    ];
  }

  // Generic fallback
  return [
    {
      id: "outlier-detection",
      type: "anomaly",
      severity: "high",
      title: "3 Significant Outliers Found",
      summary: "3 data points are more than 3 standard deviations from the mean.",
      detail: "These outliers could be data entry errors or genuinely extreme events. They affect your averages by approximately 12% and will skew any predictive models. I recommend investigating them before running further analysis.",
      metric: "Impact on Mean",
      metricValue: "12%",
      metricChange: "skew",
      metricDirection: "up",
      action: "Review the flagged rows and decide whether to keep, remove, or cap them.",
      icon: AlertTriangle,
    },
    {
      id: "correlation-found",
      type: "trend",
      severity: "medium",
      title: "Strong Correlation Discovered",
      summary: "Two of your columns have a 0.89 correlation — they move almost perfectly together.",
      detail: "This strong relationship could indicate a causal link or that the columns are derived from each other. If you're building predictive models, including both would cause multicollinearity and reduce accuracy.",
      metric: "Correlation",
      metricValue: "r = 0.89",
      metricChange: "strong positive",
      metricDirection: "up",
      action: "Consider removing one of the correlated columns before modeling.",
      icon: TrendingUp,
    },
    {
      id: "missing-pattern",
      type: "risk",
      severity: "medium",
      title: "Missing Values Follow a Pattern",
      summary: "Missing data isn't random — it's concentrated in specific time periods and categories.",
      detail: "45 missing values are clustered in Q1 records under the 'Type B' category. This suggests a systematic data collection issue rather than random gaps. Simple mean imputation would be inappropriate here — it would mask the underlying problem.",
      metric: "Missing Values",
      metricValue: "45",
      metricChange: "in Q1 only",
      metricDirection: "neutral",
      action: "Investigate the data source for Q1 Type B records. Use targeted imputation.",
      icon: Shield,
    },
  ];
}

/* ─────────── Generate quick answers by category ─────────── */

function generateQuickAnswers(category: string): QuickAnswer[] {
  if (category === "sales" || category === "ecommerce" || category === "e-commerce") {
    return [
      { id: "best-day", label: "Best Day", value: "Saturday", subtext: "23% above avg revenue", icon: Star, color: "gold" },
      { id: "top-product", label: "Top Product", value: "Premium Laptop Pro", subtext: "$234,560 revenue (8.4%)", icon: ShoppingCart, color: "cyan" },
      { id: "worst-product", label: "Underperformer", value: "Basic Cable", subtext: "3 sales in 12 months", icon: TrendingDown, color: "red" },
      { id: "growth-rate", label: "YoY Growth", value: "+12.3%", subtext: "Accelerating in Q3-Q4", icon: TrendingUp, color: "green" },
      { id: "avg-order", label: "Avg Order Value", value: "$127.43", subtext: "Up from $112 last year", icon: DollarSign, color: "gold" },
      { id: "top-region", label: "Top Region", value: "West", subtext: "22% above other regions", icon: Target, color: "violet" },
    ];
  }

  if (category === "hr" || category === "employee" || category === "attrition") {
    return [
      { id: "attrition-rate", label: "Attrition Rate", value: "16.1%", subtext: "Above industry avg of 13%", icon: TrendingDown, color: "red" },
      { id: "riskiest-dept", label: "Riskiest Dept", value: "R&D", subtext: "22% attrition rate", icon: AlertTriangle, color: "orange" },
      { id: "safest-dept", label: "Safest Dept", value: "Management", subtext: "Only 6% attrition", icon: Shield, color: "green" },
      { id: "avg-tenure", label: "Avg Tenure", value: "7.0 yrs", subtext: "Median: 5 years", icon: Clock, color: "cyan" },
      { id: "top-risk", label: "#1 Risk Factor", value: "Overtime", subtext: "3.2x attrition multiplier", icon: AlertTriangle, color: "red" },
      { id: "at-risk-count", label: "At-Risk Now", value: "47 people", subtext: "High probability of leaving", icon: Users, color: "orange" },
    ];
  }

  if (category === "marketing" || category === "campaign") {
    return [
      { id: "best-channel", label: "Best Channel", value: "Email", subtext: "ROAS 4.2x (highest)", icon: Star, color: "gold" },
      { id: "worst-channel", label: "Worst Channel", value: "Display", subtext: "ROAS 0.8x (losing money)", icon: TrendingDown, color: "red" },
      { id: "total-spend", label: "Total Spend", value: "$1.2M", subtext: "Across all channels", icon: DollarSign, color: "cyan" },
      { id: "best-segment", label: "Best Audience", value: "25-34 Prof.", subtext: "12.3% conversion rate", icon: Target, color: "green" },
      { id: "avg-ctr", label: "Avg CTR", value: "3.2%", subtext: "Industry avg: 2.1%", icon: BarChart3, color: "violet" },
      { id: "conv-trend", label: "Conv. Trend", value: "+8%", subtext: "Over last 6 months", icon: TrendingUp, color: "green" },
    ];
  }

  return [
    { id: "total-rows", label: "Total Records", value: "3,200", subtext: "Across 12 columns", icon: BarChart3, color: "cyan" },
    { id: "data-quality", label: "Data Quality", value: "87/100", subtext: "45 missing values found", icon: Shield, color: "gold" },
    { id: "top-category", label: "Top Category", value: "Type A", subtext: "42% of all records", icon: PieChart, color: "violet" },
    { id: "trend-dir", label: "Overall Trend", value: "Upward", subtext: "+3.2% per period", icon: TrendingUp, color: "green" },
    { id: "outliers", label: "Outliers Found", value: "3", subtext: "May need review", icon: AlertTriangle, color: "orange" },
    { id: "strongest-corr", label: "Key Correlation", value: "r = 0.89", subtext: "Between score & value", icon: Target, color: "gold" },
  ];
}

/* ─────────── Detect category from filename ─────────── */

function detectCategory(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.includes("sales") || lower.includes("ecommerce") || lower.includes("e-commerce") || lower.includes("order") || lower.includes("revenue"))
    return "sales";
  if (lower.includes("employee") || lower.includes("attrition") || lower.includes("hr") || lower.includes("people"))
    return "hr";
  if (lower.includes("marketing") || lower.includes("campaign") || lower.includes("ad"))
    return "marketing";
  return "general";
}

/* ═══════════ MAIN COMPONENT ═══════════ */

interface AutoInsightsProps {
  fileName: string;
  onAskFollowUp?: (question: string) => void;
}

export default function AutoInsightsPanel({ fileName, onAskFollowUp }: AutoInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [quickAnswers, setQuickAnswers] = useState<QuickAnswer[]>([]);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Record<string, "up" | "down">>({});

  useEffect(() => {
    const category = detectCategory(fileName);
    const generatedInsights = generateInsights(category);
    const generatedAnswers = generateQuickAnswers(category);

    setInsights(generatedInsights);
    setQuickAnswers(generatedAnswers);

    // Simulate loading
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadTimer);
  }, [fileName]);

  // Reveal insights one by one
  useEffect(() => {
    if (isLoading || revealedCount >= insights.length) return;
    const timer = setTimeout(() => {
      setRevealedCount((c) => c + 1);
    }, 400);
    return () => clearTimeout(timer);
  }, [isLoading, revealedCount, insights.length]);

  const severityConfig = {
    high: { badge: "bg-semantic-red/10 text-semantic-red border-semantic-red/20", dot: "bg-semantic-red" },
    medium: { badge: "bg-semantic-orange/10 text-semantic-orange border-semantic-orange/20", dot: "bg-semantic-orange" },
    low: { badge: "bg-cyan/10 text-cyan border-border-cyan", dot: "bg-cyan" },
  };

  const typeConfig = {
    anomaly: { label: "Anomaly", color: "text-semantic-red" },
    opportunity: { label: "Opportunity", color: "text-semantic-green" },
    risk: { label: "Risk", color: "text-semantic-orange" },
    trend: { label: "Trend", color: "text-cyan" },
    fact: { label: "Fact", color: "text-text-secondary" },
  };

  const colorMap: Record<string, string> = {
    gold: "bg-gold/10 text-gold border-border-gold",
    cyan: "bg-cyan/10 text-cyan border-border-cyan",
    violet: "bg-violet/10 text-violet border-violet/20",
    green: "bg-semantic-green/10 text-semantic-green border-semantic-green/20",
    red: "bg-semantic-red/10 text-semantic-red border-semantic-red/20",
    orange: "bg-semantic-orange/10 text-semantic-orange border-semantic-orange/20",
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for Quick Answers */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-gold animate-pulse" />
            <span className="font-heading font-semibold text-sm text-text-primary">Scanning your data…</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-4 border border-border-subtle animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-bg-elevated mb-3" />
                <div className="h-3 w-16 bg-bg-elevated rounded mb-2" />
                <div className="h-5 w-20 bg-bg-elevated rounded mb-1" />
                <div className="h-2.5 w-24 bg-bg-elevated rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Loading skeleton for Insights */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-gold animate-pulse" />
            <span className="font-heading font-semibold text-sm text-text-primary">AI analyzing patterns…</span>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-5 border border-border-subtle animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-bg-elevated" />
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-bg-elevated rounded mb-2" />
                    <div className="h-3 w-72 bg-bg-elevated rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── QUICK ANSWERS ─── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-gold" />
          <h3 className="font-heading font-semibold text-sm text-text-primary">
            Quick Answers
          </h3>
          <span className="text-[10px] font-mono text-text-muted px-1.5 py-0.5 rounded-full bg-bg-secondary border border-border-subtle">
            Auto-detected
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickAnswers.map((qa, idx) => {
            const Icon = qa.icon;
            return (
              <motion.div
                key={qa.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                className={`glass-card rounded-xl p-3.5 border cursor-pointer hover:scale-[1.02] transition-all ${colorMap[qa.color].split(" ").slice(2).join(" ")} hover:shadow-sm`}
              >
                <Icon size={18} className={colorMap[qa.color].split(" ")[1] + " mb-2"} />
                <p className="text-[10px] font-body text-text-muted uppercase tracking-wider mb-0.5">
                  {qa.label}
                </p>
                <p className="text-base font-heading font-bold text-text-primary leading-tight mb-0.5">
                  {qa.value}
                </p>
                <p className="text-[10px] font-body text-text-muted leading-snug">
                  {qa.subtext}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── SURPRISE INSIGHTS ─── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-gold" />
            <h3 className="font-heading font-semibold text-sm text-text-primary">
              Things You Should Know
            </h3>
            <span className="text-[10px] font-mono text-text-muted px-1.5 py-0.5 rounded-full bg-bg-secondary border border-border-subtle">
              {insights.length} found
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {insights.slice(0, revealedCount).map((insight, idx) => {
              const Icon = insight.icon;
              const expanded = expandedInsight === insight.id;
              const typeInfo = typeConfig[insight.type];
              const sevConfig = severityConfig[insight.severity];
              const feedback = feedbacks[insight.id];

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 16, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`glass-card rounded-xl border overflow-hidden transition-all ${
                    insight.severity === "high"
                      ? "border-semantic-red/15"
                      : insight.severity === "medium"
                      ? "border-semantic-orange/15"
                      : "border-border-subtle"
                  }`}
                >
                  {/* Header */}
                  <button
                    onClick={() => setExpandedInsight(expanded ? null : insight.id)}
                    className="w-full text-left p-4 lg:p-5 cursor-pointer hover:bg-bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sevConfig.badge}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border ${sevConfig.badge}`}>
                            {insight.severity.toUpperCase()}
                          </span>
                          <span className={`text-[9px] font-mono ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                        </div>
                        <h4 className="font-heading font-semibold text-sm text-text-primary mb-1">
                          {insight.title}
                        </h4>
                        <p className="text-xs font-body text-text-secondary leading-relaxed">
                          {insight.summary}
                        </p>
                      </div>
                      {insight.metric && (
                        <div className="hidden sm:block text-right shrink-0 ml-2">
                          <p className="text-[10px] font-body text-text-muted">{insight.metric}</p>
                          <p className={`text-lg font-heading font-bold ${
                            insight.metricDirection === "up" ? "text-semantic-green" :
                            insight.metricDirection === "down" ? "text-semantic-red" :
                            "text-text-primary"
                          }`}>
                            {insight.metricValue}
                          </p>
                          <p className="text-[10px] font-body text-text-muted">{insight.metricChange}</p>
                        </div>
                      )}
                      <ChevronRight
                        size={16}
                        className={`text-text-muted shrink-0 mt-2 transition-transform ${expanded ? "rotate-90" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 lg:px-5 pb-4 lg:pb-5 border-t border-border-subtle pt-4">
                          <p className="text-xs font-body text-text-secondary leading-relaxed mb-4">
                            {insight.detail}
                          </p>

                          {insight.action && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-gold/5 border border-border-gold/20 mb-4">
                              <Lightbulb size={14} className="text-gold shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-body font-medium text-gold uppercase tracking-wider mb-0.5">
                                  Recommended Action
                                </p>
                                <p className="text-xs font-body text-text-secondary">
                                  {insight.action}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3 pt-2 border-t border-border-subtle">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onAskFollowUp) onAskFollowUp(`Tell me more about: ${insight.title}`);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-secondary border border-border-default hover:border-gold/30 text-xs font-body text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                            >
                              <Eye size={12} /> Investigate
                            </button>
                            <div className="flex items-center gap-1 ml-auto">
                              <span className="text-[10px] text-text-muted font-body mr-1">Helpful?</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); setFeedbacks(f => ({...f, [insight.id]: "up"})); }}
                                className={`p-1.5 rounded-md transition-colors cursor-pointer ${feedback === "up" ? "bg-semantic-green/10 text-semantic-green" : "text-text-muted hover:bg-bg-elevated hover:text-text-secondary"}`}
                              >
                                <ThumbsUp size={12} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setFeedbacks(f => ({...f, [insight.id]: "down"})); }}
                                className={`p-1.5 rounded-md transition-colors cursor-pointer ${feedback === "down" ? "bg-semantic-red/10 text-semantic-red" : "text-text-muted hover:bg-bg-elevated hover:text-text-secondary"}`}
                              >
                                <ThumbsDown size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
