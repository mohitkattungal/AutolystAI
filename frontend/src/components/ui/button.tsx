"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "hero";
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center font-body font-medium rounded-3xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-gold text-text-inverse hover:bg-gold-bright hover:shadow-gold active:bg-gold-deep",
    secondary:
      "bg-transparent border border-border-default text-text-primary hover:border-border-strong hover:bg-bg-elevated",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary",
    destructive:
      "bg-transparent border border-semantic-red/30 text-semantic-red hover:border-semantic-red/60 hover:bg-semantic-red/5",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-5 text-sm gap-2",
    lg: "h-11 px-6 text-sm gap-2",
    hero: "h-[52px] px-8 text-base gap-2.5",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
