import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CommunicationProvider } from "@/components/providers/communication-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AutolystAI — Agentic AI Analytics Platform",
  description:
    "Upload your data. Ask anything. Get decisions, not just charts. AI-powered analytics for individuals and teams.",
  keywords: [
    "AI analytics",
    "data analysis",
    "machine learning",
    "business intelligence",
    "AutoML",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <CommunicationProvider>{children}</CommunicationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
