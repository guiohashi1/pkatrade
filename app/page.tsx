import { AdSlot } from "@/components/AdSlot";
import { HeroBanner } from "@/components/HeroBanner";
import { MarketBoard } from "@/components/MarketBoard";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <MarketBoard />
      <div className="px-3 pb-5 sm:px-5">
        <AdSlot id="home-footer" />
      </div>
    </div>
  );
}
