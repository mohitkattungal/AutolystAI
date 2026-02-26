"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Download,
  Share2,
  Volume2,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Target,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

/* ─── Story Slides ─── */
interface StorySlide {
  id: number;
  title: string;
  icon: React.ElementType;
  narrative: string;
  insight: string;
  chartType: "area" | "bar" | "pie" | "stat";
}

const revenueData = [
  { month: "Jan", value: 87200 },
  { month: "Feb", value: 92100 },
  { month: "Mar", value: 98400 },
  { month: "Apr", value: 105300 },
  { month: "May", value: 112800 },
  { month: "Jun", value: 108600 },
  { month: "Jul", value: 118900 },
  { month: "Aug", value: 124500 },
  { month: "Sep", value: 131200 },
  { month: "Oct", value: 138400 },
  { month: "Nov", value: 152300 },
  { month: "Dec", value: 145800 },
];

const topProducts = [
  { name: "Premium Plan", value: 320000 },
  { name: "Enterprise Suite", value: 280000 },
  { name: "Add-On Pack", value: 195000 },
  { name: "Basic Plan", value: 156000 },
  { name: "Consulting", value: 98000 },
];

const segPie = [
  { name: "Enterprise", value: 42, color: "#F5A623" },
  { name: "Mid-Market", value: 31, color: "#00D4FF" },
  { name: "SMB", value: 18, color: "#8B5CF6" },
  { name: "Startup", value: 9, color: "#10B981" },
];

const slides: StorySlide[] = [
  {
    id: 1,
    title: "Revenue Growth Story",
    icon: TrendingUp,
    narrative:
      "Over the past 12 months, total revenue reached **$1.42M**, representing a **23.4% year-over-year increase**. Growth accelerated notably in Q3 and Q4.",
    insight:
      "November was the standout month at $152,300, driven by Enterprise promotions and seasonal demand.",
    chartType: "area",
  },
  {
    id: 2,
    title: "Top Revenue Drivers",
    icon: BarChart3,
    narrative:
      "The **Premium Plan** remained the top contributor at **$320K**, followed by the **Enterprise Suite** at $280K. Together these two products account for 57% of total revenue.",
    insight:
      "The Add-On Pack grew 41% YoY — consider promoting it more aggressively in Q1.",
    chartType: "bar",
  },
  {
    id: 3,
    title: "Customer Segments",
    icon: Target,
    narrative:
      "Enterprise customers represent **42% of revenue** despite being only 12% of accounts. Mid-Market (31%) provides the most balanced growth trajectory.",
    insight:
      "SMB segment shows 34% YoY growth — investing in self-serve features could accelerate this further.",
    chartType: "pie",
  },
  {
    id: 4,
    title: "Key Risk: June Dip",
    icon: AlertTriangle,
    narrative:
      "Revenue dipped **3.8% in June**, breaking the upward trend. Analysis indicates this correlated with a **pricing change** that was partially rolled back in July.",
    insight:
      "Future pricing adjustments should include an A/B testing phase to minimize revenue disruption.",
    chartType: "stat",
  },
  {
    id: 5,
    title: "Recommendations",
    icon: Lightbulb,
    narrative:
      "Based on the full analysis, the AI recommends three strategic actions to sustain growth momentum into the next fiscal year.",
    insight:
      "1) Double down on Enterprise Q4 promotions. 2) Launch Add-On Pack bundles. 3) Invest in SMB self-serve onboarding.",
    chartType: "stat",
  },
];

function SlideChart({ type }: { type: string }) {
  if (type === "area") {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="storyGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F5A623" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#F5A623" strokeWidth={2} fill="url(#storyGold)" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 15, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#00D4FF" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <RechartsPie>
          <Pie data={segPie} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
            {segPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip />
        </RechartsPie>
      </ResponsiveContainer>
    );
  }
  return null;
}

export default function StoryModePage() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const slide = slides[current];
  const Icon = slide.icon;
  const progress = ((current + 1) / slides.length) * 100;

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(slides.length - 1, c + 1));

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between px-4 lg:px-8 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/analysis"
            className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-gold" />
            <span className="font-heading font-semibold text-sm text-text-primary">
              Story Mode
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Download size={14} /> Export PDF
          </Button>
          <Button variant="secondary" size="sm">
            <Share2 size={14} /> Share
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="shrink-0 h-1 bg-bg-secondary">
        <motion.div
          className="h-full bg-gold rounded-r-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Main slide area */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="glass-card rounded-2xl p-6 lg:p-10"
            >
              {/* Slide header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Icon size={20} className="text-gold" />
                </div>
                <div>
                  <p className="text-[11px] font-mono text-text-muted">
                    Slide {current + 1} of {slides.length}
                  </p>
                  <h2 className="font-heading font-bold text-xl text-text-primary">
                    {slide.title}
                  </h2>
                </div>
              </div>

              {/* Narrative */}
              <p className="text-sm font-body text-text-secondary leading-relaxed mb-5">
                {slide.narrative.split("**").map((part, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="font-semibold text-text-primary">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>

              {/* Chart */}
              {slide.chartType !== "stat" && (
                <div className="rounded-xl bg-bg-secondary border border-border-subtle p-4 mb-5">
                  <SlideChart type={slide.chartType} />
                </div>
              )}

              {/* Stat callout for recommendation slides */}
              {slide.chartType === "stat" && slide.id === 4 && (
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="rounded-xl bg-semantic-red/5 border border-semantic-red/20 p-4 text-center">
                    <p className="font-heading font-bold text-2xl text-semantic-red">-3.8%</p>
                    <p className="text-xs text-text-muted font-body mt-1">June Revenue Dip</p>
                  </div>
                  <div className="rounded-xl bg-semantic-green/5 border border-semantic-green/20 p-4 text-center">
                    <p className="font-heading font-bold text-2xl text-semantic-green">+9.5%</p>
                    <p className="text-xs text-text-muted font-body mt-1">July Recovery</p>
                  </div>
                </div>
              )}

              {/* AI Insight */}
              <div className="rounded-xl border border-border-cyan bg-cyan/5 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Lightbulb size={14} className="text-cyan" />
                  <span className="text-xs font-heading font-semibold text-cyan">AI Insight</span>
                </div>
                <p className="text-sm font-body text-text-secondary leading-relaxed">
                  {slide.insight}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="shrink-0 flex items-center justify-between px-4 lg:px-8 py-4 border-t border-border-subtle bg-bg-primary/80 backdrop-blur-sm">
        {/* Slide dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                idx === current
                  ? "bg-gold w-6"
                  : idx < current
                  ? "bg-gold/40"
                  : "bg-bg-elevated"
              }`}
            />
          ))}
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={prev} disabled={current === 0}>
            <ChevronLeft size={16} /> Previous
          </Button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-full bg-gold/10 text-gold hover:bg-gold/20 transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <Button
            size="sm"
            onClick={next}
            disabled={current === slides.length - 1}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
