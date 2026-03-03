"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Palette,
  Bell,
  Key,
  Shield,
  Users,
  CreditCard,
  LogOut,
  Camera,
  Sun,
  Moon,
  Monitor,
  Check,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Crown,
  Sparkles,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";
import { useCommunicationLevel, type CommunicationLevel } from "@/components/providers/communication-provider";

/* ─── Settings Tabs ─── */
const tabs = [
  { key: "profile", label: "Profile", icon: User },
  { key: "ai", label: "AI Preferences", icon: Sparkles },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "api", label: "API Keys", icon: Key },
  { key: "team", label: "Team", icon: Users },
  { key: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, setTheme } = useTheme();
  const { level: commLevel, setLevel: setCommLevel } = useCommunicationLevel();
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      <h1 className="font-heading font-bold text-2xl text-text-primary mb-6">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-52 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-gold/10 text-gold font-medium"
                      : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
            <div className="border-t border-border-subtle my-2 hidden lg:block" />
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body text-semantic-red hover:bg-semantic-red/5 transition-all cursor-pointer">
              <LogOut size={16} /> Sign Out
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* ─── Profile ─── */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-heading font-semibold text-base text-text-primary mb-5">
                  Profile Information
                </h3>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-border-gold flex items-center justify-center">
                      <User size={28} className="text-gold" />
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-bg-elevated border border-border-default flex items-center justify-center cursor-pointer hover:border-border-strong transition-colors">
                      <Camera size={12} className="text-text-muted" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-body font-medium text-text-primary">Upload Photo</p>
                    <p className="text-xs text-text-muted font-body">PNG or JPG, max 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Alex Johnson"
                      className="w-full h-10 px-3 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="alex@company.com"
                      className="w-full h-10 px-3 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">
                      Job Title
                    </label>
                    <input
                      type="text"
                      defaultValue="Data Analyst"
                      className="w-full h-10 px-3 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-medium text-text-secondary mb-1.5">
                      Industry
                    </label>
                    <select className="w-full h-10 px-3 rounded-xl bg-bg-secondary border border-border-default text-sm font-body text-text-primary focus:outline-none focus:border-gold transition-colors cursor-pointer">
                      <option>Retail</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Marketing</option>
                      <option>HR</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button size="sm">Save Changes</Button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="glass-card rounded-xl p-6 border-l-2 border-l-semantic-red">
                <h3 className="font-heading font-semibold text-base text-semantic-red mb-2">
                  Danger Zone
                </h3>
                <p className="text-sm text-text-secondary font-body mb-4">
                  Permanently delete your account and all associated data.
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </motion.div>
          )}

          {/* ─── AI Preferences ─── */}
          {activeTab === "ai" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-heading font-semibold text-base text-text-primary mb-2">
                  Communication Level
                </h3>
                <p className="text-sm text-text-secondary font-body mb-5">
                  Choose how the AI explains its findings. This changes the language, detail level, and format across all insights, reports, and chat responses.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {([
                    {
                      value: "executive" as CommunicationLevel,
                      label: "Executive",
                      icon: Crown,
                      desc: "Bottom-line first. Short bullets, key metrics, action items only.",
                      example: "Revenue grew 12.3% to $337K. Churn risk on 3rd largest customer — recommend immediate retention outreach.",
                      accent: "gold",
                    },
                    {
                      value: "analyst" as CommunicationLevel,
                      label: "Analyst",
                      icon: BarChart3,
                      desc: "Detailed analysis with methodology, statistical context, and technical depth.",
                      example: "Pearson correlation r=0.89 between price and volume. Regression shows $1 price increase reduces units by 12.3 (p<0.001, R²=0.76).",
                      accent: "cyan",
                    },
                    {
                      value: "storyteller" as CommunicationLevel,
                      label: "Storyteller",
                      icon: BookOpen,
                      desc: "Narrative format. Explains context, uses analogies, tells the story behind the data.",
                      example: "Imagine walking into your West Coast warehouse and discovering your best-selling product is priced $6 less than everywhere else...",
                      accent: "violet",
                    },
                  ]).map((opt) => {
                    const Icon = opt.icon;
                    const isActive = commLevel === opt.value;
                    const borderActive = opt.accent === "gold" ? "border-gold bg-gold/5" : opt.accent === "cyan" ? "border-cyan bg-cyan/5" : "border-violet bg-violet/5";
                    const iconActive = opt.accent === "gold" ? "text-gold" : opt.accent === "cyan" ? "text-cyan" : "text-violet";
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setCommLevel(opt.value)}
                        className={`rounded-xl border p-5 text-left transition-all cursor-pointer ${
                          isActive ? borderActive : "border-border-default hover:border-border-strong"
                        }`}
                      >
                        <Icon size={22} className={isActive ? iconActive + " mb-3" : "text-text-muted mb-3"} />
                        <p className={`text-sm font-body font-semibold mb-1 ${isActive ? iconActive : "text-text-primary"}`}>
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-text-muted font-body mb-3 leading-relaxed">
                          {opt.desc}
                        </p>
                        <div className="rounded-lg bg-bg-secondary/80 p-2.5 border border-border-subtle">
                          <p className="text-[10px] font-mono text-text-muted mb-1">Example output:</p>
                          <p className="text-[11px] font-body text-text-secondary italic leading-relaxed">
                            &ldquo;{opt.example}&rdquo;
                          </p>
                        </div>
                        {isActive && (
                          <div className="mt-3 flex items-center justify-center">
                            <Check size={14} className={iconActive} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Auto-Insights Preferences */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-heading font-semibold text-base text-text-primary mb-5">
                  Auto-Insights
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Show auto-insights after upload", desc: "Automatically surface surprise findings when you upload a dataset", default: true },
                    { label: "Show quick answers", desc: "Display instant one-line answers to common questions", default: true },
                    { label: "Enable 'Second Brain' memory", desc: "AI remembers your past analyses to give better recommendations over time", default: true },
                    { label: "Proactive anomaly alerts", desc: "Get notified when AI detects unusual patterns in your data", default: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-body text-text-primary">{item.label}</p>
                        <p className="text-xs text-text-muted font-body">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer">
                        <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                        <div className="w-10 h-5 bg-bg-elevated rounded-full peer-checked:bg-gold/80 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Appearance ─── */}
          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-6"
            >
              <h3 className="font-heading font-semibold text-base text-text-primary mb-5">
                Theme Preferences
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "dark", label: "Dark", icon: Moon, desc: "Deep space interface" },
                  { value: "light", label: "Light", icon: Sun, desc: "Clean bright interface" },
                  { value: "system", label: "System", icon: Monitor, desc: "Match OS setting" },
                ] as const).map((opt) => {
                  const Icon = opt.icon;
                  const isActive = theme === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value as "dark" | "light")}
                      className={`rounded-xl border p-5 text-center transition-all cursor-pointer ${
                        isActive
                          ? "border-gold bg-gold/5"
                          : "border-border-default hover:border-border-strong"
                      }`}
                    >
                      <Icon size={24} className={isActive ? "text-gold mx-auto" : "text-text-muted mx-auto"} />
                      <p className={`text-sm font-body font-medium mt-2 ${isActive ? "text-gold" : "text-text-primary"}`}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-text-muted font-body mt-0.5">{opt.desc}</p>
                      {isActive && (
                        <div className="mt-2">
                          <Check size={14} className="text-gold mx-auto" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── Notifications ─── */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-6"
            >
              <h3 className="font-heading font-semibold text-base text-text-primary mb-5">
                Notification Preferences
              </h3>

              <div className="space-y-4">
                {[
                  { label: "Analysis completed", desc: "Get notified when an analysis run finishes", default: true },
                  { label: "AI Agent insights", desc: "Receive proactive insights from the AI", default: true },
                  { label: "Model training complete", desc: "Notification when AutoML finishes", default: true },
                  { label: "Report generation", desc: "When scheduled reports are ready", default: false },
                  { label: "Team activity", desc: "When team members share analyses or datasets", default: false },
                  { label: "Product updates", desc: "New features and platform announcements", default: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-body text-text-primary">{item.label}</p>
                      <p className="text-xs text-text-muted font-body">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                      <div className="w-10 h-5 bg-bg-elevated rounded-full peer-checked:bg-gold/80 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── API Keys ─── */}
          {activeTab === "api" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading font-semibold text-base text-text-primary">
                    API Keys
                  </h3>
                  <Button size="sm">
                    <Plus size={14} /> Create Key
                  </Button>
                </div>

                {/* Existing Key */}
                <div className="rounded-xl bg-bg-secondary border border-border-default p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Key size={14} className="text-gold" />
                      <span className="text-sm font-body font-medium text-text-primary">
                        Production Key
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-text-muted">Created Dec 1, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-bg-elevated rounded-lg px-3 py-2 text-xs font-mono text-text-secondary">
                      {showApiKey ? "sk-autolyst-2x98fj3k4m5n6p7q8r9s0t" : "sk-autolyst-••••••••••••••••••••"}
                    </code>
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted cursor-pointer transition-colors"
                    >
                      {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted cursor-pointer transition-colors">
                      <Copy size={14} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-semantic-red cursor-pointer transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Team ─── */}
          {activeTab === "team" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-semibold text-base text-text-primary">
                  Team Members
                </h3>
                <Button size="sm">
                  <Plus size={14} /> Invite
                </Button>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Alex Johnson", email: "alex@company.com", role: "Admin", isYou: true },
                  { name: "Sarah Chen", email: "sarah@company.com", role: "Analyst", isYou: false },
                  { name: "Mike Rodriguez", email: "mike@company.com", role: "Viewer", isYou: false },
                ].map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-border-subtle last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold/10 border border-border-gold flex items-center justify-center">
                        <User size={16} className="text-gold" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-body font-medium text-text-primary">{member.name}</p>
                          {member.isYou && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gold/10 text-gold">You</span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted font-body">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                          member.role === "Admin"
                            ? "bg-gold/10 text-gold"
                            : member.role === "Analyst"
                            ? "bg-cyan/10 text-cyan"
                            : "bg-bg-elevated text-text-muted"
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── Billing ─── */}
          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass-card rounded-xl p-6 border-t-2 border-t-gold">
                <div className="flex items-center gap-2 mb-3">
                  <Crown size={18} className="text-gold" />
                  <h3 className="font-heading font-semibold text-base text-text-primary">
                    Current Plan
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-heading font-bold text-text-primary">
                      Pro Plan
                    </p>
                    <p className="text-sm text-text-secondary font-body">
                      $29/month • Renews Jan 15, 2025
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Manage Plan
                  </Button>
                </div>
              </div>

              {/* Usage */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-heading font-semibold text-base text-text-primary mb-4">
                  Usage This Month
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "AI Agent Queries", used: 142, limit: 500 },
                    { label: "Datasets", used: 8, limit: 25 },
                    { label: "Reports Generated", used: 5, limit: 50 },
                    { label: "AutoML Models", used: 2, limit: 10 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-body text-text-primary">{item.label}</span>
                        <span className="text-xs font-mono text-text-muted">
                          {item.used}/{item.limit}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.used / item.limit > 0.8
                              ? "bg-semantic-red"
                              : item.used / item.limit > 0.5
                              ? "bg-semantic-amber"
                              : "bg-semantic-green"
                          }`}
                          style={{ width: `${(item.used / item.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
