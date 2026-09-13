import { isRareTier, tierLabel } from "@/lib/catalog";

/** Labels curtos pra caber em cards estreitos. */
function compactTierLabel(label: string) {
  const map: Record<string, string> = {
    "Ultra Rare": "Ultra",
    "Super Rare": "Super",
    Legendary: "Legend",
    ULTIMATE: "Ultim.",
  };
  return map[label] ?? label;
}

export function TierBadge({
  tier,
  className = "",
  compact = false,
}: {
  tier: string | number | null;
  className?: string;
  /** Usa abreviação em telas/cards apertados. */
  compact?: boolean;
}) {
  const rare = tier !== null && isRareTier(tier);
  const full = tierLabel(tier);
  const label = compact ? compactTierLabel(full) : full;
  const long = label.replace(/\s+/g, "").length >= 7;

  return (
    <span
      title={full}
      className={[
        "inline-flex max-w-full min-w-0 items-center justify-center border-2 leading-none font-extrabold uppercase",
        compact
          ? long
            ? "px-1 py-[3px] text-[8px] tracking-[0.01em] sm:px-1.5 sm:py-[5px] sm:text-[9px]"
            : "px-1.5 py-[3px] text-[8px] tracking-[0.03em] sm:px-2 sm:py-[5px] sm:text-[10px]"
          : long
            ? "px-1.5 py-[5px] text-[9px] tracking-[0.02em]"
            : "px-2 py-[5px] text-[10px] tracking-[0.05em]",
        "whitespace-nowrap",
        rare
          ? "border-navy/40 bg-gradient-to-b from-gold-soft to-[#e8d48a] text-navy-deep"
          : "border-navy/25 bg-paper-deep text-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </span>
  );
}
