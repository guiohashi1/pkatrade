"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={
        active
          ? "border-b border-brass pb-0.5 text-ink"
          : "border-b border-transparent pb-0.5 text-muted hover:text-ink"
      }
    >
      {children}
    </Link>
  );
}
