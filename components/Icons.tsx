/**
 * Ícones do marketplace:
 * - Tipos: @pokemonle/icons-react
 * - Variante / UI: SVGs próprios + lucide (busca)
 */

import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  IconBug,
  IconDark,
  IconDragon,
  IconElectric,
  IconFairy,
  IconFighting,
  IconFire,
  IconFlying,
  IconGhost,
  IconGrass,
  IconGround,
  IconIce,
  IconNormal as IconTypeNormal,
  IconPoison,
  IconPsychic,
  IconRock,
  IconSteel,
  IconWater,
} from "@pokemonle/icons-react";
import { Search, type LucideProps } from "lucide-react";

type IconProps = {
  className?: string;
  title?: string;
};

type SvgComp = ComponentType<SVGProps<SVGSVGElement>>;

const TYPE_ICONS: Record<string, SvgComp> = {
  bug: IconBug,
  dark: IconDark,
  dragon: IconDragon,
  electric: IconElectric,
  fairy: IconFairy,
  fighting: IconFighting,
  fire: IconFire,
  flying: IconFlying,
  ghost: IconGhost,
  grass: IconGrass,
  ground: IconGround,
  ice: IconIce,
  normal: IconTypeNormal,
  poison: IconPoison,
  psychic: IconPsychic,
  rock: IconRock,
  steel: IconSteel,
  water: IconWater,
};

function UiSvg({
  className,
  title,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

/** Emblema colorido do tipo (Pokemonle). */
export function IconType({
  element,
  className,
  title,
}: IconProps & { element: string }) {
  const Comp = TYPE_ICONS[element] ?? IconTypeNormal;
  return (
    <Comp
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    />
  );
}

/** Pokébola — marca / “à venda”. */
export function IconTrade({ className, title }: IconProps) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <circle
        cx="12"
        cy="12"
        r="9.25"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3 12h18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9Z"
        fill="currentColor"
        opacity="0.22"
      />
      <circle cx="12" cy="12" r="3.1" fill="currentColor" />
      <circle cx="12" cy="12" r="1.35" fill="var(--card, #fff)" />
    </svg>
  );
}

export function IconSearch({ className, title }: IconProps) {
  return (
    <Search
      className={className}
      absoluteStrokeWidth
      strokeWidth={2.25}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    />
  );
}

/** Variante: todas — duas camadas. */
export function IconAll({ className, title }: IconProps) {
  return (
    <UiSvg className={className} title={title}>
      <rect
        x="2.5"
        y="4.5"
        width="8"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="5.5"
        y="2.5"
        width="8"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="var(--card, #fff)"
      />
    </UiSvg>
  );
}

/** Variante normal — círculo limpo. */
export function IconNormal({ className, title }: IconProps) {
  return (
    <UiSvg className={className} title={title}>
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="1.75" fill="currentColor" />
    </UiSvg>
  );
}

/** Variante shiny — estrela de 4 pontas. */
export function IconShiny({ className, title }: IconProps) {
  return (
    <UiSvg className={className} title={title}>
      <path
        d="M8 1.5 9.1 6.2 14 7.2 9.1 8.2 8 14.5 6.9 8.2 2 7.2 6.9 6.2Z"
        fill="currentColor"
      />
    </UiSvg>
  );
}

/** Selo shiny discreto (listas / formulário). */
export function ShinyMark({ className }: { className?: string }) {
  return (
    <span
      className={
        className ??
        "inline-flex items-center gap-1 text-[11px] font-medium tracking-normal text-price/85"
      }
    >
      <IconShiny className="text-[10px] opacity-75" />
      Shiny
    </span>
  );
}

export type { LucideProps };
