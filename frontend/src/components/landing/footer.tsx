"use client";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Lifecycle", href: "#lifecycle" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary">
      {/* CTA Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Ready to Transform Your{" "}
            <span className="gradient-text-gold-cyan">Data Into Decisions?</span>
          </h2>
          <p className="text-text-secondary font-body text-base mb-8 max-w-lg mx-auto">
            Join thousands of users who get instant, intelligent analysis on every
            dataset they upload.
          </p>
          <Link href="/auth/signup">
            <Button size="hero">
              Get Started Free
              <ArrowRight size={18} />
            </Button>
          </Link>
          <p className="mt-3 text-xs text-text-muted font-body">
            No credit card required · Free tier always available
          </p>
        </div>
      </div>

      {/* Footer Columns */}
      <div className="border-t border-border-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <Logo size="small" />
              <p className="mt-4 text-sm text-text-muted font-body leading-relaxed max-w-xs">
                The Agentic AI Analytics Platform. Upload your data. Ask anything.
                Get decisions, not just charts.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-heading font-semibold text-sm text-text-primary mb-4">
                  Product
                </h4>
                <ul className="space-y-2.5">
                  {productLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-text-muted font-body hover:text-text-secondary transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm text-text-primary mb-4">
                  Company
                </h4>
                <ul className="space-y-2.5">
                  {companyLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-text-muted font-body hover:text-text-secondary transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-heading font-semibold text-sm text-text-primary mb-4">
                Stay Updated
              </h4>
              <p className="text-sm text-text-muted font-body mb-4">
                Get updates on new features and AI analytics tips.
              </p>
              <form
                className="flex gap-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 h-10 px-4 rounded-lg bg-bg-secondary border border-border-default text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
                />
                <Button size="md" type="submit">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-muted font-body">
            © 2026 AutolystAI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-text-muted font-body hover:text-text-secondary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs text-text-muted font-body hover:text-text-secondary transition-colors">
              Terms
            </a>
            <a href="#" className="text-xs text-text-muted font-body hover:text-text-secondary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
