"use client";

import { useState, useRef, useEffect, createContext, useContext, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { useTheme } from "@/components/providers/theme-provider";
import {
  LayoutDashboard,
  Bot,
  BarChart3,
  Brain,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  User,
  Sparkles,
  BookOpen,
  Crown,
} from "lucide-react";
import { useCommunicationLevel } from "@/components/providers/communication-provider";

/* ─── Sidebar Context ─── */
const SidebarContext = createContext({ collapsed: false });
export const useSidebar = () => useContext(SidebarContext);

/* ─── Nav Links ─── */
const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/agent", icon: Bot, label: "AI Agent" },
  { href: "/dashboard/analysis", icon: BarChart3, label: "Analysis" },
  { href: "/dashboard/predictions", icon: Brain, label: "Predictions" },
  { href: "/dashboard/reports", icon: FileText, label: "Reports" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { level: commLevel } = useCommunicationLevel();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const commLevelConfig = {
    executive: { label: "Executive", icon: Crown, color: "text-gold", bg: "bg-gold/10" },
    analyst: { label: "Analyst", icon: BarChart3, color: "text-cyan", bg: "bg-cyan/10" },
    storyteller: { label: "Storyteller", icon: BookOpen, color: "text-violet", bg: "bg-violet/10" },
  };
  const currentComm = commLevelConfig[commLevel];
  const CommIcon = currentComm.icon;

  const sidebarW = collapsed ? "w-[72px]" : "w-[260px]";

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <div className="relative flex h-screen overflow-hidden bg-bg-void">
        {/* ─── SIDEBAR (desktop) ─── */}
        <aside
          className={`hidden lg:flex flex-col ${sidebarW} shrink-0 border-r border-border-subtle bg-bg-primary transition-all duration-300 z-30`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border-subtle">
            {!collapsed && (
              <Link href="/dashboard">
                <Logo size="small" />
              </Link>
            )}
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all ${
                    isActive
                      ? "bg-gold/10 text-gold font-medium"
                      : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-gold" : "text-text-muted group-hover:text-text-secondary"}
                  />
                  {!collapsed && <span>{item.label}</span>}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 w-[3px] h-6 rounded-r-full bg-gold"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* AI Status */}
          <div className="p-3 border-t border-border-subtle">
            <div
              className={`flex items-center gap-2.5 rounded-xl p-2.5 bg-cyan/5 border border-border-cyan ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <div className="relative shrink-0">
                <Sparkles size={16} className="text-cyan" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-semantic-green pulse-cyan" />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-[11px] font-body font-medium text-cyan truncate">
                    AI Engine Active
                  </p>
                  <p className="text-[10px] font-body text-text-muted">
                    Ready to analyze
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ─── MOBILE SIDEBAR OVERLAY ─── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 bottom-0 w-[260px] z-50 flex flex-col bg-bg-primary border-r border-border-subtle lg:hidden"
              >
                <div className="flex items-center justify-between h-16 px-4 border-b border-border-subtle">
                  <Logo size="small" />
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all ${
                          isActive
                            ? "bg-gold/10 text-gold font-medium"
                            : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                        }`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ─── MAIN CONTENT ─── */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* TOPBAR */}
          <header className="h-16 shrink-0 flex items-center justify-between px-4 lg:px-6 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-sm z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-bg-elevated text-text-muted cursor-pointer"
              >
                <Menu size={20} />
              </button>

              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl bg-bg-secondary border border-border-default w-64 lg:w-80">
                <Search size={15} className="text-text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Search datasets, analyses..."
                  className="flex-1 bg-transparent text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-text-muted border border-border-subtle bg-bg-elevated">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Communication Level Badge */}
              <Link
                href="/dashboard/settings"
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${currentComm.bg} ${currentComm.color} text-[11px] font-body font-medium transition-all hover:opacity-80`}
                title="AI Communication Level — Click to change"
              >
                <CommIcon size={13} />
                {currentComm.label}
              </Link>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setShowNotifications((v) => !v); setShowUserMenu(false); }}
                  className="relative p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-semantic-red" />
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-bg-primary border border-border-subtle shadow-xl z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border-subtle">
                        <h4 className="font-heading font-semibold text-sm text-text-primary">Notifications</h4>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {[
                          { text: "Analysis \"Q4 Revenue\" completed", time: "2 min ago", unread: true },
                          { text: "Prediction model finished training", time: "1 hour ago", unread: true },
                          { text: "Report \"Monthly KPIs\" exported", time: "Yesterday", unread: false },
                        ].map((notif, i) => (
                          <div
                            key={i}
                            className={`px-4 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-elevated transition-colors cursor-pointer ${notif.unread ? "bg-cyan/5" : ""}`}
                          >
                            <div className="flex items-start gap-2">
                              {notif.unread && <span className="mt-1.5 w-2 h-2 rounded-full bg-cyan shrink-0" />}
                              <div className={notif.unread ? "" : "ml-4"}>
                                <p className="text-xs font-body text-text-primary">{notif.text}</p>
                                <p className="text-[10px] font-body text-text-muted mt-0.5">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2.5 border-t border-border-subtle">
                        <p className="text-[11px] text-text-muted font-body text-center">All caught up!</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => { setShowUserMenu((v) => !v); setShowNotifications(false); }}
                  className="w-8 h-8 rounded-full bg-gold/10 border border-border-gold flex items-center justify-center cursor-pointer hover:border-gold transition-colors"
                >
                  <User size={16} className="text-gold" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-bg-primary border border-border-subtle shadow-xl z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border-subtle">
                        <p className="text-sm font-body font-medium text-text-primary">Mohit K.</p>
                        <p className="text-[11px] font-body text-text-muted">mohit@example.com</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                        >
                          <Settings size={15} className="text-text-muted" />
                          Settings
                        </Link>
                        <Link
                          href="/"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-semantic-red hover:bg-semantic-red/5 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
