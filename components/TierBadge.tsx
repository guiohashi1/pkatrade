import { isRareTier, tierLabel } from "@/lib/catalog";

/** Labels curtos pra caber em cards estreitos sem estourar o header. */
function compactTierLabel(label: string) {
  const map: Record<string, string> = {
    "Ultra Rare": "UR",
    "Super Rare": "SR",
    Legendary: "Leg",
    Mythic: "Myth",
    ULTIMATE: "Ult",
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
  const long = !compact && label.replace(/\s+/g, "").length >= 7;

  return (
    <span
      title={full}
      className={[
        "inline-flex shrink-0 items-center justify-center border-2 leading-none font-extrabold uppercase whitespace-nowrap",
        compact
          ? "h-[18px] px-1.5 text-[8px] tracking-[0.04em] sm:h-5 sm:px-2 sm:text-[9px]"
          : long
            ? "px-1.5 py-[5px] text-[9px] tracking-[0.02em]"
            : "px-2 py-[5px] text-[10px] tracking-[0.05em]",
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
