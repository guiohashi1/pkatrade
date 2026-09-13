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
    ],
  },
};

export default nextConfig;
