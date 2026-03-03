"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Send,
  Bot,
  User,
  Paperclip,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  TrendingUp,
  PieChart,
  FileText,
  Loader2,
  Lightbulb,
  Database,
  RotateCcw,
  MessageSquare,
  Upload,
  X,
  Check,
  FileSpreadsheet,
  Trash2,
} from "lucide-react";

/* ─── Types ─── */
interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  chartType?: "bar" | "line" | "pie" | "table";
  attachment?: { name: string; size: string; type: string };
}

interface SavedConversation {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
  dataset?: string;
}

/* ─── Quick Prompts ─── */
const quickPrompts = [
  { label: "Show revenue trends", icon: TrendingUp },
  { label: "Top 10 customers by spend", icon: BarChart3 },
  { label: "Create a distribution chart", icon: PieChart },
  { label: "Generate executive summary", icon: FileText },
];

const ACCEPTED_FILE_TYPES = ".csv,.xlsx,.xls,.json,.tsv,.parquet";
const MAX_FILE_SIZE_MB = 50;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function generateTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "Untitled Chat";
  const text = firstUser.content.replace(/^Uploaded dataset:\s*/i, "");
  return text.length > 40 ? text.slice(0, 40) + "…" : text;
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ─── Mock chart placeholder ─── */
function MockChart({ type }: { type: string }) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-4 mt-3">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={14} className="text-cyan" />
        <span className="text-xs font-mono text-text-muted">
          Interactive {type} chart
        </span>
      </div>
      <div className="h-40 flex items-end gap-2 px-2">
        {[65, 40, 80, 55, 90, 45, 72, 60, 85, 50, 95, 68].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
              className="w-full rounded-t-sm bg-gradient-to-t from-gold/60 to-gold"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-mono text-text-muted px-1">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
        <span>Oct</span>
        <span>Nov</span>
        <span>Dec</span>
      </div>
    </div>
  );
}

/* ─── Dataset attachment bubble ─── */
function DatasetBubble({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-cyan/20 bg-cyan/5 px-4 py-3 mb-1">
      <div className="w-9 h-9 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0">
        <FileSpreadsheet size={18} className="text-cyan" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-body font-medium text-text-primary truncate">
          {name}
        </p>
        <p className="text-[11px] font-mono text-text-muted">{size}</p>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] font-body text-semantic-green">
        <Check size={12} />
        <span>Uploaded</span>
      </div>
    </div>
  );
}

/* ─── Thinking indicator ─── */
function ThinkingBubble() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-cyan/10 border border-border-cyan flex items-center justify-center shrink-0">
        <Bot size={16} className="text-cyan" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-bg-elevated border border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2">
          <Loader2 size={14} className="text-cyan animate-spin" />
          <span className="text-sm text-text-muted font-body">
            Analyzing your data…
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function AIAgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [activeDataset, setActiveDataset] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [savedChats, setSavedChats] = useState<SavedConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  /* ─── File handling ─── */
  const handleFileSelect = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    setPendingFile(file);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = "";
  };

  const uploadPendingFile = useCallback(() => {
    if (!pendingFile) return;
    const fileName = pendingFile.name;
    const fileSize = formatFileSize(pendingFile.size);

    setActiveDataset(fileName);

    const uploadMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: `Uploaded dataset: ${fileName}`,
      timestamp: new Date(),
      attachment: {
        name: fileName,
        size: fileSize,
        type: pendingFile.type || "unknown",
      },
    };
    setMessages((prev) => [...prev, uploadMsg]);
    setPendingFile(null);

    // Simulate AI acknowledgement
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      const ext = fileName.split(".").pop()?.toLowerCase() || "file";
      const rows = Math.floor(Math.random() * 9000) + 1000;
      const cols = Math.floor(Math.random() * 15) + 5;
      const ackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've loaded **${fileName}** (${fileSize}). Here's a quick preview:\n\n**Format:** ${ext.toUpperCase()}\n**Rows:** ${rows.toLocaleString()}\n**Columns:** ${cols}\n\nThe dataset is ready for analysis. Ask me anything, or try one of these:\n- "Show me the key trends"\n- "Find anomalies"\n- "Generate a summary report"`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, ackMsg]);
    }, 1500);
  }, [pendingFile]);

  const removePendingFile = () => setPendingFile(null);

  /* ─── Drag & drop ─── */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  /* ─── Conversation management ─── */
  const saveCurrentChat = useCallback(() => {
    if (messages.length === 0) return null;
    const chatId = activeChatId || `chat-${Date.now()}`;
    const existing = savedChats.find((c) => c.id === chatId);
    const conv: SavedConversation = {
      id: chatId,
      title: existing?.title || generateTitle(messages),
      date: new Date().toISOString(),
      messages: [...messages],
      dataset: activeDataset || undefined,
    };
    setSavedChats((prev) => {
      const filtered = prev.filter((c) => c.id !== chatId);
      return [conv, ...filtered];
    });
    return chatId;
  }, [messages, activeChatId, savedChats, activeDataset]);

  const handleNewChat = useCallback(() => {
    saveCurrentChat();
    setMessages([]);
    setInput("");
    setIsThinking(false);
    setActiveChatId(null);
    setActiveDataset(null);
    setPendingFile(null);
    inputRef.current?.focus();
  }, [saveCurrentChat]);

  const handleLoadChat = useCallback(
    (conv: SavedConversation) => {
      if (messages.length > 0 && activeChatId !== conv.id) {
        saveCurrentChat();
      }
      setMessages(conv.messages);
      setActiveChatId(conv.id);
      setActiveDataset(conv.dataset || null);
      setPendingFile(null);
      setInput("");
    },
    [messages, activeChatId, saveCurrentChat]
  );

  const handleDeleteChat = useCallback(
    (chatId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setSavedChats((prev) => prev.filter((c) => c.id !== chatId));
      if (activeChatId === chatId) {
        setMessages([]);
        setActiveChatId(null);
        setActiveDataset(null);
      }
    },
    [activeChatId]
  );

  /* ─── AI response ─── */
  const simulateResponse = useCallback((userMsg: string) => {
    setIsThinking(true);
    const lower = userMsg.toLowerCase();
    const hasChart =
      lower.includes("chart") ||
      lower.includes("trend") ||
      lower.includes("revenue") ||
      lower.includes("distribution");

    setTimeout(() => {
      setIsThinking(false);
      const response: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: hasChart
          ? "Here's the analysis based on your data. The monthly revenue trend shows a consistent upward trajectory with Q4 showing the strongest performance.\n\n**Key Findings:**\n- Average monthly revenue: $124,500\n- YoY growth rate: 23.4%\n- Highest month: November ($152,300)\n- Lowest month: February ($87,200)"
          : "Based on your dataset, I found some interesting patterns. The top-performing customer segments are **Enterprise** (42% of revenue) and **Mid-Market** (31%). The remaining 27% comes from SMB accounts.\n\nWould you like me to create a detailed breakdown or run a predictive model?",
        timestamp: new Date(),
        chartType: hasChart ? "bar" : undefined,
      };
      setMessages((prev) => [...prev, response]);
    }, 2000);
  }, []);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text && !pendingFile) return;
    if (isThinking) return;

    // If there's a pending file, upload it first
    if (pendingFile) {
      uploadPendingFile();
      if (!text) return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    simulateResponse(text);
  }, [input, isThinking, pendingFile, simulateResponse, uploadPendingFile]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (label: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: label,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    simulateResponse(label);
  };

  const isEmpty = messages.length === 0 && !isThinking;

  /* ═══════════════════════════════════════════ RENDER ════════════ */
  return (
    <div className="flex h-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* ─── Conversation History Panel ─── */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden md:flex flex-col border-r border-border-subtle bg-bg-primary shrink-0 overflow-hidden"
          >
            <div className="p-4 border-b border-border-subtle">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={handleNewChat}
              >
                <MessageSquare size={14} /> New Chat
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {savedChats.length === 0 && (
                <div className="px-3 py-8 text-center">
                  <MessageSquare
                    size={20}
                    className="mx-auto text-text-muted mb-2 opacity-40"
                  />
                  <p className="text-xs text-text-muted font-body leading-relaxed">
                    No saved chats yet.
                    <br />
                    Start a conversation and click
                    <br />
                    &ldquo;New Chat&rdquo; to save it.
                  </p>
                </div>
              )}

              {savedChats.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleLoadChat(conv)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer group relative ${
                    activeChatId === conv.id
                      ? "bg-cyan/10 border border-cyan/20"
                      : "hover:bg-bg-elevated border border-transparent"
                  }`}
                >
                  <p
                    className={`text-sm font-body truncate pr-6 transition-colors ${
                      activeChatId === conv.id
                        ? "text-cyan font-medium"
                        : "text-text-primary group-hover:text-gold"
                    }`}
                  >
                    {conv.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-text-muted font-body">
                      {formatRelativeDate(new Date(conv.date))}
                    </span>
                    <span className="text-[10px] text-text-muted">·</span>
                    <span className="text-[10px] text-text-muted font-body">
                      {conv.messages.length} msgs
                    </span>
                    {conv.dataset && (
                      <>
                        <span className="text-[10px] text-text-muted">·</span>
                        <span className="text-[10px] text-cyan/60 font-mono truncate max-w-[80px]">
                          {conv.dataset}
                        </span>
                      </>
                    )}
                  </div>
                  {/* Delete */}
                  <button
                    onClick={(e) => handleDeleteChat(conv.id, e)}
                    className="absolute top-2.5 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-semantic-red/10 text-text-muted hover:text-semantic-red transition-all cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Chat Area ─── */}
      <div
        className={`flex-1 flex flex-col min-w-0 relative ${
          isDragOver ? "ring-2 ring-cyan/40 ring-inset" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-bg-primary/90 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-cyan/40 bg-cyan/5">
                <Upload size={32} className="text-cyan" />
                <p className="text-sm font-body text-text-primary font-medium">
                  Drop your dataset here
                </p>
                <p className="text-xs text-text-muted font-body">
                  CSV, Excel, JSON, TSV, Parquet — up to {MAX_FILE_SIZE_MB}MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Top Bar */}
        <div className="shrink-0 h-12 flex items-center justify-between px-4 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="hidden md:flex p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted cursor-pointer transition-colors"
            >
              <MessageSquare size={16} />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-semantic-green pulse-cyan" />
              <span className="text-xs font-body text-text-secondary">
                AI Agent
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
            <Database size={12} />
            <span className="truncate max-w-[200px]">
              {activeDataset
                ? `Dataset: ${activeDataset}`
                : "No dataset loaded"}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          {isEmpty ? (
            /* ───────── Empty State ───────── */
            <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan/10 border border-border-cyan flex items-center justify-center mb-5">
                <Bot size={28} className="text-cyan" />
              </div>
              <h2 className="font-heading font-bold text-xl text-text-primary mb-2">
                Ask me anything about your data
              </h2>
              <p className="text-sm text-text-secondary font-body mb-6">
                I can analyze trends, generate charts, build predictions, and
                create reports — all in natural language.
              </p>

              {/* Upload CTA */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 w-full px-5 py-4 rounded-xl bg-gradient-to-r from-cyan/5 to-transparent border border-dashed border-cyan/30 hover:border-cyan/50 hover:bg-cyan/10 transition-all cursor-pointer group mb-6"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Upload size={18} className="text-cyan" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-body font-medium text-text-primary">
                    Upload a dataset to get started
                  </p>
                  <p className="text-[11px] text-text-muted font-body">
                    CSV, Excel, JSON, TSV, Parquet — up to {MAX_FILE_SIZE_MB}MB
                  </p>
                </div>
              </button>

              {/* Quick Prompt Grid */}
              <div className="grid grid-cols-2 gap-3 w-full">
                {quickPrompts.map((prompt, idx) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuickPrompt(prompt.label)}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-bg-secondary border border-border-default hover:border-cyan/30 hover:bg-cyan/5 transition-all cursor-pointer text-left group"
                    >
                      <Icon size={16} className="text-cyan shrink-0" />
                      <span className="text-xs font-body text-text-secondary group-hover:text-text-primary transition-colors">
                        {prompt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tip */}
              <div className="mt-8 flex items-center gap-2 text-[11px] text-text-muted font-body">
                <Lightbulb size={12} className="text-gold" />
                <span>
                  Tip: Upload a dataset or drag &amp; drop a file to start
                  analyzing.
                </span>
              </div>
            </div>
          ) : (
            /* ───────── Message List ───────── */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user"
                        ? "bg-gold/10 border border-border-gold"
                        : "bg-cyan/10 border border-border-cyan"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={16} className="text-gold" />
                    ) : (
                      <Bot size={16} className="text-cyan" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "rounded-tr-sm bg-gold/10 border border-border-gold"
                        : "rounded-tl-sm bg-bg-elevated border border-border-subtle"
                    }`}
                  >
                    {/* Attachment */}
                    {msg.attachment && (
                      <DatasetBubble
                        name={msg.attachment.name}
                        size={msg.attachment.size}
                      />
                    )}

                    {/* Hide raw text for pure upload messages */}
                    {!(
                      msg.attachment &&
                      msg.content.startsWith("Uploaded dataset:")
                    ) && (
                      <p className="text-sm font-body text-text-primary whitespace-pre-wrap leading-relaxed">
                        {msg.content.split("**").map((part, i) =>
                          i % 2 === 1 ? (
                            <strong
                              key={i}
                              className="font-semibold text-text-primary"
                            >
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    )}

                    {/* Chart */}
                    {msg.chartType && <MockChart type={msg.chartType} />}

                    {/* Actions (assistant only) */}
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border-subtle">
                        <button className="p-1.5 rounded-md hover:bg-bg-secondary text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                          <Copy size={13} />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-bg-secondary text-text-muted hover:text-semantic-green transition-colors cursor-pointer">
                          <ThumbsUp size={13} />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-bg-secondary text-text-muted hover:text-semantic-red transition-colors cursor-pointer">
                          <ThumbsDown size={13} />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-bg-secondary text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                          <RotateCcw size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isThinking && <ThinkingBubble />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ─── Input Area ─── */}
        <div className="shrink-0 border-t border-border-subtle px-4 lg:px-8 py-3 bg-bg-primary/80 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            {/* Pending file chip */}
            <AnimatePresence>
              {pendingFile && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="mb-2 flex items-center gap-2 bg-cyan/5 border border-cyan/20 rounded-xl px-3 py-2"
                >
                  <FileSpreadsheet size={16} className="text-cyan shrink-0" />
                  <span className="text-xs font-body text-text-primary truncate flex-1">
                    {pendingFile.name}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted shrink-0">
                    {formatFileSize(pendingFile.size)}
                  </span>
                  <button
                    onClick={removePendingFile}
                    className="p-1 rounded-md hover:bg-semantic-red/10 text-text-muted hover:text-semantic-red transition-colors cursor-pointer shrink-0"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-end gap-2 bg-bg-secondary border border-border-default rounded-2xl px-4 py-2 focus-within:border-cyan/40 transition-colors">
              {/* Upload button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 mb-0.5 ${
                  pendingFile
                    ? "text-cyan bg-cyan/10"
                    : "text-text-muted hover:text-cyan hover:bg-cyan/5"
                }`}
                title="Upload dataset (CSV, Excel, JSON)"
              >
                <Paperclip size={18} />
              </button>

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  activeDataset
                    ? `Ask about ${activeDataset}…`
                    : "Upload a dataset or ask anything…"
                }
                rows={1}
                className="flex-1 bg-transparent text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none resize-none min-h-[24px] max-h-[120px] py-1"
                style={{ height: "auto" }}
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = Math.min(t.scrollHeight, 120) + "px";
                }}
              />

              <button
                onClick={handleSend}
                disabled={(!input.trim() && !pendingFile) || isThinking}
                className="p-2 rounded-xl bg-gold text-text-inverse hover:bg-gold-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 mb-0.5"
              >
                <Send size={16} />
              </button>
            </div>

            <p className="text-[10px] text-text-muted font-body text-center mt-2">
              AutolystAI can make mistakes. Verify critical insights with raw
              data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
