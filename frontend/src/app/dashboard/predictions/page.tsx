"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Target,
  Zap,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Settings2,
  Download,
  Play,
  RefreshCcw,
  ChevronDown,
  ArrowRight,
  Info,
  Sparkles,
  Shield,
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
  ScatterChart,
  Scatter,
  ZAxis,
  LineChart,
  Line,
  Cell,
} from "recharts";

/* ─── Types ─── */
type ModelStatus = "idle" | "training" | "complete";

/* ─── Mock data ─── */
const featureImportance = [
  { feature: "Tenure (months)", importance: 0.32 },
  { feature: "Monthly Charges", importance: 0.24 },
  { feature: "Contract Type", importance: 0.18 },
  { feature: "Support Tickets", importance: 0.12 },
  { feature: "Payment Method", importance: 0.08 },
  { feature: "Internet Service", importance: 0.06 },
];

const confusionData = [
  { predicted: "Stayed", actual: "Stayed", count: 1245 },
  { predicted: "Churned", actual: "Stayed", count: 82 },
  { predicted: "Stayed", actual: "Churned", count: 63 },
  { predicted: "Churned", actual: "Churned", count: 310 },
];

const predictionScatter = Array.from({ length: 60 }, (_, i) => ({
  tenure: Math.floor(Math.random() * 72) + 1,
  charges: Math.floor(Math.random() * 100) + 20,
  risk: Math.random(),
}));

const modelMetrics = [
  { label: "Accuracy", value: "92.3%", icon: Target },
  { label: "Precision", value: "89.7%", icon: Shield },
  { label: "Recall", value: "83.1%", icon: RefreshCcw },
  { label: "F1 Score", value: "86.3%", icon: Zap },
];

const trainProgressSteps = [
  "Data validation & splitting",
  "Feature engineering",
  "Model selection (XGBoost, Random Forest, LightGBM)",
  "Hyperparameter optimization",
  "Cross-validation & evaluation",
];

export default function PredictionsPage() {
  const [status, setStatus] = useState<ModelStatus>("idle");
  const [trainingStep, setTrainingStep] = useState(0);
  const [targetColumn, setTargetColumn] = useState("Churn");

  const startTraining = () => {
    setStatus("training");
    setTrainingStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setTrainingStep(step);
      if (step >= trainProgressSteps.length) {
        clearInterval(interval);
        setTimeout(() => setStatus("complete"), 800);
      }
    }, 1200);
  };

  const resetModel = () => {
    setStatus("idle");
    setTrainingStep(0);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Brain size={22} className="text-violet" />
          <h1 className="font-heading font-bold text-2xl text-text-primary">AutoML Predictions</h1>
        </div>
        <p className="text-sm text-text-secondary font-body">
          Build machine learning models automatically. Select a target and let AI handle the rest.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ─── IDLE: Setup ─── */}
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="glass-card rounded-xl p-6 mb-6">
              <h3 className="font-heading font-semibold text-base text-text-primary mb-4">
                Configure Your Model
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">
                    Dataset
                  </label>
                  <button className="w-full flex items-center justify-between h-11 px-4 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary hover:border-border-strong transition-colors cursor-pointer">
                    <span>Employee Attrition (1,470 rows)</span>
                    <ChevronDown size={16} className="text-text-muted" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">
                    Target Column (what to predict)
                  </label>
                  <button className="w-full flex items-center justify-between h-11 px-4 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary hover:border-border-strong transition-colors cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Target size={14} className="text-violet" />
                      {targetColumn}
                    </span>
                    <ChevronDown size={16} className="text-text-muted" />
                  </button>
                </div>
              </div>

              {/* Task Type Detection */}
              <div className="rounded-xl bg-violet/5 border border-violet/20 p-4 mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-violet" />
                  <span className="text-xs font-body font-semibold text-violet">Auto-detected</span>
                </div>
                <p className="text-sm font-body text-text-secondary">
                  Task type: <strong className="text-text-primary">Binary Classification</strong> — predicting "Yes" or "No" for the Churn column. The AI will select the best algorithm automatically.
                </p>
              </div>

              {/* Columns preview */}
              <div className="mb-6">
                <h4 className="text-xs font-body font-medium text-text-secondary mb-2">Feature Columns (auto-selected)</h4>
                <div className="flex flex-wrap gap-2">
                  {["Age", "Tenure", "MonthlyCharges", "TotalCharges", "Contract", "PaymentMethod", "InternetService", "SupportTickets", "TechSupport", "OnlineSecurity"].map((col) => (
                    <span
                      key={col}
                      className="px-2.5 py-1 rounded-lg bg-bg-secondary border border-border-default text-xs font-mono text-text-secondary"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              <Button onClick={startTraining} size="lg">
                <Play size={16} /> Train Model
              </Button>
            </div>
          </motion.div>
        )}

        {/* ─── TRAINING ─── */}
        {status === "training" && (
          <motion.div
            key="training"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center">
                <Loader2 size={20} className="text-violet animate-spin" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-base text-text-primary">
                  Training in Progress
                </h3>
                <p className="text-xs text-text-muted font-body">
                  AutoML is building and evaluating models…
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-3">
              {trainProgressSteps.map((step, idx) => {
                const isDone = idx < trainingStep;
                const isActive = idx === trainingStep;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-semantic-green shrink-0" />
                    ) : isActive ? (
                      <Loader2 size={18} className="text-violet animate-spin shrink-0" />
                    ) : (
                      <div className="w-[18px] h-[18px] rounded-full border border-border-default shrink-0" />
                    )}
                    <span
                      className={`text-sm font-body ${
                        isDone
                          ? "text-semantic-green"
                          : isActive
                          ? "text-violet font-medium"
                          : "text-text-muted"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-6 h-2 rounded-full bg-bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-violet"
                animate={{ width: `${(trainingStep / trainProgressSteps.length) * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </motion.div>
        )}

        {/* ─── COMPLETE: Results ─── */}
        {status === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {/* Success Banner */}
            <div className="rounded-xl bg-semantic-green/5 border border-semantic-green/20 p-4 mb-6 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-semantic-green shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-body text-text-primary font-medium">
                  Model trained successfully!
                </p>
                <p className="text-xs text-text-muted font-body mt-0.5">
                  Best model: <strong className="text-text-secondary">XGBoost</strong> — selected from 3 candidates after 5-fold cross-validation.
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={resetModel}>
                  <RefreshCcw size={13} /> Retrain
                </Button>
                <Button variant="secondary" size="sm">
                  <Download size={13} /> Export
                </Button>
              </div>
            </div>

            {/* Model Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {modelMetrics.map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className="glass-card rounded-xl p-4 text-center">
                    <Icon size={18} className="text-violet mx-auto mb-2" />
                    <p className="font-heading font-bold text-xl text-text-primary">{m.value}</p>
                    <p className="text-xs text-text-muted font-body mt-0.5">{m.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Feature Importance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-heading font-semibold text-sm text-text-primary mb-4">
                  Feature Importance
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={featureImportance}
                    layout="vertical"
                    margin={{ top: 5, right: 15, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 0.4]}
                    />
                    <YAxis
                      type="category"
                      dataKey="feature"
                      tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Bar dataKey="importance" radius={[0, 6, 6, 0]} name="Importance">
                      {featureImportance.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#8B5CF6" : i < 3 ? "#00D4FF" : "#F5A623"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Prediction Scatter */}
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-heading font-semibold text-sm text-text-primary mb-4">
                  Risk Score Distribution
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <ScatterChart margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis
                      dataKey="tenure"
                      name="Tenure"
                      tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                      axisLine={false}
                      tickLine={false}
                      label={{ value: "Tenure (months)", position: "bottom", fontSize: 10, fill: "var(--text-muted)", offset: -5 }}
                    />
                    <YAxis
                      dataKey="charges"
                      name="Monthly Charges"
                      tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                      axisLine={false}
                      tickLine={false}
                      label={{ value: "Charges ($)", angle: -90, position: "left", fontSize: 10, fill: "var(--text-muted)" }}
                    />
                    <ZAxis dataKey="risk" range={[20, 200]} name="Risk" />
                    <Tooltip />
                    <Scatter data={predictionScatter} fill="#8B5CF6" fillOpacity={0.6} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Make Predictions */}
            <div className="glass-card rounded-xl p-5 border-t-2 border-t-violet">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={18} className="text-violet" />
                <h3 className="font-heading font-semibold text-sm text-text-primary">
                  Make Predictions
                </h3>
              </div>
              <p className="text-sm text-text-secondary font-body mb-4">
                Upload new data or ask the AI Agent to run predictions: "Which customers are likely to churn next month?"
              </p>
              <div className="flex items-center gap-3">
                <Button size="sm">
                  <Zap size={14} /> Predict Now
                </Button>
                <Button variant="secondary" size="sm">
                  Ask AI Agent <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
