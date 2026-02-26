import { Hexagon } from "lucide-react";

export function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const iconSizes = { small: 20, default: 28, large: 36 };
  const textSizes = {
    small: "text-lg",
    default: "text-xl",
    large: "text-2xl",
  };
  const badgeSizes = {
    small: "text-[9px] px-1.5 py-0",
    default: "text-[10px] px-2 py-0.5",
    large: "text-xs px-2.5 py-0.5",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Hexagon
          size={iconSizes[size]}
          className="text-gold fill-gold/10 stroke-[1.5]"
        />
        <div
          className="absolute inset-0 rounded-full opacity-40 blur-sm"
          style={{
            background: "linear-gradient(135deg, var(--gold), var(--cyan))",
          }}
        />
      </div>
      <span className={`font-heading font-bold text-text-primary ${textSizes[size]}`}>
        Autolyst
      </span>
      <span
        className={`font-heading font-bold rounded-full bg-gold/15 text-gold border border-gold/30 ${badgeSizes[size]}`}
      >
        AI
      </span>
    </div>
  );
}
