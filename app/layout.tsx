import type { Metadata } from "next";
import { Nunito_Sans, Pixelify_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ToastProvider } from "@/components/ToastProvider";
import "./globals.css";

const body = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const pixel = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "pkatrade · Pokémon no PokeAlliance",
  description:
    "Anuncie Pokémon à venda no PokeAlliance. Combinem no chat e troquem no jogo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${body.variable} ${pixel.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <ToastProvider>
          <ScrollToTop />
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-2 py-3 sm:px-4 sm:py-5">
            <div className="rpg-panel flex min-h-0 flex-1 flex-col overflow-hidden">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
