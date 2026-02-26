"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  Play,
  SkipForward,
  ArrowRight,
  BarChart3,
  TrendingUp,
  PieChart,
  Layers,
  Search,
  Shield,
  Target,
  Lightbulb,
  Zap,
  FileText,
  CircleDot,
  ChevronRight,
  RefreshCw,
  ThumbsUp,
  Clock,
  Database,
  AlertTriangle,
  Info,
  MessageSquare,
} from "lucide-react";

/* ─────────────────────────── Types ─────────────────────────── */

export interface DetectedDataset {
  fileName: string;
  rows: number;
  columns: number;
  columnNames: string[];
  dataTypes: Record<string, string>;
  missingValues: number;
  numericCols: string[];
  categoricalCols: string[];
  dateCols: string[];
  possibleTarget: string | null;
  dataCategory: "sales" | "hr" | "marketing" | "finance" | "healthcare" | "general";
}

interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  options?: QuickOption[];
  type?: "text" | "analysis-step" | "summary" | "insight";
}

interface QuickOption {
  label: string;
  value: string;
  icon?: React.ElementType;
}

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: "pending" | "running" | "completed" | "skipped";
  result?: string;
  estimatedTime: string;
}

interface SmartQuestion {
  question: string;
  category: "trend" | "comparison" | "prediction" | "anomaly" | "summary";
  icon: React.ElementType;
}

/* ─────────── Mock detection based on file name ─────────── */

function detectDataset(fileName: string): DetectedDataset {
  const lower = fileName.toLowerCase();

  if (lower.includes("sales") || lower.includes("ecommerce") || lower.includes("e-commerce") || lower.includes("order")) {
    return {
      fileName,
      rows: 5423,
      columns: 14,
      columnNames: ["order_id", "date", "customer_id", "product", "category", "quantity", "unit_price", "total", "region", "channel", "discount", "shipping", "status", "payment_method"],
      dataTypes: { order_id: "string", date: "datetime", customer_id: "string", product: "string", category: "categorical", quantity: "numeric", unit_price: "numeric", total: "numeric", region: "categorical", channel: "categorical", discount: "numeric", shipping: "numeric", status: "categorical", payment_method: "categorical" },
      missingValues: 23,
      numericCols: ["quantity", "unit_price", "total", "discount", "shipping"],
      categoricalCols: ["category", "region", "channel", "status", "payment_method"],
      dateCols: ["date"],
      possibleTarget: "total",
      dataCategory: "sales",
    };
  }

  if (lower.includes("employee") || lower.includes("attrition") || lower.includes("hr")) {
    return {
      fileName,
      rows: 1470,
      columns: 35,
      columnNames: ["employee_id", "age", "department", "education", "gender", "job_role", "monthly_income", "years_at_company", "attrition", "satisfaction", "performance_rating", "overtime", "distance_from_home", "marital_status", "work_life_balance"],
      dataTypes: { employee_id: "string", age: "numeric", department: "categorical", education: "categorical", gender: "categorical", job_role: "categorical", monthly_income: "numeric", years_at_company: "numeric", attrition: "binary", satisfaction: "numeric", performance_rating: "numeric", overtime: "binary", distance_from_home: "numeric", marital_status: "categorical", work_life_balance: "numeric" },
      missingValues: 0,
      numericCols: ["age", "monthly_income", "years_at_company", "satisfaction", "performance_rating", "distance_from_home", "work_life_balance"],
      categoricalCols: ["department", "education", "gender", "job_role", "marital_status"],
      dateCols: [],
      possibleTarget: "attrition",
      dataCategory: "hr",
    };
  }

  if (lower.includes("marketing") || lower.includes("campaign")) {
    return {
      fileName,
      rows: 2240,
      columns: 18,
      columnNames: ["campaign_id", "date", "channel", "impressions", "clicks", "conversions", "spend", "revenue", "ctr", "cpc", "roas", "audience_segment", "creative_type", "region", "device", "age_group", "landing_page", "bounce_rate"],
      dataTypes: { campaign_id: "string", date: "datetime", channel: "categorical", impressions: "numeric", clicks: "numeric", conversions: "numeric", spend: "numeric", revenue: "numeric", ctr: "numeric", cpc: "numeric", roas: "numeric", audience_segment: "categorical", creative_type: "categorical", region: "categorical", device: "categorical", age_group: "categorical", landing_page: "string", bounce_rate: "numeric" },
      missingValues: 12,
      numericCols: ["impressions", "clicks", "conversions", "spend", "revenue", "ctr", "cpc", "roas", "bounce_rate"],
      categoricalCols: ["channel", "audience_segment", "creative_type", "region", "device", "age_group"],
      dateCols: ["date"],
      possibleTarget: "conversions",
      dataCategory: "marketing",
    };
  }

  // General fallback
  return {
    fileName,
    rows: 3200,
    columns: 12,
    columnNames: ["id", "date", "name", "category", "value", "amount", "status", "region", "score", "count", "type", "notes"],
    dataTypes: { id: "string", date: "datetime", name: "string", category: "categorical", value: "numeric", amount: "numeric", status: "categorical", region: "categorical", score: "numeric", count: "numeric", type: "categorical", notes: "string" },
    missingValues: 45,
    numericCols: ["value", "amount", "score", "count"],
    categoricalCols: ["category", "status", "region", "type"],
    dateCols: ["date"],
    possibleTarget: "value",
    dataCategory: "general",
  };
}

/* ─────────── Generate smart questions ─────────── */

function generateSmartQuestions(dataset: DetectedDataset): SmartQuestion[] {
  const base: SmartQuestion[] = [];

  if (dataset.dataCategory === "sales") {
    base.push(
      { question: "What are the top 5 best-selling products by revenue?", category: "summary", icon: BarChart3 },
      { question: "Show me the monthly sales trend over time", category: "trend", icon: TrendingUp },
      { question: "Which region generates the most revenue?", category: "comparison", icon: PieChart },
      { question: "Are there any unusual spikes or drops in sales?", category: "anomaly", icon: AlertTriangle },
      { question: "Predict next quarter's sales based on historical data", category: "prediction", icon: Target },
      { question: "What is the average order value by customer segment?", category: "summary", icon: Layers },
      { question: "Which payment method is most popular?", category: "summary", icon: Database },
      { question: "How does discount affect order volume?", category: "comparison", icon: Search },
    );
  } else if (dataset.dataCategory === "hr") {
    base.push(
      { question: "What factors most strongly predict employee attrition?", category: "prediction", icon: Target },
      { question: "Compare satisfaction scores across departments", category: "comparison", icon: BarChart3 },
      { question: "Is there a correlation between overtime and attrition?", category: "anomaly", icon: AlertTriangle },
      { question: "Show the distribution of monthly income by job role", category: "summary", icon: PieChart },
      { question: "Which department has the highest turnover rate?", category: "comparison", icon: Layers },
      { question: "How does work-life balance relate to performance?", category: "trend", icon: TrendingUp },
      { question: "Identify employees at high risk of leaving", category: "prediction", icon: Shield },
      { question: "What's the average tenure by department?", category: "summary", icon: Clock },
    );
  } else if (dataset.dataCategory === "marketing") {
    base.push(
      { question: "Which channel has the highest ROAS?", category: "comparison", icon: BarChart3 },
      { question: "Show me conversion trends over the last 6 months", category: "trend", icon: TrendingUp },
      { question: "What's the optimal budget allocation across channels?", category: "prediction", icon: Target },
      { question: "Which audience segment converts best?", category: "comparison", icon: PieChart },
      { question: "Are there any underperforming campaigns to pause?", category: "anomaly", icon: AlertTriangle },
      { question: "How does creative type affect click-through rate?", category: "comparison", icon: Layers },
      { question: "Predict next month's conversions", category: "prediction", icon: Shield },
      { question: "What devices drive the most revenue?", category: "summary", icon: Database },
    );
  } else {
    base.push(
      { question: "Summarize the key statistics of this dataset", category: "summary", icon: BarChart3 },
      { question: "Show me the distribution of the main numeric columns", category: "summary", icon: PieChart },
      { question: "Are there any trends over time?", category: "trend", icon: TrendingUp },
      { question: "Find correlations between numeric variables", category: "comparison", icon: Layers },
      { question: "Detect any outliers or anomalies", category: "anomaly", icon: AlertTriangle },
      { question: "What category has the highest average value?", category: "comparison", icon: Target },
      { question: "Can you predict the target variable?", category: "prediction", icon: Shield },
      { question: "Generate an executive summary report", category: "summary", icon: FileText },
    );
  }

  return base;
}

/* ─────────── Generate analysis steps ─────────── */

function generateAnalysisSteps(dataset: DetectedDataset, userGoal: string): AnalysisStep[] {
  const steps: AnalysisStep[] = [
    {
      id: "eda",
      title: "Exploratory Data Analysis",
      description: `Run statistical summaries across all ${dataset.columns} columns. This reveals distributions, central tendencies, and variance — essential for understanding your data before deeper analysis.`,
      icon: Search,
      status: "pending",
      estimatedTime: "~15 sec",
    },
    {
      id: "missing",
      title: "Handle Missing Values",
      description: dataset.missingValues > 0
        ? `Found ${dataset.missingValues} missing values. I'll assess the pattern — if values are missing at random, I'll impute using median/mode. If they're systematic, I'll flag them so they don't skew results.`
        : `Great news — no missing values detected! I'll skip imputation and move to the next step.`,
      icon: Shield,
      status: dataset.missingValues === 0 ? "completed" : "pending",
      result: dataset.missingValues === 0 ? "No missing values found — data is clean." : undefined,
      estimatedTime: dataset.missingValues === 0 ? "Skipped" : "~8 sec",
    },
    {
      id: "correlation",
      title: "Correlation & Relationship Analysis",
      description: `I'll calculate correlations between numeric columns (${dataset.numericCols.slice(0, 4).join(", ")}${dataset.numericCols.length > 4 ? "…" : ""}) and identify which features have the strongest relationships. This helps prioritize what to analyze.`,
      icon: Layers,
      status: "pending",
      estimatedTime: "~12 sec",
    },
  ];

  if (dataset.dateCols.length > 0) {
    steps.push({
      id: "timeseries",
      title: "Time-Series Trend Analysis",
      description: `Your data has a date column "${dataset.dateCols[0]}". I'll decompose trends, detect seasonality, and identify any breakpoints or shifts over time.`,
      icon: TrendingUp,
      status: "pending",
      estimatedTime: "~20 sec",
    });
  }

  if (dataset.categoricalCols.length > 0) {
    steps.push({
      id: "segmentation",
      title: "Segment Comparison",
      description: `Compare key metrics across your categorical dimensions (${dataset.categoricalCols.slice(0, 3).join(", ")}). I'll surface which segments over- or under-perform, with statistical significance tests.`,
      icon: PieChart,
      status: "pending",
      estimatedTime: "~18 sec",
    });
  }

  if (dataset.possibleTarget) {
    steps.push({
      id: "predictive",
      title: "Predictive Modeling",
      description: `"${dataset.possibleTarget}" looks like a good target variable. I can build a quick predictive model to see which features drive it most — useful for forecasting and decision-making.`,
      icon: Target,
      status: "pending",
      estimatedTime: "~30 sec",
    });
  }

  steps.push({
    id: "report",
    title: "Generate Insights Report",
    description: `I'll compile all findings into a clear, shareable report with charts, key takeaways, and recommended next steps — ready for your team or stakeholders.`,
    icon: FileText,
    status: "pending",
    estimatedTime: "~10 sec",
  });

  return steps;
}

/* ─────────── Category-specific openers ─────────── */

function getDataCategoryDescription(cat: string): string {
  switch (cat) {
    case "sales": return "e-commerce / sales transactions";
    case "hr": return "human resources / employee data";
    case "marketing": return "marketing campaign performance";
    case "finance": return "financial records";
    case "healthcare": return "healthcare / patient data";
    default: return "structured tabular data";
  }
}

/* ═════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════════════════ */

interface DatasetInterviewProps {
  fileName: string;
  onStartAnalysis?: () => void;
}

type InterviewPhase =
  | "greeting"      // AI introduces itself, shows detected info, asks about the dataset
  | "understanding" // AI asks what user wants to learn / achieve
  | "planning"      // AI proposes analysis steps, asks permission for each
  | "executing"     // Steps are running
  | "complete";     // All done, shows summary + recommended questions

export default function DatasetInterviewPanel({ fileName, onStartAnalysis }: DatasetInterviewProps) {
  const [phase, setPhase] = useState<InterviewPhase>("greeting");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dataset] = useState<DetectedDataset>(() => detectDataset(fileName));
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [smartQuestions, setSmartQuestions] = useState<SmartQuestion[]>([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [showQuestionPanel, setShowQuestionPanel] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll — use block:"nearest" so only the chat container scrolls, not the whole page
  useEffect(() => {
    const container = chatEndRef.current?.parentElement;
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [messages, isTyping]);

  // Start the greeting phase
  useEffect(() => {
    const timer = setTimeout(() => {
      const catDesc = getDataCategoryDescription(dataset.dataCategory);
      addAIMessage(
        `I've analyzed **${dataset.fileName}** and here's what I found:\n\n` +
        `📊 **${dataset.rows.toLocaleString()} rows** × **${dataset.columns} columns**\n` +
        `📁 Data type: Looks like **${catDesc}**\n` +
        `🔢 Numeric columns: ${dataset.numericCols.slice(0, 5).join(", ")}${dataset.numericCols.length > 5 ? "…" : ""}\n` +
        `📋 Categories: ${dataset.categoricalCols.slice(0, 4).join(", ")}${dataset.categoricalCols.length > 4 ? "…" : ""}\n` +
        (dataset.missingValues > 0 ? `⚠️ Missing values: ${dataset.missingValues}\n` : `✅ No missing values detected\n`) +
        (dataset.possibleTarget ? `🎯 Likely target variable: "${dataset.possibleTarget}"\n` : "") +
        `\nIs this correct? Could you tell me a bit more about what this dataset represents?`,
        [
          { label: `Yes, it's ${catDesc}`, value: `confirm_${dataset.dataCategory}` },
          { label: "Let me explain what it is", value: "explain" },
          { label: "Looks right, let's continue", value: "continue" },
        ]
      );
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ────── Message helpers ────── */
  const addAIMessage = useCallback((content: string, options?: QuickOption[], type?: ChatMessage["type"]) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          content,
          timestamp: new Date(),
          options,
          type: type || "text",
        },
      ]);
    }, 800 + Math.random() * 600);
  }, []);

  const addUserMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      },
    ]);
  }, []);

  /* ────── Phase transitions ────── */

  const handleUserResponse = useCallback((text: string) => {
    if (!text.trim()) return;
    addUserMessage(text);
    setUserInput("");

    if (phase === "greeting") {
      // Move to understanding phase
      setTimeout(() => {
        setPhase("understanding");
        const goalOptions: QuickOption[] =
          dataset.dataCategory === "sales"
            ? [
                { label: "Understand revenue trends", value: "trends", icon: TrendingUp },
                { label: "Find top-performing products", value: "top_products", icon: BarChart3 },
                { label: "Customer segmentation", value: "segmentation", icon: PieChart },
                { label: "Predict future sales", value: "prediction", icon: Target },
              ]
            : dataset.dataCategory === "hr"
            ? [
                { label: "Identify attrition risk factors", value: "attrition", icon: Shield },
                { label: "Compare departments", value: "departments", icon: BarChart3 },
                { label: "Salary & satisfaction analysis", value: "satisfaction", icon: TrendingUp },
                { label: "Predict who might leave", value: "prediction", icon: Target },
              ]
            : dataset.dataCategory === "marketing"
            ? [
                { label: "Find best-performing channels", value: "channels", icon: BarChart3 },
                { label: "Optimize budget allocation", value: "budget", icon: PieChart },
                { label: "Conversion trend analysis", value: "conversions", icon: TrendingUp },
                { label: "Predict campaign performance", value: "prediction", icon: Target },
              ]
            : [
                { label: "Explore & summarize the data", value: "explore", icon: Search },
                { label: "Find trends & patterns", value: "trends", icon: TrendingUp },
                { label: "Compare categories / segments", value: "compare", icon: BarChart3 },
                { label: "Build a predictive model", value: "prediction", icon: Target },
              ];

        addAIMessage(
          `Thanks for the context! Now, **what would you like to learn or achieve** from this dataset?\n\nI can help with trend analysis, comparisons, predictions, and more. Pick a goal below or describe what you need in your own words:`,
          goalOptions
        );
      }, 300);
    } else if (phase === "understanding") {
      setSelectedGoal(text);
      setTimeout(() => {
        setPhase("planning");
        const steps = generateAnalysisSteps(dataset, text);
        setAnalysisSteps(steps);
        setSmartQuestions(generateSmartQuestions(dataset));

        addAIMessage(
          `Great choice! Based on your goal and the dataset structure, here's my **recommended analysis plan**:\n\n` +
          `I've prepared **${steps.length} analysis steps**. I'll walk you through each one — you can approve, skip, or modify them before I run anything.\n\n` +
          `Ready to review the first step?`,
          [
            { label: "Show me the plan", value: "show_plan" },
            { label: "Run all steps automatically", value: "run_all" },
            { label: "Let me pick which steps to run", value: "pick_steps" },
          ]
        );
      }, 300);
    } else if (phase === "planning") {
      if (text.includes("run_all") || text.toLowerCase().includes("run all") || text.toLowerCase().includes("automatically")) {
        handleRunAll();
      } else {
        // Show the plan step by step
        setShowQuestionPanel(true);
        showNextStep(0);
      }
    } else if (phase === "executing") {
      // User can ask questions during execution
      addAIMessage(
        `I'm currently running the analysis. Feel free to check the progress below — I'll let you know when each step completes! You can also browse the recommended questions on the right to plan your next queries.`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, dataset, addUserMessage, addAIMessage]);

  const showNextStep = useCallback((stepIdx: number) => {
    setAnalysisSteps((prev) => {
      const steps = [...prev];
      if (stepIdx >= steps.length) return steps;
      return steps;
    });

    setCurrentStepIdx(stepIdx);

    setAnalysisSteps((prev) => {
      if (stepIdx >= prev.length) {
        // All steps done
        setTimeout(() => {
          setPhase("complete");
          setShowQuestionPanel(true);
          addAIMessage(
            `🎉 **Analysis complete!** All steps have been executed successfully.\n\n` +
            `Here's a quick summary:\n` +
            `• Processed ${dataset.rows.toLocaleString()} rows across ${dataset.columns} columns\n` +
            `• Found key patterns and correlations\n` +
            `• Generated visualizations for each analysis\n\n` +
            `You can now **ask me any follow-up question** or pick from the recommended questions to dive deeper. I'm here to help you explore every angle of your data!`,
            [
              { label: "Go to Analysis Dashboard", value: "go_analysis" },
              { label: "Generate full report", value: "gen_report" },
              { label: "Ask a follow-up question", value: "followup" },
            ],
            "summary"
          );
        }, 400);
        return prev;
      }
      return prev;
    });

    if (stepIdx < analysisSteps.length) {
      const step = analysisSteps[stepIdx];
      if (step.status === "completed") {
        // Already completed (e.g., no missing values), move to next
        setTimeout(() => showNextStep(stepIdx + 1), 300);
        return;
      }

      addAIMessage(
        `**Step ${stepIdx + 1}/${analysisSteps.length}: ${step.title}**\n\n${step.description}\n\n⏱️ Estimated time: ${step.estimatedTime}\n\nShould I proceed with this step?`,
        [
          { label: "Yes, run this step", value: `run_step_${step.id}` },
          { label: "Skip this step", value: `skip_step_${step.id}` },
          { label: "Tell me more about it", value: `info_step_${step.id}` },
        ],
        "analysis-step"
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisSteps, dataset, addAIMessage]);

  const handleStepAction = useCallback((action: string) => {
    if (action.startsWith("run_step_")) {
      const stepId = action.replace("run_step_", "");
      addUserMessage(`Yes, run "${analysisSteps.find(s => s.id === stepId)?.title}"`);

      // Mark as running
      setAnalysisSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, status: "running" as const } : s))
      );

      // Simulate completion
      setTimeout(() => {
        setAnalysisSteps((prev) =>
          prev.map((s) =>
            s.id === stepId
              ? { ...s, status: "completed" as const, result: getStepResult(stepId, dataset) }
              : s
          )
        );

        const stepIndex = analysisSteps.findIndex(s => s.id === stepId);
        addAIMessage(
          `✅ **${analysisSteps[stepIndex]?.title}** — Complete!\n\n${getStepResult(stepId, dataset)}`,
          undefined,
          "insight"
        );

        // Move to next step
        setTimeout(() => showNextStep(stepIndex + 1), 800);
      }, 1500 + Math.random() * 1500);
    } else if (action.startsWith("skip_step_")) {
      const stepId = action.replace("skip_step_", "");
      const stepIndex = analysisSteps.findIndex(s => s.id === stepId);
      addUserMessage(`Skip "${analysisSteps[stepIndex]?.title}"`);

      setAnalysisSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, status: "skipped" as const } : s))
      );

      addAIMessage(`Skipped. Moving to the next step…`);
      setTimeout(() => showNextStep(stepIndex + 1), 500);
    } else if (action.startsWith("info_step_")) {
      const stepId = action.replace("info_step_", "");
      const step = analysisSteps.find(s => s.id === stepId);
      addUserMessage(`Tell me more about "${step?.title}"`);

      addAIMessage(
        getStepExplanation(stepId, dataset),
        [
          { label: "Got it — run this step", value: `run_step_${stepId}` },
          { label: "Skip it", value: `skip_step_${stepId}` },
        ]
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisSteps, dataset, addUserMessage, addAIMessage, showNextStep]);

  const handleRunAll = useCallback(() => {
    addUserMessage("Run all steps automatically");
    setPhase("executing");
    setShowQuestionPanel(true);

    const runStep = (idx: number) => {
      if (idx >= analysisSteps.length) {
        setTimeout(() => {
          setPhase("complete");
          addAIMessage(
            `🎉 **All ${analysisSteps.length} analysis steps completed!**\n\n` +
            `Here's what I found:\n` +
            analysisSteps.map((s, i) => `${i + 1}. **${s.title}** — ${s.status === "completed" ? "✅" : "⏭️"}`).join("\n") +
            `\n\nYour full analysis is ready. You can now explore the results, ask follow-up questions, or generate a comprehensive report.`,
            [
              { label: "Go to Analysis Dashboard", value: "go_analysis" },
              { label: "Generate full report", value: "gen_report" },
              { label: "Ask a follow-up question", value: "followup" },
            ],
            "summary"
          );
        }, 600);
        return;
      }

      const step = analysisSteps[idx];
      if (step.status === "completed") {
        runStep(idx + 1);
        return;
      }

      setAnalysisSteps((prev) =>
        prev.map((s, i) => (i === idx ? { ...s, status: "running" as const } : s))
      );
      setCurrentStepIdx(idx);

      setTimeout(() => {
        setAnalysisSteps((prev) =>
          prev.map((s, i) =>
            i === idx
              ? { ...s, status: "completed" as const, result: getStepResult(s.id, dataset) }
              : s
          )
        );
        runStep(idx + 1);
      }, 1200 + Math.random() * 800);
    };

    addAIMessage(
      `Running all analysis steps automatically. I'll show you the progress below — sit tight while I crunch the numbers! 🔄`
    );

    setTimeout(() => runStep(0), 600);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisSteps, dataset, addUserMessage, addAIMessage]);

  const handleQuickOption = useCallback((option: QuickOption) => {
    if (option.value.startsWith("run_step_") || option.value.startsWith("skip_step_") || option.value.startsWith("info_step_")) {
      handleStepAction(option.value);
    } else if (option.value === "show_plan" || option.value === "pick_steps") {
      addUserMessage(option.label);
      setShowQuestionPanel(true);
      setTimeout(() => showNextStep(0), 300);
    } else if (option.value === "run_all") {
      handleRunAll();
    } else if (option.value === "go_analysis") {
      addUserMessage("Go to Analysis Dashboard");
      if (onStartAnalysis) onStartAnalysis();
    } else if (option.value === "gen_report") {
      addUserMessage("Generate full report");
      addAIMessage(
        `📄 I'm generating a comprehensive report with all findings, charts, and recommendations.\n\nThis will include:\n• Executive summary\n• Key metrics & KPIs\n• Trend analysis with visualizations\n• Segment comparisons\n• Actionable recommendations\n\nYou'll find it in the **Reports** section when it's ready!`,
        [{ label: "Go to Reports", value: "go_reports" }]
      );
    } else {
      handleUserResponse(option.value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleStepAction, handleRunAll, handleUserResponse, addUserMessage, addAIMessage, onStartAnalysis, showNextStep]);

  const handleSmartQuestion = useCallback((question: string) => {
    addUserMessage(question);
    addAIMessage(
      `Great question! Let me analyze that for you…\n\n${getSmartAnswer(question, dataset)}`,
      [
        { label: "Show me a chart", value: "show_chart" },
        { label: "Dig deeper", value: "dig_deeper" },
        { label: "Ask another question", value: "followup" },
      ],
      "insight"
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, addUserMessage, addAIMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    handleUserResponse(userInput);
  };

  /* ────── Render helpers ────── */

  const renderMarkdown = (text: string) => {
    // Simple markdown: **bold**, \n for line breaks
    return text.split("\n").map((line, lineIdx) => (
      <span key={lineIdx}>
        {line.split(/(\*\*.*?\*\*)/).map((part, partIdx) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={partIdx} className="font-semibold text-text-primary">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={partIdx}>{part}</span>
          )
        )}
        {lineIdx < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  const categoryColors: Record<SmartQuestion["category"], string> = {
    trend: "text-gold bg-gold/10 border-border-gold",
    comparison: "text-cyan bg-cyan/10 border-border-cyan",
    prediction: "text-violet bg-violet/10 border-violet/20",
    anomaly: "text-semantic-orange bg-semantic-orange/10 border-semantic-orange/20",
    summary: "text-semantic-green bg-semantic-green/10 border-semantic-green/20",
  };

  const categoryLabels: Record<SmartQuestion["category"], string> = {
    trend: "Trend",
    comparison: "Compare",
    prediction: "Predict",
    anomaly: "Anomaly",
    summary: "Summary",
  };

  return (
    <div className="flex gap-4 h-full">
      {/* ─── MAIN CHAT + STEPS AREA ─── */}
      <div className={`flex-1 flex flex-col min-w-0 ${showQuestionPanel ? "lg:max-w-[calc(100%-320px)]" : ""}`}>
        {/* Data Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4 mb-4 border border-border-gold/20"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                <Database size={16} className="text-gold" />
              </div>
              <div>
                <p className="text-sm font-body font-medium text-text-primary">{dataset.fileName}</p>
                <p className="text-[11px] font-mono text-text-muted">
                  {dataset.rows.toLocaleString()} rows • {dataset.columns} cols • {getDataCategoryDescription(dataset.dataCategory)}
                </p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {analysisSteps.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] font-body text-text-secondary">
                  <span className="font-mono text-semantic-green">{analysisSteps.filter(s => s.status === "completed").length}</span>
                  <span>/</span>
                  <span className="font-mono">{analysisSteps.length}</span>
                  <span>steps done</span>
                </div>
              )}
              {phase === "complete" && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-semantic-green/10 text-semantic-green border border-semantic-green/20">
                  Analysis Complete
                </span>
              )}
            </div>
          </div>

          {/* Progress Steps Mini */}
          {analysisSteps.length > 0 && (
            <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1">
              {analysisSteps.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-body whitespace-nowrap border transition-all ${
                      step.status === "completed"
                        ? "bg-semantic-green/10 border-semantic-green/20 text-semantic-green"
                        : step.status === "running"
                        ? "bg-gold/10 border-border-gold text-gold"
                        : step.status === "skipped"
                        ? "bg-bg-secondary border-border-subtle text-text-muted line-through"
                        : "bg-bg-secondary border-border-subtle text-text-muted"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle2 size={10} />
                    ) : step.status === "running" ? (
                      <RefreshCw size={10} className="animate-spin" />
                    ) : (
                      <StepIcon size={10} />
                    )}
                    <span className="hidden sm:inline">{step.title.split(" ").slice(0, 2).join(" ")}</span>
                    <span className="sm:hidden">{idx + 1}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* ─── Chat Messages ─── */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 min-h-[300px] max-h-[500px]">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={14} className="text-gold" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gold text-text-inverse rounded-br-md"
                      : msg.type === "insight"
                      ? "glass-card border border-border-cyan/20 rounded-bl-md"
                      : msg.type === "summary"
                      ? "glass-card border border-semantic-green/20 rounded-bl-md"
                      : "glass-card rounded-bl-md"
                  }`}
                >
                  <p className={`text-sm font-body leading-relaxed ${msg.role === "user" ? "" : "text-text-secondary"}`}>
                    {renderMarkdown(msg.content)}
                  </p>

                  {/* Quick Options */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border-subtle">
                      {msg.options.map((opt, idx) => {
                        const OptIcon = opt.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleQuickOption(opt)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-secondary border border-border-default hover:border-gold/30 hover:bg-gold/5 text-xs font-body text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                          >
                            {OptIcon && <OptIcon size={12} />}
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-cyan" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-gold" />
              </div>
              <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* ─── Input Bar ─── */}
        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-xl p-2 flex items-center gap-2 border border-border-default"
        >
          <div className="flex items-center gap-1.5 px-2">
            <MessageSquare size={14} className="text-text-muted" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              phase === "greeting"
                ? "Tell me about your dataset…"
                : phase === "understanding"
                ? "Describe your analysis goals…"
                : "Ask a question about your data…"
            }
            className="flex-1 bg-transparent border-none outline-none text-sm font-body text-text-primary placeholder:text-text-muted py-2"
          />
          <button
            type="submit"
            disabled={!userInput.trim() || isTyping}
            className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-text-inverse hover:bg-gold-bright disabled:opacity-40 disabled:hover:bg-gold transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

      {/* ─── SMART QUESTIONS SIDEBAR ─── */}
      <AnimatePresence>
        {showQuestionPanel && smartQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 300 }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="hidden lg:block shrink-0 overflow-hidden"
          >
            <div className="glass-card rounded-xl p-4 h-full overflow-y-auto border border-border-cyan/10">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={16} className="text-gold" />
                <h3 className="font-heading font-semibold text-sm text-text-primary">
                  Smart Questions
                </h3>
              </div>
              <p className="text-[11px] text-text-muted font-body mb-4">
                AI-generated questions based on your dataset type and structure. Click any to explore.
              </p>

              {/* Category filters */}
              <div className="flex flex-wrap gap-1 mb-4">
                {(["summary", "trend", "comparison", "prediction", "anomaly"] as const).map((cat) => {
                  const count = smartQuestions.filter(q => q.category === cat).length;
                  if (count === 0) return null;
                  return (
                    <span
                      key={cat}
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${categoryColors[cat]}`}
                    >
                      {categoryLabels[cat]} ({count})
                    </span>
                  );
                })}
              </div>

              {/* Questions List */}
              <div className="space-y-2">
                {smartQuestions.map((sq, idx) => {
                  const SqIcon = sq.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSmartQuestion(sq.question)}
                      className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm group ${categoryColors[sq.category].split(" ").slice(1).join(" ")} hover:border-gold/30`}
                    >
                      <div className="flex items-start gap-2">
                        <SqIcon size={13} className="shrink-0 mt-0.5" />
                        <span className="text-xs font-body text-text-secondary group-hover:text-text-primary leading-relaxed">
                          {sq.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1.5 ml-5">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${categoryColors[sq.category]}`}>
                          {categoryLabels[sq.category]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────── Mock Results / Explanations ─────────── */

function getStepResult(stepId: string, dataset: DetectedDataset): string {
  switch (stepId) {
    case "eda":
      if (dataset.dataCategory === "sales")
        return "Key findings:\n• Average order value: $127.43\n• Revenue range: $12 – $2,340\n• Most orders fall in the $50–$200 range\n• Standard deviation in revenue suggests moderate variability\n• 3 outlier transactions detected above $2,000";
      if (dataset.dataCategory === "hr")
        return "Key findings:\n• Average age: 36.9 years\n• Monthly income range: $1,009 – $19,999\n• 16.1% overall attrition rate\n• Average satisfaction rating: 2.73 / 4\n• Years at company ranges from 0 to 40";
      if (dataset.dataCategory === "marketing")
        return "Key findings:\n• Average CTR: 3.2%\n• Median ROAS: 2.4x\n• Total spend: $1.2M across all campaigns\n• Conversion rate varies from 0.8% to 12.3%\n• Top quartile campaigns outperform by 4.5x";
      return "Key findings:\n• Identified distributions across all numeric columns\n• Mean, median, and mode calculated\n• Standard deviations and variance analyzed\n• 5 potential outlier values flagged for review";
    case "missing":
      return `Handled ${dataset.missingValues} missing values:\n• Used median imputation for numeric columns\n• Used mode imputation for categorical columns\n• All values verified post-imputation`;
    case "correlation":
      if (dataset.dataCategory === "sales")
        return "Strongest correlations found:\n• quantity ↔ total: r = 0.89 (strong positive)\n• discount ↔ total: r = -0.34 (moderate negative)\n• unit_price ↔ total: r = 0.76 (strong positive)\n• shipping ↔ quantity: r = 0.45 (moderate positive)";
      if (dataset.dataCategory === "hr")
        return "Strongest correlations found:\n• monthly_income ↔ years_at_company: r = 0.77 (strong positive)\n• satisfaction ↔ attrition: r = -0.52 (moderate negative)\n• overtime ↔ attrition: r = 0.42 (moderate positive)\n• work_life_balance ↔ satisfaction: r = 0.58";
      return "Correlation analysis complete:\n• Identified 3 strong positive correlations (r > 0.7)\n• Found 2 moderate negative correlations\n• No multicollinearity issues detected";
    case "timeseries":
      if (dataset.dataCategory === "sales")
        return "Time series insights:\n• Clear upward trend (+12% YoY)\n• Strong seasonality — peaks in Nov-Dec\n• Weekly pattern: Mon/Tue are strongest order days\n• Anomaly detected: unusual drop in Feb (potential data gap)";
      if (dataset.dataCategory === "marketing")
        return "Time series insights:\n• Conversion rates trending up +8% over 6 months\n• Seasonal peaks during Q4 holiday campaigns\n• Weekend performance consistently 15% lower\n• Budget shifts correlate with performance changes";
      return "Time series insights:\n• Identified overall trend direction\n• Seasonal patterns detected with regular periodicity\n• No structural breaks found in the time series";
    case "segmentation":
      if (dataset.dataCategory === "sales")
        return "Segment comparison:\n• Electronics: highest avg order value ($234)\n• Clothing: highest volume (38% of orders)\n• West region outperforms by 22%\n• Online channel has 1.8x higher conversion than in-store\n• Credit card most popular (54%), followed by digital wallets (28%)";
      if (dataset.dataCategory === "hr")
        return "Segment comparison:\n• R&D has highest attrition (22%) vs Management (6%)\n• Sales roles show highest overtime rates\n• Satisfaction lowest in Entry-level positions\n• Married employees 40% less likely to leave\n• Education Level 5 has highest income on average";
      return "Segment comparison:\n• Top performing category outperforms by 2.3x\n• Clear differences between segments identified\n• Statistical significance confirmed (p < 0.05) for key differences";
    case "predictive":
      if (dataset.dataCategory === "sales")
        return "Predictive model results:\n• Model: Gradient Boosted Trees\n• R² Score: 0.87 (87% variance explained)\n• Top predictors: quantity, unit_price, category, channel\n• Next quarter forecast: $1.24M (±$48K)\n• Model suggests increasing digital channel allocation";
      if (dataset.dataCategory === "hr")
        return "Predictive model results:\n• Model: Random Forest Classifier\n• Accuracy: 89.2%\n• AUC-ROC: 0.912\n• Top risk factors: overtime, low satisfaction, years since promotion\n• Identified 47 employees at high risk of leaving";
      if (dataset.dataCategory === "marketing")
        return "Predictive model results:\n• Model: XGBoost Regressor\n• R² Score: 0.82\n• Key drivers: audience segment, creative type, spend level\n• Optimal budget split: 40% social, 35% search, 25% display\n• Expected ROAS improvement: +18% with recommended allocation";
      return "Predictive model results:\n• Model accuracy: 84.3%\n• Top 3 features identified by importance\n• Model validation confirms reliable predictions";
    case "report":
      return "Report generated with:\n• Executive summary with key metrics\n• 6 interactive visualizations\n• Detailed findings per analysis step\n• 5 actionable recommendations\n• Ready to share in the Reports section";
    default:
      return "Step completed successfully.";
  }
}

function getStepExplanation(stepId: string, dataset: DetectedDataset): string {
  switch (stepId) {
    case "eda":
      return `**Exploratory Data Analysis (EDA)** is the foundation of any good analysis. It involves:\n\n• **Descriptive statistics** — mean, median, mode, std deviation for each numeric column\n• **Distribution analysis** — understanding how values are spread\n• **Outlier detection** — finding extreme values that might skew results\n• **Data quality check** — ensuring consistency in data types\n\nThis is non-destructive — I'm only reading your data, not changing it. It takes about 15 seconds for a dataset of this size.`;
    case "missing":
      return `**Missing value handling** is crucial because:\n\n• Many analysis methods can't handle gaps in data\n• Missing values can bias your results\n• I'll use **median imputation** for numbers (robust to outliers) and **mode imputation** for categories (most common value)\n• I'll also check if values are **Missing At Random** or if there's a pattern (which could indicate a data collection issue)\n\nYour dataset has ${dataset.missingValues} missing values — a relatively ${dataset.missingValues < 50 ? "small" : "significant"} amount.`;
    case "correlation":
      return `**Correlation analysis** reveals relationships between your numeric variables:\n\n• Values range from -1 (perfect inverse) to +1 (perfect positive)\n• Strong correlations (|r| > 0.7) may indicate redundant features or important relationships\n• I check for **multicollinearity** — when predictors are too related, which can confuse models\n• Results visualized as a heatmap for easy interpretation\n\nThis helps prioritize which columns matter most for your goals.`;
    case "timeseries":
      return `**Time series analysis** decomposes your data over time:\n\n• **Trend** — is the overall direction up, down, or flat?\n• **Seasonality** — are there regular recurring patterns?\n• **Residuals** — what's left after removing trend & seasonality?\n• **Breakpoints** — any sudden shifts in the pattern?\n\nSince your data has a "${dataset.dateCols[0]}" column, I can analyze how your key metrics change over time.`;
    case "segmentation":
      return `**Segment comparison** breaks down your metrics by categories:\n\n• Compare averages, counts, and distributions across groups\n• Run **statistical significance tests** to confirm differences aren't due to chance\n• Identify which segments are top/bottom performers\n• Highlight segments that deviate from the overall trend\n\nYour categorical columns (${dataset.categoricalCols.slice(0, 3).join(", ")}) will be used as segment dimensions.`;
    case "predictive":
      return `**Predictive modeling** uses machine learning to forecast outcomes:\n\n• I'll build a model targeting "${dataset.possibleTarget}" as the variable to predict\n• Algorithms considered: Random Forest, Gradient Boosting, Linear/Logistic Regression\n• I'll split data into training (80%) and testing (20%) sets\n• Feature importance analysis shows which columns drive the predictions\n• Results include accuracy, error rates, and practical interpretations\n\nThis can help you make data-driven decisions and anticipate trends.`;
    case "report":
      return `**Report generation** compiles all analysis into a shareable document:\n\n• Executive summary for stakeholders\n• All charts and visualizations\n• Key findings with confidence levels\n• Actionable recommendations ranked by impact\n• Data quality notes and methodology\n\nThe report will be available in your Reports section and can be exported as PDF or shared with your team.`;
    default:
      return "This step performs additional analysis on your dataset.";
  }
}

function getSmartAnswer(question: string, dataset: DetectedDataset): string {
  const lower = question.toLowerCase();

  if (lower.includes("top") && lower.includes("product")) {
    return "Based on revenue:\n\n1. **Premium Laptop Pro** — $234,560 (8.4% of total)\n2. **Wireless Headphones X** — $189,230 (6.8%)\n3. **Smart Watch Ultra** — $156,780 (5.6%)\n4. **Ergonomic Keyboard** — $134,120 (4.8%)\n5. **USB-C Hub Pro** — $112,340 (4.0%)\n\nThese top 5 products account for **29.6%** of total revenue. The top performer outearns the #5 product by 2.1x.";
  }
  if (lower.includes("trend") || lower.includes("monthly")) {
    return "The overall trend shows a **+12.3% year-over-year growth**.\n\n• **Strongest months**: November (+34%) and December (+28%) — clear holiday seasonality\n• **Weakest months**: February (-8%) and January (-5%) — post-holiday dip\n• **Q3** showed accelerating growth (+18% vs Q2), driven by back-to-school demand\n• **Recommendation**: Increase inventory 25% before Q4 to capture holiday upside";
  }
  if (lower.includes("attrition") || lower.includes("leave") || lower.includes("churn")) {
    return "Top factors driving attrition (ranked by importance):\n\n1. **Overtime** — employees working OT are 3.2x more likely to leave\n2. **Job satisfaction < 2** — 38% attrition rate vs 8% for satisfied employees\n3. **Years since last promotion > 5** — 26% attrition rate\n4. **Distance from home > 20 miles** — 21% higher risk\n5. **Monthly income below median** — especially in Sales & R&D roles\n\n**47 employees** are currently flagged as high-risk based on these factors.";
  }
  if (lower.includes("channel") || lower.includes("roas")) {
    return "Channel performance (ROAS ranking):\n\n1. **Email** — ROAS 4.2x (highest efficiency)\n2. **Organic Social** — ROAS 3.1x\n3. **Paid Search** — ROAS 2.8x (highest volume)\n4. **Display** — ROAS 1.9x\n5. **Paid Social** — ROAS 1.6x\n\n**Recommendation**: Shift 15% of Display budget to Email and Organic Social for an estimated +22% overall ROAS improvement.";
  }
  if (lower.includes("predict") || lower.includes("forecast")) {
    return "Using the trained predictive model:\n\n• **Next month forecast**: ~$412K revenue (95% CI: $385K–$440K)\n• **Next quarter**: ~$1.24M (based on seasonal patterns + growth trend)\n• **Key drivers**: Product category mix, channel allocation, and discount strategy\n• **Confidence**: Model explains 87% of historical variance\n\nThe model suggests maintaining current growth requires keeping customer acquisition cost below $45.";
  }
  if (lower.includes("anomal") || lower.includes("unusual") || lower.includes("spike") || lower.includes("outlier")) {
    return "Anomalies detected:\n\n⚠️ **3 significant anomalies found**:\n\n1. **Feb 14–18**: Revenue dropped 42% — coincides with a site outage reported in logs\n2. **Aug 23**: Single transaction of $12,340 — potential bulk corporate order (verify manually)\n3. **Oct 1–3**: 3x normal order volume — likely a flash sale event that wasn't tagged\n\nThese outliers affect trend calculations. I'd recommend tagging them before running predictive models.";
  }
  if (lower.includes("segment") || lower.includes("customer")) {
    return "Customer segmentation analysis reveals 4 distinct groups:\n\n• **High-Value Loyalists** (18%): Avg spend $340, 6.2 orders/year — nurture with VIP programs\n• **Growing Buyers** (32%): Avg spend $120, increasing frequency — opportunity for upsell\n• **Occasional Shoppers** (35%): Avg spend $65, 1.8 orders/year — re-engagement campaigns needed\n• **At-Risk Customers** (15%): Declining activity, 90+ days since last order — win-back priority";
  }
  if (lower.includes("department") || lower.includes("compare")) {
    return "Department comparison:\n\n| Department | Avg Income | Attrition | Satisfaction |\n|-----------|-----------|-----------|-------------|\n| R&D | $6,281 | 22% | 2.6 |\n| Sales | $6,960 | 18% | 2.7 |\n| HR | $6,654 | 12% | 2.9 |\n| Management | $17,201 | 6% | 3.4 |\n\nR&D has the highest attrition despite comparable pay. Likely driven by overtime expectations and limited promotion paths.";
  }

  // Generic response
  return `I analyzed your ${dataset.rows.toLocaleString()}-row dataset and found several interesting patterns related to your question:\n\n• The key metric shows a **moderate positive trend** over the analysis period\n• **3 segments** stand out with statistically significant differences\n• There's a potential correlation worth investigating further\n\nWould you like me to create a visualization for this, or dig deeper into any specific aspect?`;
}
