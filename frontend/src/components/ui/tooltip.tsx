"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children?: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  iconOnly?: boolean;
}

export function Tooltip({
  content,
  children,
  side = "top",
  className,
  iconOnly = false,
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const origins = {
    top: { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } },
    bottom: { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 4 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 } },
  };

  return (
    <span
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {iconOnly ? (
        <Info size={14} className="text-text-muted hover:text-text-secondary cursor-help transition-colors" />
      ) : (
        children
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            className={cn(
              "absolute z-50 w-64 px-3.5 py-2.5 rounded-lg",
              "bg-bg-elevated border border-border-gold",
              "text-xs text-text-secondary leading-relaxed font-body",
              "pointer-events-none shadow-lg",
              positions[side]
            )}
            initial={origins[side].initial}
            animate={origins[side].animate}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
