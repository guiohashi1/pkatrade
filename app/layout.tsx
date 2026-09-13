import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "pkatrade · Pokémon no PokeAlliance",
  description:
    "Anuncie e busque Pokémon no PokeAlliance. Combinem no chat e troquem no jogo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${plex.variable} ${fraunces.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 py-4 sm:px-5 sm:py-6">
          <div className="site-panel flex min-h-0 flex-1 flex-col">
            <Header />
            <main className="flex-1 px-4 py-6 sm:px-6 sm:py-7">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
