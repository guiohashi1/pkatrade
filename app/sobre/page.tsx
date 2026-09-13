import Link from "next/link";

const steps = [
  {
    title: "Publique",
    body: "Escolhe o Pokémon na wiki, põe o mundo e o preço.",
  },
  {
    title: "Combine",
    body: "Quem se interessar manda mensagem. Vocês fecham horário e pagamento.",
  },
  {
    title: "Troque no jogo",
    body: "A entrega é no PokeAlliance, direto entre os dois.",
  },
];

export default function SobrePage() {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] uppercase tracking-[0.16em] text-brass">Sobre</p>
      <h1 className="mt-2 font-serif text-[2.1rem] leading-tight tracking-tight">
        Bazar gratuito do PokeAlliance
      </h1>

      <p className="mt-5 text-[15px] leading-[1.75] text-ink-soft">
        Funciona no mesmo espírito de um market de Tibia: anuncia, busca, fecha
        no chat. A troca em si é no jogo.
      </p>

      <ol className="mt-10 grid gap-6 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t border-line pt-4">
            <p className="tabular font-serif text-[1.6rem] leading-none text-muted/60">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 font-serif text-[1.2rem] leading-tight">
              {step.title}
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-12 space-y-5 border-t border-line pt-8 text-[15px] leading-[1.75] text-ink-soft">
        <p>
          Depois o login (Google ou código no email) cria a conta pra publicar e
          conversar. Neste esboço isso ainda não está ligado.
        </p>
        <p>
          Não tem escrow e o site não entrega Pokémon. RMT é permitido no
          servidor, mas confere personagem, preço e guarda print.
        </p>
        <p>
          A lista de Pokémon vem da{" "}
          <a
            href="https://wiki.pokealliance.com/pokemon"
            className="underline decoration-line underline-offset-2 hover:decoration-ink"
            target="_blank"
            rel="noreferrer"
          >
            wiki do PokeAlliance
          </a>
          .
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3 text-[13px]">
        <Link
          href="/"
          className="border border-line bg-card px-4 py-2 transition-colors hover:border-ink/40"
        >
          Ver anúncios
        </Link>
        <Link href="/anunciar" className="btn-brass px-4 py-2 text-[13px]">
          Criar anúncio
        </Link>
      </div>
    </div>
  );
}
