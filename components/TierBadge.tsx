import { isRareTier, tierLabel } from "@/lib/catalog";

export function TierBadge({ tier }: { tier: string | number | null }) {
  const rare = tier !== null && isRareTier(tier);

  return (
    <span
      className={
        rare
          ? "border border-gold/40 bg-gold/10 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em] text-gold"
          : "border border-line bg-paper-deep px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em] text-muted"
      }
    >
      {tierLabel(tier)}
    </span>
  );
}
