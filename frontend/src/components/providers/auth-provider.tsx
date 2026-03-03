"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Initializes auth state at app startup by restoring
 * the JWT from localStorage.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
