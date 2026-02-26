"use client";

import { useState, createContext, useContext, type ReactNode } from "react";
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
} from "lucide-react";

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
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-semantic-red" />
              </button>

              {/* Avatar */}
              <div className="ml-2 w-8 h-8 rounded-full bg-gold/10 border border-border-gold flex items-center justify-center cursor-pointer hover:border-gold transition-colors">
                <User size={16} className="text-gold" />
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
