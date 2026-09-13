import { adsConfig, type AdSlotId } from "@/lib/ads";

const sizes: Record<
  AdSlotId,
  { label: string; className: string }
> = {
  "home-footer": {
    label: "Publicidade",
    className: "mx-auto h-[72px] max-w-[728px]",
  },
  "listing-after-note": {
    label: "Publicidade",
    className: "h-[90px] max-w-[336px]",
  },
};

/**
 * Slot reservado pro AdSense. No esboço só mostra um retângulo sem clique.
 */
export function AdSlot({ id }: { id: AdSlotId }) {
  if (!adsConfig.live && !adsConfig.placeholders) return null;

  const size = sizes[id];

  return (
    <aside
      aria-label="Publicidade"
      className="select-none"
      data-ad-slot={id}
    >
      <p className="mb-1.5 text-[10px] uppercase tracking-[0.14em] text-muted/55">
        {size.label}
      </p>
      <div
        className={`${size.className} grid place-items-center border border-dashed border-line/70 bg-paper-deep/40 text-[11px] text-muted/40 ${
          adsConfig.live ? "" : "pointer-events-none"
        }`}
      >
        {adsConfig.live ? (
          // Quando ligar o AdSense, o script injeta aqui.
          <div id={`ad-${id}`} />
        ) : (
          <span>espaço reservado</span>
        )}
      </div>
    </aside>
  );
}
