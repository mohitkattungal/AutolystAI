"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Share2,
  Clock,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  Eye,
  Search,
  FileBarChart2,
  FileSpreadsheet,
  Presentation,
  Sparkles,
  X,
  ChevronRight,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Image as ImageIcon,
  Zap,
  Target,
  Shield,
  DollarSign,
  Users,
  PieChart,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
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
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";

/* ═══════════════ TYPES ═══════════════ */

interface Report {
  id: string;
  title: string;
  type: "analysis" | "prediction" | "executive" | "custom";
  status: "ready" | "generating" | "scheduled";
  format: "pdf" | "xlsx" | "pptx";
  date: string;
  pages?: number;
  dataset: string;
  summary?: string;
}

/* ═══════════════ MOCK DATA ═══════════════ */

const reports: Report[] = [
  {
    id: "1",
    title: "Q4 Revenue Deep-Dive",
    type: "analysis",
    status: "ready",
    format: "pdf",
    date: "2 hours ago",
    pages: 12,
    dataset: "E-Commerce Sales",
    summary:
      "Comprehensive analysis of Q4 revenue trends, top-performing products, regional performance, and growth drivers.",
  },
  {
    id: "2",
    title: "Churn Prediction Results",
    type: "prediction",
    status: "ready",
    format: "pdf",
    date: "Yesterday",
    pages: 8,
    dataset: "Employee Attrition",
    summary:
      "Machine learning model predictions for employee churn risk, feature importance analysis, and retention recommendations.",
  },
  {
    id: "3",
    title: "Executive Summary — Dec 2024",
    type: "executive",
    status: "ready",
    format: "pdf",
    date: "3 days ago",
    pages: 6,
    dataset: "E-Commerce Sales",
    summary:
      "High-level KPI overview, trend analysis, and strategic recommendations for executive leadership.",
  },
  {
    id: "4",
    title: "Marketing Campaign ROI",
    type: "analysis",
    status: "generating",
    format: "pdf",
    date: "Just now",
    dataset: "Marketing Campaign",
    summary:
      "Multi-channel campaign performance analysis with ROAS breakdown and budget optimization suggestions.",
  },
  {
    id: "5",
    title: "Monthly KPI Dashboard",
    type: "custom",
    status: "scheduled",
    format: "pdf",
    date: "Scheduled: Jan 1",
    dataset: "E-Commerce Sales",
    summary:
      "Automated monthly report with key metrics, trends, and anomaly detection.",
  },
];

const revenueChartData = [
  { month: "Jul", value: 42000 },
  { month: "Aug", value: 48000 },
  { month: "Sep", value: 45000 },
  { month: "Oct", value: 63000 },
  { month: "Nov", value: 71000 },
  { month: "Dec", value: 68000 },
];

const categoryData = [
  { name: "Electronics", value: 38, color: "#F5A623" },
  { name: "Clothing", value: 24, color: "#00D4FF" },
  { name: "Home", value: 18, color: "#8B5CF6" },
  { name: "Sports", value: 12, color: "#22C55E" },
  { name: "Other", value: 8, color: "#6B7280" },
];

const kpiCards = [
  {
    label: "Total Revenue",
    value: "$337K",
    change: "+12.3%",
    direction: "up" as const,
    icon: DollarSign,
  },
  {
    label: "Orders",
    value: "5,412",
    change: "+8.7%",
    direction: "up" as const,
    icon: Target,
  },
  {
    label: "Customers",
    value: "2,847",
    change: "+15.2%",
    direction: "up" as const,
    icon: Users,
  },
  {
    label: "Avg Order Value",
    value: "$62.3",
    change: "-2.1%",
    direction: "down" as const,
    icon: BarChart3,
  },
];

/* ═══════════════ CONFIG ═══════════════ */

const formatIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  pptx: Presentation,
};

const typeColors: Record<string, { bg: string; text: string }> = {
  analysis: { bg: "bg-gold/10", text: "text-gold" },
  prediction: { bg: "bg-violet/10", text: "text-violet" },
  executive: { bg: "bg-cyan/10", text: "text-cyan" },
  custom: { bg: "bg-semantic-green/10", text: "text-semantic-green" },
};

const statusConfig: Record<
  string,
  { icon: React.ElementType; label: string; color: string }
> = {
  ready: {
    icon: CheckCircle2,
    label: "Ready",
    color: "text-semantic-green",
  },
  generating: {
    icon: Loader2,
    label: "Generating…",
    color: "text-gold",
  },
  scheduled: { icon: Clock, label: "Scheduled", color: "text-cyan" },
};

/* ═══════════════ REPORT PREVIEW ═══════════════ */

function ReportPreview({
  report,
  onClose,
}: {
  report: Report;
  onClose: () => void;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportPDF = useCallback(async () => {
    setExporting(true);
    try {
      const printWindow = window.open("", "_blank", "width=900,height=700");
      if (!printWindow) {
        window.print();
        setExporting(false);
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${report.title} - AutolystAI Report</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'DM Sans', sans-serif; color: #1a1a2e; background: #fff; padding: 40px; }
            .header { border-bottom: 3px solid #F5A623; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { font-family: 'Syne', sans-serif; font-size: 28px; color: #1a1a2e; margin-bottom: 8px; }
            .header .meta { font-size: 13px; color: #666; }
            .header .badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-right: 8px; }
            .badge-analysis { background: #FFF3E0; color: #F5A623; }
            .badge-prediction { background: #F3E5F5; color: #8B5CF6; }
            .badge-executive { background: #E0F7FA; color: #00B8D4; }
            .badge-custom { background: #E8F5E9; color: #22C55E; }
            .section { margin-bottom: 30px; }
            .section h2 { font-family: 'Syne', sans-serif; font-size: 18px; color: #1a1a2e; margin-bottom: 12px; border-left: 3px solid #F5A623; padding-left: 12px; }
            .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 30px; }
            .kpi-card { background: #f8f9fa; border-radius: 12px; padding: 20px; text-align: center; }
            .kpi-card .label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
            .kpi-card .value { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #1a1a2e; }
            .kpi-card .change { font-size: 12px; margin-top: 4px; font-weight: 500; }
            .kpi-card .change.up { color: #22C55E; }
            .kpi-card .change.down { color: #EF4444; }
            .insight-box { background: #FFFBF0; border: 1px solid #F5A623; border-radius: 10px; padding: 16px; margin-bottom: 12px; }
            .insight-box .title { font-weight: 600; font-size: 14px; margin-bottom: 6px; }
            .insight-box .desc { font-size: 13px; color: #555; line-height: 1.6; }
            .footer { border-top: 1px solid #eee; padding-top: 16px; margin-top: 40px; font-size: 11px; color: #999; display: flex; justify-content: space-between; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .table th { background: #f8f9fa; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; color: #666; letter-spacing: 0.5px; border-bottom: 2px solid #eee; }
            .table td { padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
            .action-box { background: #F0FDF4; border: 1px solid #22C55E; border-radius: 10px; padding: 16px; margin-top: 12px; }
            .action-box .title { font-weight: 600; color: #22C55E; font-size: 13px; margin-bottom: 6px; }
            .action-box .desc { font-size: 13px; color: #555; line-height: 1.6; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${report.title}</h1>
            <div class="meta">
              <span class="badge badge-${report.type}">${report.type}</span>
              Generated by AutolystAI &bull; Dataset: ${report.dataset} &bull; ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div class="section">
            <h2>Executive Summary</h2>
            <p style="font-size:14px;line-height:1.8;color:#444;margin-bottom:16px;">
              ${report.summary || "This report provides a comprehensive overview of the dataset analysis performed by AutolystAI."}
              The AI engine analyzed all available data points to surface key patterns, anomalies, and opportunities.
            </p>
          </div>
          <div class="kpi-grid">
            <div class="kpi-card"><div class="label">Total Revenue</div><div class="value">$337K</div><div class="change up">&#x25B2; 12.3%</div></div>
            <div class="kpi-card"><div class="label">Total Orders</div><div class="value">5,412</div><div class="change up">&#x25B2; 8.7%</div></div>
            <div class="kpi-card"><div class="label">Active Customers</div><div class="value">2,847</div><div class="change up">&#x25B2; 15.2%</div></div>
            <div class="kpi-card"><div class="label">Avg Order Value</div><div class="value">$62.3</div><div class="change down">&#x25BC; 2.1%</div></div>
          </div>
          <div class="section">
            <h2>Key Findings</h2>
            <div class="insight-box"><div class="title">&#x26A0; Pricing Anomaly Detected</div><div class="desc">A pricing discrepancy was found for "Wireless Charger" in the West region — priced at $12.99 vs. $18.99 elsewhere. This affects approximately $2,340/month in revenue.</div></div>
            <div class="insight-box"><div class="title">&#x1F4C8; Strong Weekend Performance</div><div class="desc">Saturday consistently outperforms weekday revenue by 23%, while Monday underperforms by 31%. This pattern held across all 12 months analyzed.</div></div>
            <div class="insight-box"><div class="title">&#x1F6E1; Customer Churn Risk</div><div class="desc">Meridian Corp (3rd largest customer) showed an 80% order decline over the last 2 months.</div></div>
          </div>
          <div class="section">
            <h2>Performance Breakdown</h2>
            <table class="table">
              <thead><tr><th>Category</th><th>Revenue</th><th>Share</th><th>vs Last Period</th></tr></thead>
              <tbody>
                <tr><td>Electronics</td><td>$128,060</td><td>38%</td><td style="color:#22C55E">+14.2%</td></tr>
                <tr><td>Clothing</td><td>$80,880</td><td>24%</td><td style="color:#22C55E">+9.8%</td></tr>
                <tr><td>Home &amp; Living</td><td>$60,660</td><td>18%</td><td style="color:#22C55E">+6.3%</td></tr>
                <tr><td>Sports</td><td>$40,440</td><td>12%</td><td style="color:#EF4444">-3.1%</td></tr>
                <tr><td>Other</td><td>$26,960</td><td>8%</td><td style="color:#22C55E">+2.7%</td></tr>
              </tbody>
            </table>
          </div>
          <div class="section">
            <h2>Recommended Actions</h2>
            <div class="action-box"><div class="title">1. Standardize Pricing</div><div class="desc">Fix West region pricing gap. Estimated impact: +$2,340/month.</div></div>
            <div class="action-box"><div class="title">2. Customer Retention Outreach</div><div class="desc">Contact Meridian Corp with retention offer. Their $45K annual value makes this urgent.</div></div>
            <div class="action-box"><div class="title">3. Optimize Weekly Marketing</div><div class="desc">Shift 30% of Monday ad spend to Saturday to capitalize on the weekend revenue surge.</div></div>
          </div>
          <div class="footer">
            <span>AutolystAI — Agentic AI Analytics Platform</span>
            <span>Page 1 of ${report.pages || 6} &bull; Confidential</span>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 1000);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  }, [report]);

  const handleExportImage = useCallback(async () => {
    setExporting(true);
    try {
      const el = previewRef.current;
      if (!el) return;

      const canvas = document.createElement("canvas");
      const rect = el.getBoundingClientRect();
      const scale = 2;
      canvas.width = rect.width * scale;
      canvas.height = Math.max(rect.height, 400) * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(scale, scale);
      ctx.fillStyle = "#0A0B0F";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#F5A623";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(report.title, 40, 50);

      ctx.fillStyle = "#8A8F9E";
      ctx.font = "14px sans-serif";
      ctx.fillText(
        `${report.type.toUpperCase()} • ${report.dataset} • ${new Date().toLocaleDateString()}`,
        40,
        80
      );

      ctx.strokeStyle = "#F5A623";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, 95);
      ctx.lineTo(rect.width - 40, 95);
      ctx.stroke();

      const kpis = [
        { label: "Revenue", value: "$337K", change: "+12.3%" },
        { label: "Orders", value: "5,412", change: "+8.7%" },
        { label: "Customers", value: "2,847", change: "+15.2%" },
        { label: "AOV", value: "$62.3", change: "-2.1%" },
      ];

      kpis.forEach((kpi, i) => {
        const x = 40 + i * ((rect.width - 80) / 4);
        const y = 130;
        ctx.fillStyle = "#1A1B2E";
        ctx.beginPath();
        ctx.roundRect(x, y, (rect.width - 120) / 4, 70, 8);
        ctx.fill();
        ctx.fillStyle = "#8A8F9E";
        ctx.font = "11px sans-serif";
        ctx.fillText(kpi.label, x + 12, y + 22);
        ctx.fillStyle = "#E8E9ED";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(kpi.value, x + 12, y + 48);
        ctx.fillStyle = kpi.change.startsWith("+") ? "#22C55E" : "#EF4444";
        ctx.font = "12px monospace";
        ctx.fillText(kpi.change, x + 12, y + 64);
      });

      ctx.fillStyle = "#4A4E5C";
      ctx.font = "11px sans-serif";
      ctx.fillText("Generated by AutolystAI", 40, 240);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${report.title.replace(/\s+/g, "_")}_AutolystAI.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error("Image export error:", err);
    } finally {
      setExporting(false);
    }
  }, [report]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-bg-primary border border-border-subtle shadow-2xl z-10 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${typeColors[report.type].bg} flex items-center justify-center`}
            >
              <FileText
                size={18}
                className={typeColors[report.type].text}
              />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-text-primary">
                {report.title}
              </h2>
              <p className="text-[11px] text-text-muted font-body">
                {report.dataset} &bull; {report.pages || 6} pages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {exportSuccess && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-semantic-green font-body flex items-center gap-1"
              >
                <CheckCircle2 size={14} /> Exported!
              </motion.span>
            )}
            <button
              onClick={handleExportImage}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border-default text-xs font-body text-text-secondary hover:border-border-strong transition-colors cursor-pointer disabled:opacity-50"
            >
              <ImageIcon size={13} /> PNG
            </button>
            <Button
              size="sm"
              onClick={handleExportPDF}
              disabled={exporting}
              isLoading={exporting}
            >
              <Download size={13} /> Export PDF
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div ref={previewRef} className="p-6 lg:p-8 space-y-8">
            {/* Title */}
            <div className="border-b-2 border-gold pb-5">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${typeColors[report.type].bg} ${typeColors[report.type].text}`}
                >
                  {report.type.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono text-text-muted">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h1 className="font-heading font-bold text-2xl text-text-primary mb-1">
                {report.title}
              </h1>
              <p className="text-sm text-text-secondary font-body">
                {report.summary}
              </p>
            </div>

            {/* KPIs */}
            <div>
              <h2 className="font-heading font-semibold text-sm text-text-primary mb-3 flex items-center gap-2">
                <Target size={14} className="text-gold" />
                Key Performance Indicators
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {kpiCards.map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={idx}
                      className="glass-card rounded-xl p-4 border border-border-subtle"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon size={16} className="text-text-muted" />
                        <span
                          className={`flex items-center gap-0.5 text-xs font-mono font-semibold ${kpi.direction === "up" ? "text-semantic-green" : "text-semantic-red"}`}
                        >
                          {kpi.direction === "up" ? (
                            <ArrowUpRight size={12} />
                          ) : (
                            <ArrowDownRight size={12} />
                          )}
                          {kpi.change}
                        </span>
                      </div>
                      <p className="text-xl font-heading font-bold text-text-primary">
                        {kpi.value}
                      </p>
                      <p className="text-[10px] text-text-muted font-body mt-0.5">
                        {kpi.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Revenue Chart */}
            <div>
              <h2 className="font-heading font-semibold text-sm text-text-primary mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-cyan" />
                Revenue Trend (Last 6 Months)
              </h2>
              <div
                className="glass-card rounded-xl p-4 border border-border-subtle"
                style={{ height: 260 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueChartData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="reportGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#F5A623"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#F5A623"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-subtle)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-default)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      formatter={(value) => [
                        `$${((value as number) / 1000).toFixed(1)}K`,
                        "Revenue",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#F5A623"
                      strokeWidth={2}
                      fill="url(#reportGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category + Findings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="font-heading font-semibold text-sm text-text-primary mb-3 flex items-center gap-2">
                  <PieChart size={14} className="text-violet" />
                  Revenue by Category
                </h2>
                <div
                  className="glass-card rounded-xl p-4 border border-border-subtle"
                  style={{ height: 220 }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Share"]}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  {categoryData.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-[10px] font-body text-text-muted">
                        {cat.name} ({cat.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-heading font-semibold text-sm text-text-primary mb-3 flex items-center gap-2">
                  <Sparkles size={14} className="text-gold" />
                  Key Findings
                </h2>
                <div className="space-y-2">
                  {[
                    {
                      icon: AlertTriangle,
                      severity: "high" as const,
                      title: "Pricing Anomaly",
                      desc: "West region pricing gap losing $2,340/mo",
                    },
                    {
                      icon: TrendingUp,
                      severity: "medium" as const,
                      title: "Weekend Surge Pattern",
                      desc: "Saturday outperforms Monday by 54%",
                    },
                    {
                      icon: Shield,
                      severity: "high" as const,
                      title: "Churn Risk Detected",
                      desc: "3rd largest customer at risk of leaving",
                    },
                    {
                      icon: Target,
                      severity: "low" as const,
                      title: "Cross-Sell Opportunity",
                      desc: "Product correlation could lift AOV by 15%",
                    },
                  ].map((finding, idx) => {
                    const FindIcon = finding.icon;
                    const colors =
                      finding.severity === "high"
                        ? "border-semantic-red/20 bg-semantic-red/5"
                        : finding.severity === "medium"
                          ? "border-semantic-orange/20 bg-semantic-orange/5"
                          : "border-border-subtle bg-bg-secondary";
                    const iconColor =
                      finding.severity === "high"
                        ? "text-semantic-red"
                        : finding.severity === "medium"
                          ? "text-semantic-orange"
                          : "text-cyan";
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 p-3 rounded-lg border ${colors}`}
                      >
                        <FindIcon
                          size={14}
                          className={`${iconColor} mt-0.5 shrink-0`}
                        />
                        <div>
                          <p className="text-xs font-body font-semibold text-text-primary">
                            {finding.title}
                          </p>
                          <p className="text-[11px] font-body text-text-secondary">
                            {finding.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Table */}
            <div>
              <h2 className="font-heading font-semibold text-sm text-text-primary mb-3 flex items-center gap-2">
                <BarChart3 size={14} className="text-gold" />
                Detailed Performance Breakdown
              </h2>
              <div className="glass-card rounded-xl border border-border-subtle overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="text-left text-[10px] font-body font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                        Category
                      </th>
                      <th className="text-right text-[10px] font-body font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                        Revenue
                      </th>
                      <th className="text-right text-[10px] font-body font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                        Share
                      </th>
                      <th className="text-right text-[10px] font-body font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                        vs Last Period
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        cat: "Electronics",
                        rev: "$128,060",
                        share: "38%",
                        change: "+14.2%",
                        up: true,
                      },
                      {
                        cat: "Clothing",
                        rev: "$80,880",
                        share: "24%",
                        change: "+9.8%",
                        up: true,
                      },
                      {
                        cat: "Home & Living",
                        rev: "$60,660",
                        share: "18%",
                        change: "+6.3%",
                        up: true,
                      },
                      {
                        cat: "Sports",
                        rev: "$40,440",
                        share: "12%",
                        change: "-3.1%",
                        up: false,
                      },
                      {
                        cat: "Other",
                        rev: "$26,960",
                        share: "8%",
                        change: "+2.7%",
                        up: true,
                      },
                    ].map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-border-subtle last:border-b-0 hover:bg-bg-secondary/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-body text-text-primary">
                          {row.cat}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-text-primary text-right">
                          {row.rev}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-text-secondary text-right">
                          {row.share}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm font-mono text-right ${row.up ? "text-semantic-green" : "text-semantic-red"}`}
                        >
                          {row.change}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h2 className="font-heading font-semibold text-sm text-text-primary mb-3 flex items-center gap-2">
                <Zap size={14} className="text-semantic-green" />
                Recommended Actions
              </h2>
              <div className="space-y-2">
                {[
                  {
                    num: 1,
                    title: "Standardize Pricing",
                    desc: "Fix West region pricing gap. Impact: +$2,340/month.",
                    priority: "High",
                  },
                  {
                    num: 2,
                    title: "Customer Retention Outreach",
                    desc: "Contact Meridian Corp — $45K annual value at risk.",
                    priority: "High",
                  },
                  {
                    num: 3,
                    title: "Optimize Weekly Marketing",
                    desc: "Shift Monday ad spend to Saturday for the weekend surge.",
                    priority: "Medium",
                  },
                ].map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-lg bg-semantic-green/5 border border-semantic-green/15"
                  >
                    <span className="w-6 h-6 rounded-full bg-semantic-green/10 flex items-center justify-center shrink-0 text-xs font-mono font-bold text-semantic-green">
                      {action.num}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-body font-semibold text-text-primary">
                          {action.title}
                        </p>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${action.priority === "High" ? "bg-semantic-red/10 text-semantic-red" : "bg-semantic-orange/10 text-semantic-orange"}`}
                        >
                          {action.priority}
                        </span>
                      </div>
                      <p className="text-[11px] font-body text-text-secondary mt-0.5">
                        {action.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-subtle text-[10px] text-text-muted font-body">
              <span>Generated by AutolystAI — Agentic AI Analytics Platform</span>
              <span>
                Page 1 of {report.pages || 6} &bull; Confidential
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════ GENERATE MODAL ═══════════════ */

function GenerateReportModal({
  onClose,
  onGenerate,
}: {
  onClose: () => void;
  onGenerate: (r: Report) => void;
}) {
  const [step, setStep] = useState(1);
  const [reportType, setReportType] = useState<string>("");
  const [dataset, setDataset] = useState<string>("");
  const [title, setTitle] = useState("");
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    {
      key: "analysis",
      label: "Analysis Report",
      desc: "Full charts, insights & recommendations",
      icon: FileBarChart2,
      accent: "gold",
    },
    {
      key: "executive",
      label: "Executive Summary",
      desc: "High-level findings for leadership",
      icon: Presentation,
      accent: "cyan",
    },
    {
      key: "prediction",
      label: "Prediction Report",
      desc: "ML model results & predictions",
      icon: Sparkles,
      accent: "violet",
    },
  ];

  const datasets = [
    "E-Commerce Sales",
    "Employee Attrition",
    "Marketing Campaign",
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now().toString(),
        title:
          title ||
          `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report — ${new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}`,
        type: reportType as Report["type"],
        status: "ready",
        format: "pdf",
        date: "Just now",
        pages:
          reportType === "executive"
            ? 6
            : reportType === "prediction"
              ? 8
              : 12,
        dataset,
        summary: `AI-generated ${reportType} report based on ${dataset} dataset analysis.`,
      };
      onGenerate(newReport);
      setGenerating(false);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-lg rounded-2xl bg-bg-primary border border-border-subtle shadow-2xl z-10"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div>
            <h2 className="font-heading font-bold text-base text-text-primary">
              Generate Report
            </h2>
            <p className="text-[11px] text-text-muted font-body">
              Step {step} of 3
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-all ${s <= step ? "bg-gold" : "bg-bg-elevated"}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          {step === 1 && (
            <div>
              <p className="text-sm font-body text-text-secondary mb-4">
                What type of report would you like?
              </p>
              <div className="space-y-2">
                {reportTypes.map((rt) => {
                  const Icon = rt.icon;
                  const selected = reportType === rt.key;
                  const accentCls =
                    rt.accent === "gold"
                      ? "border-gold bg-gold/5"
                      : rt.accent === "cyan"
                        ? "border-cyan bg-cyan/5"
                        : "border-violet bg-violet/5";
                  const iconCls =
                    rt.accent === "gold"
                      ? "text-gold"
                      : rt.accent === "cyan"
                        ? "text-cyan"
                        : "text-violet";
                  return (
                    <button
                      key={rt.key}
                      onClick={() => setReportType(rt.key)}
                      className={`w-full flex items-center gap-3 rounded-xl p-4 border transition-all cursor-pointer text-left ${selected ? accentCls : "border-border-subtle hover:border-border-strong"}`}
                    >
                      <Icon
                        size={20}
                        className={selected ? iconCls : "text-text-muted"}
                      />
                      <div>
                        <p className="text-sm font-body font-medium text-text-primary">
                          {rt.label}
                        </p>
                        <p className="text-[11px] text-text-muted font-body">
                          {rt.desc}
                        </p>
                      </div>
                      {selected && (
                        <CheckCircle2
                          size={16}
                          className={`ml-auto ${iconCls}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  size="sm"
                  disabled={!reportType}
                  onClick={() => setStep(2)}
                >
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm font-body text-text-secondary mb-4">
                Select the dataset for this report:
              </p>
              <div className="space-y-2">
                {datasets.map((ds) => (
                  <button
                    key={ds}
                    onClick={() => setDataset(ds)}
                    className={`w-full flex items-center gap-3 rounded-xl p-4 border transition-all cursor-pointer text-left ${dataset === ds ? "border-gold bg-gold/5" : "border-border-subtle hover:border-border-strong"}`}
                  >
                    <FileSpreadsheet
                      size={18}
                      className={
                        dataset === ds ? "text-gold" : "text-text-muted"
                      }
                    />
                    <span className="text-sm font-body text-text-primary">
                      {ds}
                    </span>
                    {dataset === ds && (
                      <CheckCircle2
                        size={16}
                        className="ml-auto text-gold"
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  disabled={!dataset}
                  onClick={() => setStep(3)}
                >
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm font-body text-text-secondary mb-4">
                Give your report a title (optional):
              </p>
              <input
                type="text"
                placeholder={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report — ${new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors mb-4"
              />

              <div className="rounded-xl bg-bg-secondary border border-border-subtle p-4 mb-4">
                <p className="text-[10px] font-body text-text-muted uppercase tracking-wider mb-2">
                  Report Summary
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary font-body">
                      Type
                    </span>
                    <span className="text-xs font-body font-medium text-text-primary capitalize">
                      {reportType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary font-body">
                      Dataset
                    </span>
                    <span className="text-xs font-body font-medium text-text-primary">
                      {dataset}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary font-body">
                      Format
                    </span>
                    <span className="text-xs font-body font-medium text-text-primary">
                      PDF
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  onClick={handleGenerate}
                  isLoading={generating}
                >
                  <Sparkles size={14} /> Generate Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════ MAIN PAGE ═══════════════ */

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allReports, setAllReports] = useState<Report[]>(reports);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = allReports
    .filter((r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((r) => filterType === "all" || r.type === filterType);

  const handleNewReport = (report: Report) => {
    setAllReports((prev) => [report, ...prev]);
    setShowGenerate(false);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text-primary">
            Reports
          </h1>
          <p className="text-sm text-text-secondary font-body mt-0.5">
            AI-generated reports from your analyses. Preview, export as PDF
            or PNG.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowGenerate(true)}>
          <Plus size={14} /> Generate Report
        </Button>
      </div>

      {/* Quick Generate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {[
          {
            title: "Analysis Report",
            desc: "Charts, insights & recommendations",
            icon: FileBarChart2,
            accent: "gold",
          },
          {
            title: "Executive Summary",
            desc: "Key findings for leadership",
            icon: Presentation,
            accent: "cyan",
          },
          {
            title: "Prediction Report",
            desc: "Model performance & predictions",
            icon: Sparkles,
            accent: "violet",
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          const borderCls =
            card.accent === "gold"
              ? "hover:border-border-gold"
              : card.accent === "cyan"
                ? "hover:border-border-cyan"
                : "hover:border-violet/20";
          const iconCls =
            card.accent === "gold"
              ? "text-gold"
              : card.accent === "cyan"
                ? "text-cyan"
                : "text-violet";
          return (
            <button
              key={idx}
              onClick={() => setShowGenerate(true)}
              className={`glass-card rounded-xl p-5 text-left transition-all cursor-pointer border border-border-subtle ${borderCls} group`}
            >
              <Icon size={22} className={iconCls + " mb-3"} />
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-1">
                {card.title}
              </h3>
              <p className="text-[11px] text-text-muted font-body">
                {card.desc}
              </p>
              <div className="flex items-center gap-1 mt-3 text-[10px] text-text-muted font-body group-hover:text-text-secondary transition-colors">
                <ArrowRight size={10} /> Click to generate
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 h-9 px-3 rounded-xl bg-bg-secondary border border-border-default w-full sm:w-auto">
          <Search size={15} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search reports…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1">
          {["all", "analysis", "executive", "prediction", "custom"].map(
            (t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-body capitalize transition-all cursor-pointer ${
                  filterType === t
                    ? "bg-gold/10 text-gold font-medium"
                    : "text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>
      </div>

      {/* Reports List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_100px_100px_120px_120px] gap-4 px-5 py-3 border-b border-border-subtle">
          <span className="text-xs font-body font-medium text-text-muted">
            Report
          </span>
          <span className="text-xs font-body font-medium text-text-muted">
            Type
          </span>
          <span className="text-xs font-body font-medium text-text-muted">
            Format
          </span>
          <span className="text-xs font-body font-medium text-text-muted">
            Status
          </span>
          <span className="text-xs font-body font-medium text-text-muted text-right">
            Actions
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={32} className="mx-auto text-text-muted mb-3" />
            <p className="text-sm text-text-muted font-body">
              No reports found
            </p>
          </div>
        ) : (
          filtered.map((report, idx) => {
            const FormatIcon = formatIcons[report.format] || FileText;
            const typeColor = typeColors[report.type];
            const statusInfo = statusConfig[report.status];
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px_120px_120px] gap-2 sm:gap-4 px-5 py-4 border-b border-border-subtle last:border-b-0 hover:bg-bg-secondary/50 transition-colors items-center"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                    <FormatIcon size={16} className="text-text-muted" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-body font-medium text-text-primary truncate">
                      {report.title}
                    </p>
                    <p className="text-[11px] text-text-muted font-body flex items-center gap-1.5">
                      <Clock size={10} /> {report.date}
                      {report.pages && (
                        <span>&bull; {report.pages} pages</span>
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold capitalize ${typeColor.bg} ${typeColor.text}`}
                  >
                    {report.type}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono text-text-secondary uppercase">
                    {report.format}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <StatusIcon
                    size={14}
                    className={`${statusInfo.color} ${report.status === "generating" ? "animate-spin" : ""}`}
                  />
                  <span
                    className={`text-xs font-body ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                <div className="flex items-center gap-1 justify-end">
                  {report.status === "ready" && (
                    <>
                      <button
                        onClick={() => setPreviewReport(report)}
                        className="p-1.5 rounded-md hover:bg-bg-elevated text-text-muted hover:text-gold transition-colors cursor-pointer"
                        title="Preview & Export"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setPreviewReport(report)}
                        className="p-1.5 rounded-md hover:bg-bg-elevated text-text-muted hover:text-semantic-green transition-colors cursor-pointer"
                        title="Download PDF"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        className="p-1.5 rounded-md hover:bg-bg-elevated text-text-muted hover:text-cyan transition-colors cursor-pointer"
                        title="Share"
                      >
                        <Share2 size={14} />
                      </button>
                      <button
                        className="p-1.5 rounded-md hover:bg-bg-elevated text-text-muted hover:text-semantic-red transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {previewReport && (
          <ReportPreview
            report={previewReport}
            onClose={() => setPreviewReport(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showGenerate && (
          <GenerateReportModal
            onClose={() => setShowGenerate(false)}
            onGenerate={handleNewReport}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
