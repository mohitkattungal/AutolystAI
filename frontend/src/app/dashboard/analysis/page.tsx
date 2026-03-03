"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Table2,
  Download,
  Share2,
  Maximize2,
  Filter,
  SlidersHorizontal,
  BookOpen,
  GitCompareArrows,
  Sparkles,
  ChevronDown,
  Layers,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

/* ─── Mock Data ─── */
const revenueData = [
  { month: "Jan", revenue: 87200, orders: 1420 },
  { month: "Feb", revenue: 92100, orders: 1580 },
  { month: "Mar", revenue: 98400, orders: 1650 },
  { month: "Apr", revenue: 105300, orders: 1820 },
  { month: "May", revenue: 112800, orders: 1950 },
  { month: "Jun", revenue: 108600, orders: 1880 },
  { month: "Jul", revenue: 118900, orders: 2100 },
  { month: "Aug", revenue: 124500, orders: 2250 },
  { month: "Sep", revenue: 131200, orders: 2380 },
  { month: "Oct", revenue: 138400, orders: 2520 },
  { month: "Nov", revenue: 152300, orders: 2750 },
  { month: "Dec", revenue: 145800, orders: 2620 },
];

const segmentData = [
  { name: "Enterprise", value: 42, color: "#F5A623" },
  { name: "Mid-Market", value: 31, color: "#00D4FF" },
  { name: "SMB", value: 18, color: "#8B5CF6" },
  { name: "Startup", value: 9, color: "#10B981" },
];

const channelData = [
  { channel: "Direct", revenue: 485000, conversion: 4.2 },
  { channel: "Organic", revenue: 312000, conversion: 3.8 },
  { channel: "Social", revenue: 198000, conversion: 2.1 },
  { channel: "Email", revenue: 156000, conversion: 5.6 },
  { channel: "Referral", revenue: 124000, conversion: 6.2 },
  { channel: "Paid", revenue: 89000, conversion: 1.8 },
];

type ViewMode = "charts" | "table";

/* ─── KPI Card ─── */
function KPICard({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="glass-card rounded-xl p-4">
      <p className="text-xs text-text-muted font-body mb-1">{label}</p>
      <p className="font-heading font-bold text-xl text-text-primary">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        <TrendingUp
          size={12}
          className={positive ? "text-semantic-green" : "text-semantic-red rotate-180"}
        />
        <span
          className={`text-xs font-mono font-medium ${
            positive ? "text-semantic-green" : "text-semantic-red"
          }`}
        >
          {change}
        </span>
        <span className="text-[10px] text-text-muted font-body">vs last period</span>
      </div>
    </div>
  );
}

/* ─── Custom Recharts Tooltip ─── */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 border border-border-default shadow-lg">
      <p className="text-xs font-body font-medium text-text-primary mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-[11px] font-mono text-text-secondary">
          {entry.name}: <span className="text-text-primary font-medium">{typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "segments" | "channels">("overview");
  const [viewMode, setViewMode] = useState<ViewMode>("charts");

  const tabs = [
    { key: "overview" as const, label: "Revenue Overview" },
    { key: "segments" as const, label: "Segments" },
    { key: "channels" as const, label: "Channels" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text-primary">Analysis</h1>
          <p className="text-sm text-text-secondary font-body mt-0.5">
            E-Commerce Sales • 5,400 rows • 14 columns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/analysis/story">
            <Button variant="secondary" size="sm">
              <BookOpen size={14} /> Story Mode
            </Button>
          </Link>
          <Link href="/dashboard/analysis/compare">
            <Button variant="secondary" size="sm">
              <GitCompareArrows size={14} /> Compare
            </Button>
          </Link>
          <Button variant="secondary" size="sm">
            <Download size={14} /> Export
          </Button>
          <Button variant="secondary" size="sm">
            <Share2 size={14} /> Share
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KPICard label="Total Revenue" value="$1.42M" change="+23.4%" positive />
        <KPICard label="Avg. Order Value" value="$67.80" change="+8.2%" positive />
        <KPICard label="Total Orders" value="24,920" change="+18.7%" positive />
        <KPICard label="Churn Rate" value="4.2%" change="-1.3%" positive />
      </div>

      {/* AI Insight Banner */}
      <div className="rounded-xl border border-border-cyan bg-cyan/5 p-4 mb-6 flex items-start gap-3">
        <Sparkles size={18} className="text-cyan shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-body text-text-primary">
            <strong className="font-semibold">AI Insight:</strong> Revenue shows a strong seasonal pattern with Q4 peaks. November had the highest revenue at $152,300 — primarily driven by Enterprise segment promotions.
          </p>
          <button className="text-xs text-cyan hover:text-cyan-bright font-body mt-1 cursor-pointer transition-colors">
            See full analysis →
          </button>
        </div>
      </div>

      {/* Tabs + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-1 bg-bg-secondary rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-2 rounded-lg text-xs font-body font-medium transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="analysis-tab"
                  className="absolute inset-0 bg-bg-elevated border border-border-default rounded-lg"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-default text-xs font-body text-text-secondary hover:border-border-strong transition-colors cursor-pointer">
            <Filter size={13} /> Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-default text-xs font-body text-text-secondary hover:border-border-strong transition-colors cursor-pointer">
            <SlidersHorizontal size={13} /> Customize
          </button>
          <div className="flex items-center gap-0.5 bg-bg-secondary rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("charts")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "charts" ? "bg-bg-elevated text-text-primary" : "text-text-muted"
              }`}
            >
              <BarChart3 size={14} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-bg-elevated text-text-primary" : "text-text-muted"
              }`}
            >
              <Table2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Revenue Trend (Area) */}
            <div className="glass-card rounded-xl p-5 col-span-1 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-semibold text-sm text-text-primary">
                    Revenue Trend
                  </h3>
                  <p className="text-xs text-text-muted font-body">Monthly revenue over 12 months</p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted cursor-pointer">
                  <Maximize2 size={14} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F5A623" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                    axisLine={{ stroke: "var(--border-subtle)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#F5A623"
                    strokeWidth={2}
                    fill="url(#goldGrad)"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Bar */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-sm text-text-primary">
                  Monthly Orders
                </h3>
                <button className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted cursor-pointer">
                  <Maximize2 size={14} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                    axisLine={{ stroke: "var(--border-subtle)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#00D4FF" radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Segment Pie */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-sm text-text-primary">
                  Revenue by Segment
                </h3>
                <button className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted cursor-pointer">
                  <Maximize2 size={14} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <RechartsPie>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {segmentData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span className="text-xs font-body text-text-secondary">{value}</span>
                    )}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeTab === "segments" && (
          <motion.div
            key="segments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-4">
                Segment Performance Comparison
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={segmentData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                    axisLine={{ stroke: "var(--border-subtle)" }}
                    tickLine={false}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "var(--text-secondary)", fontFamily: "DM Sans" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Revenue Share">
                    {segmentData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeTab === "channels" && (
          <motion.div
            key="channels"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-4">
                Revenue by Channel
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={channelData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis
                    dataKey="channel"
                    tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                    axisLine={{ stroke: "var(--border-subtle)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#F5A623" radius={[4, 4, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-4">
                Conversion Rate by Channel
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={channelData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis
                    dataKey="channel"
                    tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                    axisLine={{ stroke: "var(--border-subtle)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="conversion" fill="#00D4FF" radius={[4, 4, 0, 0]} name="Conversion %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
