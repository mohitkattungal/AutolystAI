"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import DatasetInterviewPanel from "@/components/dashboard/dataset-interview";
import {
  Upload,
  FileSpreadsheet,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  X,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  Database,
  Bot,
  Zap,
  Target,
  Shield,
  FileText,
  RotateCcw,
} from "lucide-react";

/* ─── Processing States ─── */
type ProcessingStage = "idle" | "reading" | "cleaning" | "scanning" | "goals" | "done";

const stageLabels: Record<ProcessingStage, string> = {
  idle: "",
  reading: "Reading file…",
  cleaning: "Cleaning & formatting…",
  scanning: "Scanning structure & content…",
  goals: "AI generating analysis goals…",
  done: "Ready to analyze!",
};

const stageProgress: Record<ProcessingStage, number> = {
  idle: 0,
  reading: 20,
  cleaning: 45,
  scanning: 70,
  goals: 90,
  done: 100,
};

/* ─── Sample Datasets ─── */
const sampleDatasets = [
  {
    title: "E-Commerce Sales",
    desc: "12 months of order data with 5,400 rows",
    icon: ShoppingCart,
    color: "gold",
    rows: "5.4K",
    cols: "14",
  },
  {
    title: "Employee Attrition",
    desc: "HR analytics dataset with 1,470 records",
    icon: Users,
    color: "cyan",
    rows: "1.5K",
    cols: "35",
  },
  {
    title: "Marketing Campaign",
    desc: "Multi-channel campaign performance data",
    icon: TrendingUp,
    color: "violet",
    rows: "2.2K",
    cols: "18",
  },
];

/* ─── Suggested Goals (shown after processing) ─── */
const suggestedGoals = [
  { label: "Identify top-performing segments", icon: Target },
  { label: "Find churn risk factors", icon: Shield },
  { label: "Revenue trend analysis", icon: TrendingUp },
  { label: "Generate executive summary", icon: FileText },
];

/* ─── Recent Analysis cards ─── */
const recentAnalyses = [
  {
    title: "Q4 Sales Dashboard",
    type: "Analysis",
    date: "2 hours ago",
    status: "completed",
  },
  {
    title: "Customer Segmentation",
    type: "AI Agent",
    date: "Yesterday",
    status: "completed",
  },
  {
    title: "Churn Prediction Model",
    type: "Prediction",
    date: "3 days ago",
    status: "completed",
  },
];

export default function DashboardPage() {
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [showGoals, setShowGoals] = useState(false);
  const [showInterview, setShowInterview] = useState(false);

  const simulateProcessing = useCallback((fileName: string) => {
    setUploadedFile(fileName);
    const stages: ProcessingStage[] = ["reading", "cleaning", "scanning", "goals", "done"];
    const delays = [800, 1200, 1000, 1500, 0];
    let i = 0;
    const tick = () => {
      setProcessingStage(stages[i]);
      if (i < stages.length - 1) {
        i++;
        setTimeout(tick, delays[i - 1]);
      } else {
        setTimeout(() => {
          setShowGoals(true);
          // Auto transition to interview after a brief pause
          setTimeout(() => setShowInterview(true), 1200);
        }, 600);
      }
    };
    tick();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) simulateProcessing(file.name);
    },
    [simulateProcessing]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) simulateProcessing(file.name);
    },
    [simulateProcessing]
  );

  const handleLoadSample = useCallback(
    (name: string) => {
      simulateProcessing(`${name}.csv`);
    },
    [simulateProcessing]
  );

  const resetUpload = () => {
    setProcessingStage("idle");
    setUploadedFile(null);
    setShowGoals(false);
    setShowInterview(false);
  };

  const isProcessing = processingStage !== "idle" && processingStage !== "done";

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl lg:text-3xl text-text-primary">
          Welcome back 👋
        </h1>
        <p className="text-sm text-text-secondary font-body mt-1">
          Upload a dataset or pick a sample to start analyzing with AI.
        </p>
      </div>

      {/* ─── UPLOAD ZONE ─── */}
      <div className="mb-8">
        <AnimatePresence mode="wait">
          {processingStage === "idle" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center transition-all ${
                  dragOver
                    ? "border-gold bg-[var(--gold-subtle)] scale-[1.01]"
                    : "border-border-default hover:border-border-strong"
                }`}
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gold/10 flex items-center justify-center mb-4">
                  <Upload size={28} className="text-gold" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">
                  Drop your file here
                </h3>
                <p className="text-sm text-text-secondary font-body mb-5">
                  CSV, Excel (.xlsx), or JSON — up to 50MB
                </p>
                <label>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileInput}
                  />
                  <span className="inline-flex items-center justify-center h-10 px-5 text-sm font-body font-medium rounded-3xl bg-gold text-text-inverse hover:bg-gold-bright hover:shadow-gold cursor-pointer transition-all">
                    Browse Files
                  </span>
                </label>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="glass-card rounded-2xl p-6 lg:p-8"
            >
              {/* File Info + Reset */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <FileSpreadsheet size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-body font-medium text-text-primary">{uploadedFile}</p>
                    <p className="text-xs text-text-muted font-body">{stageLabels[processingStage]}</p>
                  </div>
                </div>
                {processingStage === "done" ? (
                  <button
                    onClick={resetUpload}
                    className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} /> Upload another
                  </button>
                ) : (
                  <button
                    onClick={resetUpload}
                    className="p-1.5 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 rounded-full bg-bg-secondary overflow-hidden mb-6">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${processingStage === "done" ? "bg-semantic-green" : "bg-gold"}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${stageProgress[processingStage]}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              {/* Stage Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {(["reading", "cleaning", "scanning", "goals"] as ProcessingStage[]).map(
                  (stage) => {
                    const stageIdx = ["reading", "cleaning", "scanning", "goals"].indexOf(stage);
                    const currentIdx = ["reading", "cleaning", "scanning", "goals", "done"].indexOf(
                      processingStage
                    );
                    const completed = currentIdx > stageIdx;
                    const active = processingStage === stage;
                    return (
                      <div
                        key={stage}
                        className={`flex items-center gap-2 rounded-lg p-2.5 border transition-all ${
                          active
                            ? "border-gold/30 bg-gold/5"
                            : completed
                            ? "border-semantic-green/20 bg-semantic-green/5"
                            : "border-border-subtle bg-bg-secondary"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 size={16} className="text-semantic-green shrink-0" />
                        ) : active ? (
                          <Loader2 size={16} className="text-gold animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-border-default shrink-0" />
                        )}
                        <span
                          className={`text-xs font-body capitalize ${
                            active ? "text-gold font-medium" : completed ? "text-semantic-green" : "text-text-muted"
                          }`}
                        >
                          {stage === "goals" ? "AI Goals" : stage}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>

              {/* AI Goal Suggester */}
              <AnimatePresence>
                {showGoals && !showInterview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-border-cyan rounded-xl p-5 bg-cyan/5">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-cyan" />
                        <h4 className="font-heading font-semibold text-sm text-text-primary">
                          AI-Suggested Analysis Goals
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {suggestedGoals.map((goal, idx) => {
                          const Icon = goal.icon;
                          return (
                            <button
                              key={idx}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-bg-secondary border border-border-default hover:border-cyan/30 hover:bg-cyan/5 transition-all cursor-pointer text-left group"
                            >
                              <Icon size={16} className="text-cyan shrink-0" />
                              <span className="text-xs font-body text-text-secondary group-hover:text-text-primary transition-colors">
                                {goal.label}
                              </span>
                              <ArrowRight size={12} className="ml-auto text-text-muted group-hover:text-cyan transition-colors" />
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border-subtle">
                        <p className="text-[11px] text-text-muted font-body flex items-center gap-1.5">
                          <Loader2 size={12} className="animate-spin text-gold" />
                          Starting AI interview in a moment…
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── INTERACTIVE AI INTERVIEW ─── */}
      <AnimatePresence>
        {showInterview && uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8 overflow-hidden"
          >
            <div className="glass-card rounded-2xl p-5 lg:p-6 border border-border-gold/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Bot size={16} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-text-primary">
                      AI Data Assistant
                    </h3>
                    <p className="text-[11px] font-body text-text-muted">
                      Let&apos;s explore your dataset together
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetUpload}
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} /> Start over
                </button>
              </div>
              <DatasetInterviewPanel fileName={uploadedFile} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── SAMPLE DATASETS ─── */}
      {processingStage === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="font-heading font-semibold text-base text-text-primary mb-4">
            Or start with a sample dataset
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sampleDatasets.map((ds, idx) => {
              const Icon = ds.icon;
              const colorClass =
                ds.color === "gold"
                  ? "border-border-gold bg-gold/5 hover:bg-gold/10"
                  : ds.color === "cyan"
                  ? "border-border-cyan bg-cyan/5 hover:bg-cyan/10"
                  : "border-violet/20 bg-violet/5 hover:bg-violet/10";
              const textColor =
                ds.color === "gold" ? "text-gold" : ds.color === "cyan" ? "text-cyan" : "text-violet";
              return (
                <button
                  key={idx}
                  onClick={() => handleLoadSample(ds.title)}
                  className={`rounded-xl border p-5 text-left transition-all cursor-pointer ${colorClass}`}
                >
                  <Icon size={24} className={textColor + " mb-3"} />
                  <h3 className="font-heading font-semibold text-sm text-text-primary mb-1">
                    {ds.title}
                  </h3>
                  <p className="text-xs text-text-muted font-body mb-3">{ds.desc}</p>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-text-muted">
                    <span>{ds.rows} rows</span>
                    <span className="w-px h-3 bg-border-default" />
                    <span>{ds.cols} cols</span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ─── QUICK ACTIONS ROW ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { icon: Bot, label: "Ask AI Agent", desc: "Natural language queries", accent: "cyan" },
          { icon: BarChart3, label: "New Analysis", desc: "Charts & insights", accent: "gold" },
          { icon: Zap, label: "Quick Predict", desc: "AutoML in minutes", accent: "violet" },
          { icon: Database, label: "Manage Data", desc: "Datasets & uploads", accent: "green" },
        ].map((action, idx) => {
          const Icon = action.icon;
          const borderCls =
            action.accent === "cyan"
              ? "hover:border-border-cyan"
              : action.accent === "gold"
              ? "hover:border-border-gold"
              : action.accent === "violet"
              ? "hover:border-violet/20"
              : "hover:border-semantic-green/20";
          const iconCls =
            action.accent === "cyan"
              ? "text-cyan"
              : action.accent === "gold"
              ? "text-gold"
              : action.accent === "violet"
              ? "text-violet"
              : "text-semantic-green";
          return (
            <button
              key={idx}
              className={`glass-card rounded-xl p-4 text-left transition-all cursor-pointer border border-border-subtle ${borderCls}`}
            >
              <Icon size={20} className={iconCls + " mb-2"} />
              <h4 className="font-heading font-semibold text-sm text-text-primary mb-0.5">
                {action.label}
              </h4>
              <p className="text-[11px] text-text-muted font-body">{action.desc}</p>
            </button>
          );
        })}
      </div>

      {/* ─── RECENT ANALYSES ─── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-base text-text-primary">
            Recent Activity
          </h2>
          <button className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary font-body cursor-pointer transition-colors">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentAnalyses.map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl p-4 hover:border-border-strong transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan/10 text-cyan">
                  {item.type}
                </span>
                <CheckCircle2 size={14} className="text-semantic-green" />
              </div>
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-1 group-hover:text-gold transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-body">
                <Clock size={12} />
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
