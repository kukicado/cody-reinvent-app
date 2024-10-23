import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    PRIZE_SMALL: process.env.PRIZE_SMALL || "0.5",
    PRIZE_MEDIUM: process.env.PRIZE_MEDIUM || "0.3",
    PRIZE_LARGE: process.env.PRIZE_LARGE || "0.15",
    PRIZE_JACKPOT: process.env.PRIZE_JACKPOT || "0.04",
    PRIZE_MEGA_JACKPOT: process.env.PRIZE_MEGA_JACKPOT || "0.01",
  },
};

export default nextConfig;