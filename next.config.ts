import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Não regenerar AGENTS.md / CLAUDE.md no `next dev`
  agentRules: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wiki.pokealliance.com",
        pathname: "/pokemon/**",
      },
      {
        protocol: "https",
        hostname: "img.pokemondb.net",
        pathname: "/sprites/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/PokeAPI/sprites@master/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
  },
};

export default nextConfig;
