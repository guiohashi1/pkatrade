"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Sobe o scroll ao trocar de rota (UX em mobile). */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
