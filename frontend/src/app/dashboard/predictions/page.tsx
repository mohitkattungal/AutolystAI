"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Target,
  Zap,
  CheckCircle2,
  Loader2,
  BarChart3,
  TrendingUp,
  Download,
  Play,
  RefreshCcw,
  ChevronDown,
  ArrowRight,
  Info,
  Sparkles,
  Shield,
  Database,
  Columns3,
  X,
  HelpCircle,
  FlaskConical,
  Eye,
  Shuffle,
  Check,
  Upload,
  Lightbulb,
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
  Cell,
} from "recharts";

/* ─── Types ─── */
type ModelStatus = "idle" | "training" | "complete";
type TaskType = "Binary Classification" | "Multi-class Classification" | "Regression";

interface DatasetDef {
  id: string;
  name: string;
  rows: number;
  cols: string[];
  targets: { col: string; type: TaskType; description: string }[];
}

/* ─── Datasets ─── */
const DATASETS: DatasetDef[] = [
  {
    id: "telecom",
    name: "Telecom Churn",
    rows: 7043,
    cols: ["Tenure", "MonthlyCharges", "TotalCharges", "Contract", "PaymentMethod", "InternetService", "SupportTickets", "TechSupport", "OnlineSecurity", "StreamingTV"],
    targets: [
      { col: "Churn", type: "Binary Classification", description: "Will the customer leave? (Yes / No)" },
      { col: "MonthlyCharges", type: "Regression", description: "Predict the customer's monthly spend ($)" },
    ],
  },
  {
    id: "employee",
    name: "Employee Attrition",
    rows: 1470,
    cols: ["Age", "DistanceFromHome", "MonthlyIncome", "YearsAtCompany", "JobSatisfaction", "OverTime", "Department", "EducationField", "WorkLifeBalance", "PerformanceRating"],
    targets: [
      { col: "Attrition", type: "Binary Classification", description: "Will the employee quit? (Yes / No)" },
      { col: "MonthlyIncome", type: "Regression", description: "Predict the employee's monthly salary" },
      { col: "PerformanceRating", type: "Multi-class Classification", description: "Predict performance tier (1-4)" },
    ],
  },
  {
    id: "ecommerce",
    name: "E-commerce Orders",
    rows: 12430,
    cols: ["CustomerAge", "OrderValue", "ItemCount", "ShippingDays", "DiscountApplied", "Category", "PaymentType", "Region", "ReturnHistory", "LoyaltyTier"],
    targets: [
      { col: "WillReturn", type: "Binary Classification", description: "Will the customer return the order? (Yes / No)" },
      { col: "OrderValue", type: "Regression", description: "Predict the total order value ($)" },
      { col: "LoyaltyTier", type: "Multi-class Classification", description: "Predict loyalty segment (Bronze / Silver / Gold / Platinum)" },
    ],
  },
  {
    id: "health",
    name: "Patient Readmission",
    rows: 8920,
    cols: ["Age", "BMI", "BloodPressure", "Glucose", "LengthOfStay", "NumMedications", "PriorVisits", "InsuranceType", "Diagnosis", "DischargeDisposition"],
    targets: [
      { col: "Readmitted", type: "Binary Classification", description: "Will the patient be readmitted within 30 days? (Yes / No)" },
      { col: "LengthOfStay", type: "Regression", description: "Predict number of days in hospital" },
    ],
  },
];

/* ─── Result generators (seeded by dataset + target for variety) ─── */
function generateFeatureImportance(cols: string[]) {
  const sorted = cols.slice(0, 6).map((feature, i) => ({
    feature,
    importance: +(0.35 - i * 0.05 + Math.random() * 0.02).toFixed(3),
  }));
  sorted.sort((a, b) => b.importance - a.importance);
  return sorted;
}

function generateScatter() {
  return Array.from({ length: 60 }, () => ({
    x: Math.floor(Math.random() * 72) + 1,
    y: Math.floor(Math.random() * 100) + 20,
    risk: Math.random(),
  }));
}

function generateMetrics(type: TaskType) {
  if (type === "Regression") {
    return [
      { label: "R² Score", value: (0.85 + Math.random() * 0.1).toFixed(3), icon: Target },
      { label: "MAE", value: (120 + Math.random() * 80).toFixed(1), icon: TrendingUp },
      { label: "RMSE", value: (180 + Math.random() * 120).toFixed(1), icon: BarChart3 },
      { label: "MAPE", value: (5 + Math.random() * 8).toFixed(1) + "%", icon: Zap },
    ];
  }
  return [
    { label: "Accuracy", value: (88 + Math.random() * 8).toFixed(1) + "%", icon: Target },
    { label: "Precision", value: (85 + Math.random() * 10).toFixed(1) + "%", icon: Shield },
    { label: "Recall", value: (80 + Math.random() * 12).toFixed(1) + "%", icon: RefreshCcw },
    { label: "F1 Score", value: (82 + Math.random() * 10).toFixed(1) + "%", icon: Zap },
  ];
}

function generateConfusion(type: TaskType) {
  if (type === "Binary Classification") {
    return {
      labels: ["Negative", "Positive"],
      matrix: [
        [Math.floor(800 + Math.random() * 500), Math.floor(30 + Math.random() * 60)],
        [Math.floor(40 + Math.random() * 50), Math.floor(200 + Math.random() * 200)],
      ],
    };
  }
  return null;
}

const MODELS_COMPARED = [
  { name: "XGBoost", score: 0 },
  { name: "Random Forest", score: 0 },
  { name: "LightGBM", score: 0 },
];

function pickBestModel() {
  const models = MODELS_COMPARED.map((m) => ({
    ...m,
    score: +(0.82 + Math.random() * 0.12).toFixed(3),
  }));
  models.sort((a, b) => b.score - a.score);
  return models;
}

const trainProgressSteps = [
  { label: "Data validation & cleaning", detail: "Checking for nulls, duplicates, type consistency" },
  { label: "Train / Test split (80-20)", detail: "Stratified split preserving class ratios" },
  { label: "Automated feature engineering", detail: "Encoding, scaling, interaction features" },
  { label: "Model training (XGBoost, RF, LightGBM)", detail: "Training 3 algorithms with default configs" },
  { label: "Hyperparameter optimization", detail: "Bayesian search over 50 configurations" },
  { label: "5-fold cross-validation", detail: "Estimating generalization performance" },
];

/* ─── Dropdown component ─── */
function Dropdown<T extends { label: string; sublabel?: string }>({
  items,
  selected,
  onSelect,
  icon,
  placeholder,
}: {
  items: T[];
  selected: T | null;
  onSelect: (item: T) => void;
  icon?: React.ReactNode;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between h-11 px-4 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary hover:border-violet/40 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
          {icon}
          {selected ? selected.label : placeholder ?? "Select…"}
        </span>
        <ChevronDown size={16} className={`text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full rounded-xl bg-bg-elevated border border-border-default shadow-xl overflow-hidden"
          >
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors cursor-pointer hover:bg-violet/5 ${
                  selected?.label === item.label ? "bg-violet/10 text-violet" : "text-text-primary"
                }`}
              >
                <span className="block">{item.label}</span>
                {item.sublabel && (
                  <span className="block text-xs text-text-muted mt-0.5">{item.sublabel}</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── What-If Predictor row ─── */
function WhatIfPredictor({
  features,
  targetLabel,
  taskType,
}: {
  features: string[];
  targetLabel: string;
  taskType: TaskType;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      if (taskType === "Regression") {
        setResult(`$${(200 + Math.random() * 800).toFixed(2)}`);
      } else if (taskType === "Binary Classification") {
        const prob = Math.random();
        setResult(prob > 0.5 ? `Yes (${(prob * 100).toFixed(1)}% confidence)` : `No (${((1 - prob) * 100).toFixed(1)}% confidence)`);
      } else {
        const tiers = ["Class A", "Class B", "Class C", "Class D"];
        setResult(`${tiers[Math.floor(Math.random() * tiers.length)]} (${(60 + Math.random() * 35).toFixed(1)}% confidence)`);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="glass-card rounded-xl p-5 border-t-2 border-t-violet">
      <div className="flex items-center gap-2 mb-1">
        <FlaskConical size={18} className="text-violet" />
        <h3 className="font-heading font-semibold text-sm text-text-primary">
          What-If Predictor
        </h3>
      </div>
      <p className="text-xs text-text-muted font-body mb-4">
        Enter values for each feature to get an instant prediction for <strong className="text-text-secondary">{targetLabel}</strong>.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {features.slice(0, 5).map((f) => (
          <div key={f}>
            <label className="block text-[10px] font-body text-text-muted mb-1 truncate">{f}</label>
            <input
              type="text"
              placeholder="—"
              value={values[f] || ""}
              onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))}
              className="w-full h-9 px-3 rounded-lg bg-bg-secondary border border-border-default text-sm font-mono text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-violet/50 transition-colors"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handlePredict} isLoading={loading}>
          <Zap size={14} /> Predict
        </Button>
        {result && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet/10 border border-violet/20"
          >
            <Target size={14} className="text-violet" />
            <span className="text-sm font-body font-medium text-text-primary">{result}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Confusion Matrix mini-viz ─── */
function ConfusionMatrix({ matrix, labels }: { matrix: number[][]; labels: string[] }) {
  const max = Math.max(...matrix.flat());
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="font-heading font-semibold text-sm text-text-primary mb-4">Confusion Matrix</h3>
      <div className="flex items-start gap-2">
        <div className="text-[10px] font-body text-text-muted mt-6 -rotate-90 origin-top-left translate-y-full whitespace-nowrap w-0">
          Actual ↓
        </div>
        <div>
          <div className="flex gap-1 mb-1 ml-16">
            {labels.map((l) => (
              <span key={l} className="w-16 text-center text-[10px] font-body text-text-muted truncate">{l}</span>
            ))}
          </div>
          {matrix.map((row, ri) => (
            <div key={ri} className="flex items-center gap-1 mb-1">
              <span className="w-14 text-right text-[10px] font-body text-text-muted truncate pr-1">{labels[ri]}</span>
              {row.map((val, ci) => {
                const isCorrect = ri === ci;
                const opacity = 0.15 + (val / max) * 0.85;
                return (
                  <div
                    key={ci}
                    className="w-16 h-12 rounded-lg flex items-center justify-center text-xs font-mono font-bold"
                    style={{
                      backgroundColor: isCorrect
                        ? `rgba(34,197,94,${opacity})`
                        : `rgba(239,68,68,${opacity * 0.5})`,
                      color: isCorrect ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {val.toLocaleString()}
                  </div>
                );
              })}
            </div>
          ))}
          <div className="flex gap-1 ml-16 mt-1.5">
            <span className="text-[10px] font-body text-text-muted">← Predicted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function PredictionsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ModelStatus>("idle");
  const [trainingStep, setTrainingStep] = useState(0);
  const [showExplainer, setShowExplainer] = useState(false);
  const [exportToast, setExportToast] = useState(false);
  const [resultsTab, setResultsTab] = useState<"overview" | "features" | "predict">("overview");

  /* Dataset & target selection */
  const [selectedDataset, setSelectedDataset] = useState<DatasetDef>(DATASETS[0]);
  const [selectedTarget, setSelectedTarget] = useState(DATASETS[0].targets[0]);
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(new Set(DATASETS[0].cols));

  /* Model results (generated on training complete) */
  const [featureImportance, setFeatureImportance] = useState<{ feature: string; importance: number }[]>([]);
  const [metrics, setMetrics] = useState<{ label: string; value: string; icon: typeof Target }[]>([]);
  const [confusion, setConfusion] = useState<{ labels: string[]; matrix: number[][] } | null>(null);
  const [scatter, setScatter] = useState<{ x: number; y: number; risk: number }[]>([]);
  const [modelRanking, setModelRanking] = useState<{ name: string; score: number }[]>([]);

  /* Dataset changed → reset target + features */
  const handleDatasetChange = (ds: DatasetDef) => {
    setSelectedDataset(ds);
    setSelectedTarget(ds.targets[0]);
    setEnabledFeatures(new Set(ds.cols));
    if (status === "complete") resetModel();
  };

  /* Toggle a feature column */
  const toggleFeature = (col: string) => {
    setEnabledFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(col)) {
        if (next.size <= 2) return prev; // need at least 2
        next.delete(col);
      } else {
        next.add(col);
      }
      return next;
    });
  };

  /* Training simulation */
  const startTraining = () => {
    setStatus("training");
    setTrainingStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setTrainingStep(step);
      if (step >= trainProgressSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          /* Generate results */
          const enabledArr = [...enabledFeatures];
          setFeatureImportance(generateFeatureImportance(enabledArr));
          setMetrics(generateMetrics(selectedTarget.type));
          setConfusion(generateConfusion(selectedTarget.type));
          setScatter(generateScatter());
          setModelRanking(pickBestModel());
          setResultsTab("overview");
          setStatus("complete");
        }, 800);
      }
    }, 1200);
  };

  const resetModel = () => {
    setStatus("idle");
    setTrainingStep(0);
  };

  /* Export mock */
  const handleExport = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2500);
  };

  const datasetDropdownItems = DATASETS.map((ds) => ({
    label: `${ds.name} (${ds.rows.toLocaleString()} rows)`,
    sublabel: `${ds.cols.length} features · ${ds.targets.length} target options`,
    _ds: ds,
  }));

  const targetDropdownItems = selectedDataset.targets.map((t) => ({
    label: t.col,
    sublabel: t.description,
    _target: t,
  }));

  const enabledCount = enabledFeatures.size;
  const totalCols = selectedDataset.cols.length;

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto relative">
      {/* ─── Export Toast ─── */}
      <AnimatePresence>
        {exportToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-semantic-green/10 border border-semantic-green/30 shadow-lg"
          >
            <CheckCircle2 size={16} className="text-semantic-green" />
            <span className="text-sm font-body text-text-primary">Model exported as .pkl — ready for deployment</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Header ─── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Brain size={22} className="text-violet" />
          <h1 className="font-heading font-bold text-2xl text-text-primary">AutoML Predictions</h1>
          <button
            onClick={() => setShowExplainer((v) => !v)}
            className="ml-2 w-6 h-6 rounded-full bg-bg-secondary border border-border-default flex items-center justify-center hover:border-violet/40 transition-colors cursor-pointer"
            title="What is AutoML?"
          >
            <HelpCircle size={13} className="text-text-muted" />
          </button>
        </div>
        <p className="text-sm text-text-secondary font-body">
          Build, evaluate, and deploy machine learning models — no code required.
        </p>
      </div>

      {/* ─── What is AutoML? Explainer ─── */}
      <AnimatePresence>
        {showExplainer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="rounded-xl bg-violet/5 border border-violet/20 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb size={16} className="text-gold" />
                  <h3 className="font-heading font-semibold text-sm text-text-primary">What is AutoML?</h3>
                </div>
                <button onClick={() => setShowExplainer(false)} className="text-text-muted hover:text-text-primary cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-body text-text-secondary">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet/10 flex items-center justify-center shrink-0">
                    <Database size={15} className="text-violet" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary mb-0.5">1. Pick your data & target</p>
                    <p className="text-xs text-text-muted">Choose a dataset and the column you want to predict (e.g. "Will this customer churn?").</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center shrink-0">
                    <Shuffle size={15} className="text-cyan" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary mb-0.5">2. AI trains multiple models</p>
                    <p className="text-xs text-text-muted">The system automatically cleans data, engineers features, and trains XGBoost, Random Forest & LightGBM.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <Eye size={15} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary mb-0.5">3. Review & predict</p>
                    <p className="text-xs text-text-muted">See which model won, explore feature importance, and make real-time predictions on new data.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ═══════════════════════ IDLE: Setup ═══════════════════════ */}
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="glass-card rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-heading font-semibold text-base text-text-primary">
                  Configure Your Model
                </h3>
                <span className="ml-auto text-[10px] font-mono text-text-muted px-2 py-0.5 rounded bg-bg-secondary border border-border-default">
                  Step 1 of 2
                </span>
              </div>

              {/* Dataset & Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-body font-medium text-text-secondary mb-1.5">
                    <Database size={12} /> Dataset
                  </label>
                  <Dropdown
                    items={datasetDropdownItems}
                    selected={datasetDropdownItems.find((d) => d._ds.id === selectedDataset.id) ?? null}
                    onSelect={(item) => handleDatasetChange(item._ds)}
                    placeholder="Select dataset…"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-body font-medium text-text-secondary mb-1.5">
                    <Target size={12} /> Target Column
                    <span className="text-[10px] text-text-muted font-normal">(what to predict)</span>
                  </label>
                  <Dropdown
                    items={targetDropdownItems}
                    selected={targetDropdownItems.find((t) => t._target.col === selectedTarget.col) ?? null}
                    onSelect={(item) => setSelectedTarget(item._target)}
                    icon={<Target size={14} className="text-violet" />}
                    placeholder="Select target…"
                  />
                </div>
              </div>

              {/* Task Type Detection */}
              <div className="rounded-xl bg-violet/5 border border-violet/20 p-4 mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-violet" />
                  <span className="text-xs font-body font-semibold text-violet">Auto-detected</span>
                </div>
                <p className="text-sm font-body text-text-secondary">
                  Task type: <strong className="text-text-primary">{selectedTarget.type}</strong> — {selectedTarget.description}
                </p>
              </div>

              {/* Feature columns — toggleable */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="flex items-center gap-1.5 text-xs font-body font-medium text-text-secondary">
                    <Columns3 size={12} /> Feature Columns
                    <span className="text-[10px] text-text-muted font-normal ml-1">
                      {enabledCount}/{totalCols} selected — click to toggle
                    </span>
                  </h4>
                  <button
                    onClick={() =>
                      setEnabledFeatures((prev) =>
                        prev.size === totalCols ? new Set(selectedDataset.cols.slice(0, 2)) : new Set(selectedDataset.cols)
                      )
                    }
                    className="text-[10px] text-violet font-body hover:underline cursor-pointer"
                  >
                    {enabledFeatures.size === totalCols ? "Deselect all" : "Select all"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDataset.cols.map((col) => {
                    const enabled = enabledFeatures.has(col);
                    return (
                      <button
                        key={col}
                        onClick={() => toggleFeature(col)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                          enabled
                            ? "bg-violet/10 border border-violet/30 text-violet"
                            : "bg-bg-secondary border border-border-default text-text-muted line-through opacity-60"
                        }`}
                      >
                        {enabled ? <Check size={10} /> : <X size={10} />}
                        {col}
                      </button>
                    );
                  })}
                </div>
                {enabledCount < 2 && (
                  <p className="text-[10px] text-semantic-red mt-1.5 font-body">Select at least 2 feature columns.</p>
                )}
              </div>

              {/* Advanced config (collapsed) */}
              <details className="mb-6 group">
                <summary className="text-xs font-body text-text-muted cursor-pointer hover:text-text-secondary flex items-center gap-1.5">
                  <Info size={12} /> Advanced options
                  <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-body text-text-muted mb-1">Train/Test Split</label>
                    <select className="w-full h-9 px-3 rounded-lg bg-bg-secondary border border-border-default text-sm font-body text-text-primary focus:outline-none focus:border-violet/50">
                      <option>80 / 20</option>
                      <option>70 / 30</option>
                      <option>90 / 10</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-body text-text-muted mb-1">Cross-validation Folds</label>
                    <select className="w-full h-9 px-3 rounded-lg bg-bg-secondary border border-border-default text-sm font-body text-text-primary focus:outline-none focus:border-violet/50">
                      <option>5-fold</option>
                      <option>3-fold</option>
                      <option>10-fold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-body text-text-muted mb-1">Optimization Metric</label>
                    <select className="w-full h-9 px-3 rounded-lg bg-bg-secondary border border-border-default text-sm font-body text-text-primary focus:outline-none focus:border-violet/50">
                      {selectedTarget.type === "Regression" ? (
                        <>
                          <option>R² Score</option>
                          <option>RMSE</option>
                          <option>MAE</option>
                        </>
                      ) : (
                        <>
                          <option>Accuracy</option>
                          <option>F1 Score</option>
                          <option>AUC-ROC</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </details>

              <div className="flex items-center gap-3">
                <Button onClick={startTraining} size="lg" disabled={enabledCount < 2}>
                  <Play size={16} /> Train Model
                </Button>
                <span className="text-xs text-text-muted font-body">
                  {enabledCount} features · {selectedDataset.rows.toLocaleString()} rows · {selectedTarget.type}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════ TRAINING ═══════════════════════ */}
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
                  AutoML is building and evaluating 3 models on <strong className="text-text-secondary">{selectedDataset.name}</strong>…
                </p>
              </div>
              <span className="ml-auto text-xs font-mono text-text-muted">
                {trainingStep}/{trainProgressSteps.length}
              </span>
            </div>

            {/* Progress Steps */}
            <div className="space-y-3">
              {trainProgressSteps.map((step, idx) => {
                const isDone = idx < trainingStep;
                const isActive = idx === trainingStep;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-semantic-green shrink-0 mt-0.5" />
                    ) : isActive ? (
                      <Loader2 size={18} className="text-violet animate-spin shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-[18px] h-[18px] rounded-full border border-border-default shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span
                        className={`text-sm font-body block ${
                          isDone
                            ? "text-semantic-green"
                            : isActive
                            ? "text-violet font-medium"
                            : "text-text-muted"
                        }`}
                      >
                        {step.label}
                      </span>
                      {(isDone || isActive) && (
                        <span className="text-[10px] text-text-muted font-body">{step.detail}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-6 h-2 rounded-full bg-bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet to-cyan"
                animate={{ width: `${(trainingStep / trainProgressSteps.length) * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <p className="text-[10px] text-text-muted font-body mt-2 text-right">
              Estimated ~{Math.max(0, (trainProgressSteps.length - trainingStep) * 1.2).toFixed(0)}s remaining
            </p>
          </motion.div>
        )}

        {/* ═══════════════════════ COMPLETE: Results ═══════════════════════ */}
        {status === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {/* Success Banner */}
            <div className="rounded-xl bg-semantic-green/5 border border-semantic-green/20 p-4 mb-6 flex flex-col sm:flex-row items-start gap-3">
              <CheckCircle2 size={18} className="text-semantic-green shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-body text-text-primary font-medium">
                  Model trained successfully on {selectedDataset.name}!
                </p>
                <p className="text-xs text-text-muted font-body mt-0.5">
                  Best model: <strong className="text-text-secondary">{modelRanking[0]?.name}</strong> ({modelRanking[0]?.score.toFixed(3)}) — selected from {modelRanking.length} candidates after cross-validation.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="secondary" size="sm" onClick={resetModel}>
                  <RefreshCcw size={13} /> Retrain
                </Button>
                <Button variant="secondary" size="sm" onClick={handleExport}>
                  <Download size={13} /> Export
                </Button>
              </div>
            </div>

            {/* Model Ranking */}
            <div className="glass-card rounded-xl p-4 mb-6">
              <h4 className="text-xs font-body font-medium text-text-secondary mb-3">Model Comparison</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {modelRanking.map((m, i) => (
                  <div
                    key={m.name}
                    className={`rounded-lg p-3 flex items-center gap-3 ${
                      i === 0 ? "bg-violet/10 border border-violet/30" : "bg-bg-secondary border border-border-default"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? "bg-violet text-white" : "bg-bg-elevated text-text-muted"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-body font-medium truncate ${i === 0 ? "text-violet" : "text-text-primary"}`}>{m.name}</p>
                      <p className="text-[10px] text-text-muted font-mono">{selectedTarget.type === "Regression" ? "R²" : "F1"}: {m.score.toFixed(3)}</p>
                    </div>
                    {i === 0 && <span className="text-[9px] font-body font-bold text-violet bg-violet/20 px-1.5 py-0.5 rounded">BEST</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-6 p-1 rounded-xl bg-bg-secondary border border-border-default w-fit">
              {[
                { key: "overview" as const, label: "Performance", icon: BarChart3 },
                { key: "features" as const, label: "Features & Distribution", icon: TrendingUp },
                { key: "predict" as const, label: "What-If Predictor", icon: FlaskConical },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setResultsTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-all cursor-pointer ${
                    resultsTab === tab.key
                      ? "bg-violet/10 text-violet font-medium"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <tab.icon size={13} /> {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ── Tab: Overview ── */}
              {resultsTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Model Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {metrics.map((m, idx) => {
                      const Icon = m.icon;
                      return (
                        <div key={idx} className="glass-card rounded-xl p-4 text-center group hover:border-violet/30 transition-colors">
                          <Icon size={18} className="text-violet mx-auto mb-2 group-hover:scale-110 transition-transform" />
                          <p className="font-heading font-bold text-xl text-text-primary">{m.value}</p>
                          <p className="text-xs text-text-muted font-body mt-0.5">{m.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Confusion Matrix (only for classification) */}
                  {confusion && <div className="mb-6"><ConfusionMatrix matrix={confusion.matrix} labels={confusion.labels} /></div>}
                </motion.div>
              )}

              {/* ── Tab: Features ── */}
              {resultsTab === "features" && (
                <motion.div key="features" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                            domain={[0, "auto"]}
                          />
                          <YAxis
                            type="category"
                            dataKey="feature"
                            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 8, fontSize: 12 }}
                            formatter={(value) => [(value as number).toFixed(3), "Importance"]}
                          />
                          <Bar dataKey="importance" radius={[0, 6, 6, 0]} name="Importance">
                            {featureImportance.map((_, i) => (
                              <Cell key={i} fill={i === 0 ? "#8B5CF6" : i < 3 ? "#00D4FF" : "#F5A623"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Risk Distribution Scatter */}
                    <div className="glass-card rounded-xl p-5">
                      <h3 className="font-heading font-semibold text-sm text-text-primary mb-4">
                        Prediction Score Distribution
                      </h3>
                      <ResponsiveContainer width="100%" height={260}>
                        <ScatterChart margin={{ top: 5, right: 10, left: 0, bottom: 15 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                          <XAxis
                            dataKey="x"
                            name="Feature 1"
                            tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                            axisLine={false}
                            tickLine={false}
                            label={{ value: enabledFeatures.values().next().value ?? "Feature 1", position: "bottom", fontSize: 10, fill: "var(--text-muted)", offset: 0 }}
                          />
                          <YAxis
                            dataKey="y"
                            name="Feature 2"
                            tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <ZAxis dataKey="risk" range={[20, 200]} name="Score" />
                          <Tooltip
                            contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 8, fontSize: 12 }}
                          />
                          <Scatter data={scatter} fill="#8B5CF6" fillOpacity={0.6} />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Tab: What-If Predictor ── */}
              {resultsTab === "predict" && (
                <motion.div key="predict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <WhatIfPredictor
                    features={[...enabledFeatures]}
                    targetLabel={selectedTarget.col}
                    taskType={selectedTarget.type}
                  />

                  {/* CTA to Agent */}
                  <div className="glass-card rounded-xl p-5 mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain size={16} className="text-gold" />
                      <h4 className="font-heading font-semibold text-sm text-text-primary">
                        Want to explore further?
                      </h4>
                    </div>
                    <p className="text-sm text-text-secondary font-body mb-3">
                      Ask the AI Agent natural-language questions like &quot;Which customers are most likely to churn next month?&quot; or &quot;What if we reduce monthly charges by 20%?&quot;
                    </p>
                    <Button variant="secondary" size="sm" onClick={() => router.push("/dashboard/agent")}>
                      Ask AI Agent <ArrowRight size={14} />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
