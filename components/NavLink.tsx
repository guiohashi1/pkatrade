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
          ? "border-b-2 border-gold pb-0.5 text-gold"
          : "border-b-2 border-transparent pb-0.5 text-sky-soft/90 hover:text-cream"
      }
    >
      {children}
    </Link>
  );
}
