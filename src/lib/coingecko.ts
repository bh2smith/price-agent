// Fetches token price from Coingecko
import { Address } from "viem";
import { catchNativeAsset } from "./catch-eth";
import { PriceQuery } from "./types";

const CG_BASE_URL = "https://api.coingecko.com/api/v3";
const CG_CHAIN_MAP: Record<number, string> = {
  1: "ethereum",
  10: "optimistic-ethereum",
  100: "xdai",
  137: "polygon-pos",
  8453: "base",
  42161: "arbitrum-one",
  43114: "avalanche",
};

export async function getTokenPrice(token: PriceQuery): Promise<number | null> {
  const address = await catchNativeAsset(token);
  const chain = CG_CHAIN_MAP[token.chainId];
  if (!chain) {
    console.warn(`Chain ${token.chainId} not supported by Coingecko`);
    return null;
  }
  const response = await fetch(
    `${CG_BASE_URL}/simple/token_price/${chain}?contract_addresses=${address}&vs_currencies=usd`,
  );
  if (!response.ok) {
    console.warn(
      `Coingecko error for ${token.chainId}:${token.address}`,
      response,
    );
    return null;
  }
  const data = await response.json();
  return data[address.toLowerCase()].usd;
}
