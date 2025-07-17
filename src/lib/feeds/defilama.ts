// Query DefiLama API for token prices.

import { catchNativeAsset } from "../catch-eth";
import { PriceQuery } from "../types";

const DEFILAMA_BASE_URL = "https://coins.llama.fi";

const chainMap: Record<number, string> = {
  1: "ethereum",
  56: "bsc",
  137: "polygon",
  10: "optimism",
  42161: "arbitrum",
  43114: "avalanche",
  8453: "base",
  100: "gnosis",
};

export async function getTokenPrice(token: PriceQuery): Promise<number | null> {
  const address = await catchNativeAsset(token);

  const chain = chainMap[token.chainId];
  if (!chain) {
    console.warn(`Unsupported chain ID: ${token.chainId}`);
    return null;
  }

  const response = await fetch(
    `${DEFILAMA_BASE_URL}/prices/current/${chain}:${address}?searchWidth=4h`,
    {
      headers: {
        accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    console.warn(`DeFi Lama: Failed to fetch price: ${response.statusText}`);
    return null;
  }

  const data = await response.json();
  return data.coins?.[`${chain}:${address}`]?.price || null;
}
