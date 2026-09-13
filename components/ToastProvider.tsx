"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ToastKind = "info" | "success" | "error";

export type ToastItem = {
  id: string;
  kind: ToastKind;
  message: string;
};

type ToastContextValue = {
  push: (message: string, kind?: ToastKind) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message: string, kind: ToastKind = "info") => {
      const id = `toast_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      setItems((prev) => [...prev.slice(-3), { id, kind, message }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(100%-2rem,22rem)] flex-col gap-2"
        aria-live="polite"
      >
        {items.map((toast) => (
          <div
            key={toast.id}
            className={[
              "pointer-events-auto border-2 px-3 py-2 text-[13px] font-bold shadow-lg",
              toast.kind === "error"
                ? "border-warn bg-warn-soft text-warn"
                : toast.kind === "success"
                  ? "border-olive bg-olive-soft text-olive"
                  : "border-navy bg-card text-ink",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="leading-snug">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 text-[11px] uppercase tracking-wide opacity-70 hover:opacity-100"
              >
                Fechar
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      push: () => undefined,
      dismiss: () => undefined,
    };
  }
  return ctx;
}
