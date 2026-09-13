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
   * Mostra o retângulo vazio no esboço, bem discreto.
   * Em produção, deixe false até o AdSense estar aprovado.
   */
  placeholders: true,
} as const;

export type AdSlotId = "home-footer" | "listing-after-note";
