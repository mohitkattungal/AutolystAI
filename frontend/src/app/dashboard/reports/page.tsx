"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  Filter,
  Search,
  MoreVertical,
  FileBarChart2,
  FileSpreadsheet,
  Presentation,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Types ─── */
interface Report {
  id: string;
  title: string;
  type: "analysis" | "prediction" | "executive" | "custom";
  status: "ready" | "generating" | "scheduled";
  format: "pdf" | "xlsx" | "pptx";
  date: string;
  pages?: number;
  dataset: string;
}

/* ─── Mock Reports ─── */
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
  },
  {
    id: "3",
    title: "Executive Summary — Dec 2024",
    type: "executive",
    status: "ready",
    format: "pptx",
    date: "3 days ago",
    pages: 6,
    dataset: "E-Commerce Sales",
  },
  {
    id: "4",
    title: "Marketing Campaign ROI",
    type: "analysis",
    status: "generating",
    format: "pdf",
    date: "Just now",
    dataset: "Marketing Campaign",
  },
  {
    id: "5",
    title: "Monthly KPI Dashboard",
    type: "custom",
    status: "scheduled",
    format: "xlsx",
    date: "Scheduled: Jan 1",
    dataset: "E-Commerce Sales",
  },
];

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

const statusConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  ready: { icon: CheckCircle2, label: "Ready", color: "text-semantic-green" },
  generating: { icon: Loader2, label: "Generating…", color: "text-gold" },
  scheduled: { icon: Clock, label: "Scheduled", color: "text-cyan" },
};

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = reports.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text-primary">Reports</h1>
          <p className="text-sm text-text-secondary font-body mt-0.5">
            AI-generated reports from your analyses and predictions.
          </p>
        </div>
        <Button size="sm">
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
              className={`glass-card rounded-xl p-5 text-left transition-all cursor-pointer border border-border-subtle ${borderCls}`}
            >
              <Icon size={22} className={iconCls + " mb-3"} />
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-1">
                {card.title}
              </h3>
              <p className="text-[11px] text-text-muted font-body">{card.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 h-9 px-3 rounded-xl bg-bg-secondary border border-border-default">
          <Search size={15} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search reports…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border-default text-xs font-body text-text-secondary hover:border-border-strong transition-colors cursor-pointer">
          <Filter size={13} /> Filter
        </button>
      </div>

      {/* Reports List */}
      <div className="glass-card rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[1fr_100px_100px_120px_80px] gap-4 px-5 py-3 border-b border-border-subtle">
          <span className="text-xs font-body font-medium text-text-muted">Report</span>
          <span className="text-xs font-body font-medium text-text-muted">Type</span>
          <span className="text-xs font-body font-medium text-text-muted">Format</span>
          <span className="text-xs font-body font-medium text-text-muted">Status</span>
          <span className="text-xs font-body font-medium text-text-muted text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={32} className="mx-auto text-text-muted mb-3" />
            <p className="text-sm text-text-muted font-body">No reports found</p>
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
                className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px_120px_80px] gap-2 sm:gap-4 px-5 py-4 border-b border-border-subtle last:border-b-0 hover:bg-bg-secondary/50 transition-colors items-center"
              >
                {/* Title */}
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
                      {report.pages && <span>• {report.pages} pages</span>}
                    </p>
                  </div>
                </div>

                {/* Type */}
                <div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold capitalize ${typeColor.bg} ${typeColor.text}`}
                  >
                    {report.type}
                  </span>
                </div>

                {/* Format */}
                <div>
                  <span className="text-xs font-mono text-text-secondary uppercase">{report.format}</span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <StatusIcon
                    size={14}
                    className={`${statusInfo.color} ${report.status === "generating" ? "animate-spin" : ""}`}
                  />
                  <span className={`text-xs font-body ${statusInfo.color}`}>{statusInfo.label}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 justify-end">
                  {report.status === "ready" && (
                    <>
                      <button className="p-1.5 rounded-md hover:bg-bg-elevated text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-bg-elevated text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                        <Download size={14} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-bg-elevated text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                        <Share2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
