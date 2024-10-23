import type { NextApiRequest, NextApiResponse } from "next";

type ProbabilityData = {
  smallPrize: number;
  mediumPrize: number;
  largePrize: number;
  jackpot: number;
  megaJackpot: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProbabilityData>
) {
  const smallPrize = parseFloat(process.env.PRIZE_SMALL || "0.5");
  const mediumPrize = parseFloat(process.env.PRIZE_MEDIUM || "0.3");
  const largePrize = parseFloat(process.env.PRIZE_LARGE || "0.15");
  const jackpot = parseFloat(process.env.PRIZE_JACKPOT || "0.04");
  const megaJackpot = parseFloat(process.env.PRIZE_MEGA_JACKPOT || "0.01");

  res.status(200).json({
    smallPrize,
    mediumPrize,
    largePrize,
    jackpot,
    megaJackpot,
  });
}
