"use client";

import { useState } from "react";

type Message = {
  id: string;
  from: "them" | "you";
  text: string;
  at: string;
};

export function ChatPanel({ seller }: { seller: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), from: "you", text, at: "agora" },
    ]);
    setDraft("");
  }

  return (
    <aside className="flex h-full min-h-[380px] flex-col border border-frame bg-card shadow-[0_0_0_1px_color-mix(in_srgb,var(--brass)_40%,transparent)]">
      <div className="flex items-center gap-2.5 border-b border-line bg-paper-deep/40 px-4 py-3">
        <span className="grid h-8 w-8 place-items-center border border-brass/40 bg-gold-soft font-serif text-[13px] text-ink">
          {seller.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] text-ink">{seller}</p>
          <p className="text-[11px] text-muted">Negocia por aqui</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <p className="py-10 text-center text-[13px] leading-relaxed text-muted">
            Manda a primeira mensagem pra combinar a troca.
            <span className="mt-1 block text-[11px]">
              O histórico real entra com o back.
            </span>
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={message.from === "you" ? "text-right" : ""}
            >
              <p
                className={
                  message.from === "you"
                    ? "ml-6 inline-block bg-olive-soft px-3 py-2 text-left text-[13px] leading-relaxed text-olive"
                    : "mr-6 inline-block bg-well px-3 py-2 text-[13px] leading-relaxed text-ink"
                }
              >
                {message.text}
              </p>
              <p className="mt-1 text-[11px] text-muted">{message.at}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 border-t border-line p-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") send();
          }}
          placeholder="Escreva a mensagem"
          className="rpg-input min-w-0 flex-1"
        />
        <button
          type="button"
          onClick={send}
          className="btn-brass px-3 py-2 text-[13px]"
        >
          Enviar
        </button>
      </div>

      <p className="border-t border-line-soft px-4 py-2 text-[11px] text-muted">
        Rascunho local — não fica salvo no servidor ainda.
      </p>
    </aside>
  );
}
