"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type CommunicationLevel = "executive" | "analyst" | "storyteller";

interface CommunicationContextType {
  level: CommunicationLevel;
  setLevel: (level: CommunicationLevel) => void;
}

const CommunicationContext = createContext<CommunicationContextType>({
  level: "analyst",
  setLevel: () => {},
});

export function CommunicationProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState<CommunicationLevel>("analyst");

  return (
    <CommunicationContext.Provider value={{ level, setLevel }}>
      {children}
    </CommunicationContext.Provider>
  );
}

export function useCommunicationLevel() {
  return useContext(CommunicationContext);
}
