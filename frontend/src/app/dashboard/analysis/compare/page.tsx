"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GitCompareArrows,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  Sparkles,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import Link from "next/link";

/* ─── Mock comparison data ─── */
const comparisonMetrics = [
  { metric: "Total Revenue", datasetA: "$1.42M", datasetB: "$1.15M", change: "+23.4%", direction: "up" as const },
  { metric: "Avg. Order Value", datasetA: "$67.80", datasetB: "$62.30", change: "+8.8%", direction: "up" as const },
  { metric: "Total Orders", datasetA: "24,920", datasetB: "21,040", change: "+18.4%", direction: "up" as const },
  { metric: "Churn Rate", datasetA: "4.2%", datasetB: "5.5%", change: "-1.3%", direction: "down" as const },
  { metric: "Customer LTV", datasetA: "$1,240", datasetB: "$1,080", change: "+14.8%", direction: "up" as const },
  { metric: "Repeat Purchase %", datasetA: "38.2%", datasetB: "31.4%", change: "+6.8%", direction: "up" as const },
];

const monthlyComparison = [
  { month: "Jan", "2024": 87200, "2023": 72400 },
  { month: "Feb", "2024": 92100, "2023": 76800 },
  { month: "Mar", "2024": 98400, "2023": 82100 },
  { month: "Apr", "2024": 105300, "2023": 86500 },
  { month: "May", "2024": 112800, "2023": 91200 },
  { month: "Jun", "2024": 108600, "2023": 95400 },
  { month: "Jul", "2024": 118900, "2023": 98700 },
  { month: "Aug", "2024": 124500, "2023": 102300 },
  { month: "Sep", "2024": 131200, "2023": 105800 },
  { month: "Oct", "2024": 138400, "2023": 108400 },
  { month: "Nov", "2024": 152300, "2023": 112600 },
  { month: "Dec", "2024": 145800, "2023": 115200 },
];

const segmentComparison = [
  { segment: "Enterprise", "2024": 42, "2023": 38 },
  { segment: "Mid-Market", "2024": 31, "2023": 33 },
  { segment: "SMB", "2024": 18, "2023": 20 },
  { segment: "Startup", "2024": 9, "2023": 9 },
];

function DirectionIcon({ direction }: { direction: "up" | "down" | "flat" }) {
  if (direction === "up") return <TrendingUp size={14} className="text-semantic-green" />;
  if (direction === "down") return <TrendingDown size={14} className="text-semantic-green" />;
  return <Minus size={14} className="text-text-muted" />;
}

export default function ComparisonPage() {
  const [datasetA] = useState("E-Commerce 2024");
  const [datasetB] = useState("E-Commerce 2023");

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/analysis"
            className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <GitCompareArrows size={18} className="text-cyan" />
              <h1 className="font-heading font-bold text-xl text-text-primary">Comparison Mode</h1>
            </div>
            <p className="text-xs text-text-muted font-body mt-0.5 ml-7">
              Side-by-side dataset analysis
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm">
          <Download size={14} /> Export Report
        </Button>
      </div>

      {/* Dataset Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4 border-t-2 border-t-gold">
          <p className="text-[10px] font-mono text-gold mb-1">DATASET A</p>
          <button className="flex items-center justify-between w-full text-left">
            <span className="font-heading font-semibold text-sm text-text-primary">{datasetA}</span>
            <ChevronDown size={16} className="text-text-muted" />
          </button>
          <p className="text-[11px] text-text-muted font-body mt-1">5,400 rows • 14 columns</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-t-2 border-t-cyan">
          <p className="text-[10px] font-mono text-cyan mb-1">DATASET B</p>
          <button className="flex items-center justify-between w-full text-left">
            <span className="font-heading font-semibold text-sm text-text-primary">{datasetB}</span>
            <ChevronDown size={16} className="text-text-muted" />
          </button>
          <p className="text-[11px] text-text-muted font-body mt-1">4,820 rows • 14 columns</p>
        </div>
      </div>

      {/* AI Summary */}
      <div className="rounded-xl border border-border-cyan bg-cyan/5 p-4 mb-6 flex items-start gap-3">
        <Sparkles size={18} className="text-cyan shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-body text-text-primary">
            <strong className="font-semibold">AI Summary:</strong> 2024 outperforms 2023 across all key metrics. Revenue grew 23.4% driven by Enterprise expansion. Churn rate improved by 1.3 percentage points, indicating stronger retention.
          </p>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="glass-card rounded-xl overflow-hidden mb-6">
        <div className="p-4 border-b border-border-subtle">
          <h3 className="font-heading font-semibold text-sm text-text-primary">Key Metrics Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left text-xs font-body font-medium text-text-muted px-4 py-3">Metric</th>
                <th className="text-right text-xs font-body font-medium text-gold px-4 py-3">{datasetA}</th>
                <th className="text-right text-xs font-body font-medium text-cyan px-4 py-3">{datasetB}</th>
                <th className="text-right text-xs font-body font-medium text-text-muted px-4 py-3">Change</th>
              </tr>
            </thead>
            <tbody>
              {comparisonMetrics.map((row, idx) => (
                <tr key={idx} className="border-b border-border-subtle last:border-b-0 hover:bg-bg-secondary/50 transition-colors">
                  <td className="text-sm font-body text-text-primary px-4 py-3">{row.metric}</td>
                  <td className="text-sm font-mono text-text-primary text-right px-4 py-3">{row.datasetA}</td>
                  <td className="text-sm font-mono text-text-secondary text-right px-4 py-3">{row.datasetB}</td>
                  <td className="text-right px-4 py-3">
                    <div className="inline-flex items-center gap-1.5">
                      <DirectionIcon direction={row.direction} />
                      <span className="text-xs font-mono font-medium text-semantic-green">{row.change}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Comparison */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <h3 className="font-heading font-semibold text-sm text-text-primary mb-4">
            Monthly Revenue Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyComparison} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip />
              <Legend formatter={(value) => <span className="text-xs font-body text-text-secondary">{value}</span>} />
              <Line type="monotone" dataKey="2024" stroke="#F5A623" strokeWidth={2.5} dot={{ r: 3, fill: "#F5A623" }} />
              <Line type="monotone" dataKey="2023" stroke="#00D4FF" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: "#00D4FF" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Segment Comparison */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <h3 className="font-heading font-semibold text-sm text-text-primary mb-4">
            Revenue Share by Segment
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={segmentComparison} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="segment" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip />
              <Legend formatter={(value) => <span className="text-xs font-body text-text-secondary">{value}</span>} />
              <Bar dataKey="2024" fill="#F5A623" radius={[4, 4, 0, 0]} />
              <Bar dataKey="2023" fill="#00D4FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
