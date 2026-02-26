"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { User, Users, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountTypePage() {
  const router = useRouter();

  const handleSelect = (type: "individual" | "team") => {
    // TODO: Save account type to backend
    if (type === "individual") {
      router.push("/onboarding/individual");
    } else {
      router.push("/onboarding/team");
    }
  };

  return (
    <div className="dot-grid min-h-screen flex items-center justify-center relative">
      <div className="nebula-gold" />
      <div className="nebula-cyan" />

      <div className="relative z-10 w-full max-w-3xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-8">
            <Link href="/">
              <Logo size="large" />
            </Link>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-text-primary text-center mb-2">
            How will you use AutolystAI?
          </h1>
          <p className="text-text-secondary font-body text-center mb-12 max-w-md mx-auto">
            This determines your experience. You can always change later.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Individual Card */}
            <motion.button
              className="group glass-card rounded-2xl p-8 text-left cursor-pointer border border-transparent hover:border-border-gold transition-all duration-300"
              whileHover={{ y: -4, boxShadow: "var(--shadow-gold)" }}
              onClick={() => handleSelect("individual")}
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--gold-subtle)] border border-border-gold flex items-center justify-center mb-6">
                <User size={28} className="text-gold" />
              </div>
              <h2 className="font-heading font-bold text-xl text-text-primary mb-2">
                Just for Me
              </h2>
              <p className="text-sm text-text-secondary font-body leading-relaxed mb-6">
                Personal analytics workspace for individual analysis. Perfect for freelancers, consultants, researchers, and startup founders.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Personal workspace",
                  "No team setup required",
                  "Instant start — upload and analyze",
                  "Upgrade to Pro anytime",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-gold flex-shrink-0" />
                    <span className="text-xs text-text-secondary font-body">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-gold font-medium text-sm font-body group-hover:gap-3 transition-all">
                Get Started <ArrowRight size={16} />
              </div>
            </motion.button>

            {/* Team Card */}
            <motion.button
              className="group glass-card rounded-2xl p-8 text-left cursor-pointer border border-transparent hover:border-border-cyan transition-all duration-300"
              whileHover={{ y: -4, boxShadow: "var(--shadow-cyan)" }}
              onClick={() => handleSelect("team")}
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--cyan-subtle)] border border-border-cyan flex items-center justify-center mb-6">
                <Users size={28} className="text-cyan" />
              </div>
              <h2 className="font-heading font-bold text-xl text-text-primary mb-2">
                For My Team or Company
              </h2>
              <p className="text-sm text-text-secondary font-body leading-relaxed mb-6">
                Collaborative workspace with shared datasets, reports, and role-based access. Built for teams of all sizes.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Shared team workspace",
                  "Role-based access control",
                  "Shared datasets & reports",
                  "Company-branded exports",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-cyan flex-shrink-0" />
                    <span className="text-xs text-text-secondary font-body">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-cyan font-medium text-sm font-body group-hover:gap-3 transition-all">
                Set Up Workspace <ArrowRight size={16} />
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
