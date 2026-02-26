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
  ChevronDown,
  Lightbulb,
  Database,
  RotateCcw,
  MessageSquare,
} from "lucide-react";

/* ─── Types ─── */
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  chartType?: "bar" | "line" | "pie" | "table";
  isThinking?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  date: string;
  messageCount: number;
}

/* ─── Quick Prompts ─── */
const quickPrompts = [
  { label: "Show revenue trends", icon: TrendingUp },
  { label: "Top 10 customers by spend", icon: BarChart3 },
  { label: "Create a distribution chart", icon: PieChart },
  { label: "Generate executive summary", icon: FileText },
];

/* ─── Past Conversations (mock) ─── */
const pastConversations: Conversation[] = [
  { id: "1", title: "Q4 Revenue Analysis", date: "Today", messageCount: 12 },
  { id: "2", title: "Customer Segmentation", date: "Yesterday", messageCount: 8 },
  { id: "3", title: "Churn Drivers Deep-Dive", date: "Dec 15", messageCount: 23 },
  { id: "4", title: "Marketing ROI Analysis", date: "Dec 12", messageCount: 6 },
];

/* ─── Mock chart placeholder ─── */
function MockChart({ type }: { type: string }) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-4 mt-3">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={14} className="text-cyan" />
        <span className="text-xs font-mono text-text-muted">Interactive {type} chart</span>
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
        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
        <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
        <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
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
          <span className="text-sm text-text-muted font-body">Analyzing your data…</span>
        </div>
      </div>
    </div>
  );
}

export default function AIAgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  const simulateResponse = useCallback((userMsg: string) => {
    setIsThinking(true);
    const hasChart = userMsg.toLowerCase().includes("chart") || 
                     userMsg.toLowerCase().includes("trend") ||
                     userMsg.toLowerCase().includes("revenue") ||
                     userMsg.toLowerCase().includes("distribution");
    
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
    if (!text || isThinking) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    simulateResponse(text);
  }, [input, isThinking, simulateResponse]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (label: string) => {
    setInput(label);
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

  return (
    <div className="flex h-full">
      {/* ─── Conversation History Panel ─── */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden md:flex flex-col border-r border-border-subtle bg-bg-primary shrink-0 overflow-hidden"
          >
            <div className="p-4 border-b border-border-subtle">
              <Button variant="primary" size="sm" className="w-full">
                <MessageSquare size={14} /> New Chat
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {pastConversations.map((conv) => (
                <button
                  key={conv.id}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-bg-elevated transition-colors cursor-pointer group"
                >
                  <p className="text-sm font-body text-text-primary truncate group-hover:text-gold transition-colors">
                    {conv.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-text-muted font-body">{conv.date}</span>
                    <span className="text-[10px] text-text-muted">•</span>
                    <span className="text-[10px] text-text-muted font-body">{conv.messageCount} msgs</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Chat Area ─── */}
      <div className="flex-1 flex flex-col min-w-0">
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
              <span className="text-xs font-body text-text-secondary">AI Agent</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
            <Database size={12} />
            <span>Active dataset: E-Commerce Sales</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          {isEmpty ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan/10 border border-border-cyan flex items-center justify-center mb-5">
                <Bot size={28} className="text-cyan" />
              </div>
              <h2 className="font-heading font-bold text-xl text-text-primary mb-2">
                Ask me anything about your data
              </h2>
              <p className="text-sm text-text-secondary font-body mb-8">
                I can analyze trends, generate charts, build predictions, and create reports — all in natural language.
              </p>

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

              {/* Smart Tips */}
              <div className="mt-8 flex items-center gap-2 text-[11px] text-text-muted font-body">
                <Lightbulb size={12} className="text-gold" />
                <span>Tip: You can ask follow-up questions — the AI remembers context.</span>
              </div>
            </div>
          ) : (
            /* Message List */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
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
                    <p className="text-sm font-body text-text-primary whitespace-pre-wrap leading-relaxed">
                      {msg.content.split("**").map((part, i) =>
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
            <div className="flex items-end gap-2 bg-bg-secondary border border-border-default rounded-2xl px-4 py-2 focus-within:border-cyan/40 transition-colors">
              <button className="p-1.5 text-text-muted hover:text-text-secondary transition-colors cursor-pointer shrink-0 mb-0.5">
                <Paperclip size={18} />
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your data…"
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
                disabled={!input.trim() || isThinking}
                className="p-2 rounded-xl bg-gold text-text-inverse hover:bg-gold-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 mb-0.5"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-text-muted font-body text-center mt-2">
              AutolystAI can make mistakes. Verify critical insights with raw data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
