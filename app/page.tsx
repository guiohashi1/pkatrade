import { AdSlot } from "@/components/AdSlot";
import { MarketBoard } from "@/components/MarketBoard";

export default function Home() {
  return (
    <div>
      <header className="mb-5 border-b border-line pb-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-brass">
          Bazar · PokeAlliance
        </p>
        <h1 className="mt-1 font-serif text-[1.75rem] leading-none tracking-tight sm:text-[2rem]">
          Anúncios
        </h1>
        <p className="mt-1.5 text-[13px] text-muted">
          Combina no chat, entrega no jogo.
        </p>
      </header>

      <MarketBoard />

      <div className="mt-14">
        <AdSlot id="home-footer" />
      </div>
    </div>
  );
}
