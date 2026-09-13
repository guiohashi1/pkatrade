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
    <div className="mx-auto max-w-3xl px-3 py-5 sm:px-6 sm:py-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-navy-mid">
        Sobre
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-pixel)] text-[1.75rem] leading-tight tracking-wide text-navy sm:text-[2.1rem]">
        Bazar do PokeAlliance
      </h1>

      <p className="mt-5 text-[15px] leading-[1.75] text-ink-soft">
        Funciona no espírito de um market clássico: você anuncia o Pokémon à
        venda, quem se interessar manda mensagem e a troca fecha no jogo.
      </p>

      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rpg-inset p-4">
            <p className="tabular font-[family-name:var(--font-pixel)] text-[1.35rem] leading-none text-navy-mid/50">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-pixel)] text-[1.05rem] leading-tight text-navy">
              {step.title}
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-12 space-y-5 border-t-2 border-line pt-8 text-[15px] leading-[1.75] text-ink-soft">
        <p>
          O login (Google ou código no email) cria a conta pra publicar e
          conversar. Depois você liga o nick e o mundo do personagem. Em cada
          anúncio você escolhe mostrar o nick ou publicar como anônimo.
        </p>
        <p>
          Não tem escrow e o site não entrega Pokémon. RMT é permitido no
          servidor, mas confere personagem, preço e guarda print.
        </p>
        <p>
          A lista de Pokémon vem da{" "}
          <a
            href="https://wiki.pokealliance.com/pokemon"
            className="font-bold text-navy underline decoration-line underline-offset-2 hover:decoration-navy"
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
          className="border-2 border-navy/30 bg-card px-4 py-2 font-bold transition-colors hover:border-navy"
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
