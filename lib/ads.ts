/**
 * Regras de propaganda no pkatrade
 *
 * - No máximo 1–2 blocos por página
 * - Sem sticky, pop-up, intersticial ou “clique pra continuar”
 * - Longe do chat e do formulário de criar anúncio
 * - Placeholder nunca é clicável (pointer-events: none)
 * - Quando o AdSense entrar, o script só preenche o slot; o layout não muda
 */

export const adsConfig = {
  /** Liga o AdSense de verdade (ainda sem client id). */
  live: false,
  /**
   * Retângulos vazios no layout. Off por padrão — liga só em esboço visual.
   */
  placeholders: process.env.NEXT_PUBLIC_AD_PLACEHOLDERS === "1",
} as const;

export type AdSlotId = "home-footer" | "listing-after-note";
