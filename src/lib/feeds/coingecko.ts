// Fetches token price from Coingecko
import { catchNativeAsset } from "../catch-eth";
import { TokenQuery } from "../types";
import { PriceFeed } from "./interface";

const CG_BASE_URL = "https://api.coingecko.com/api/v3/simple/token_price";
const CG_CHAIN_MAP: Record<number, string> = {
  1: "ethereum",
  10: "optimistic-ethereum",
  100: "xdai",
  137: "polygon-pos",
  8453: "base",
  42161: "arbitrum-one",
  43114: "avalanche",
};

export async function getTokenPrice(token: TokenQuery): Promise<number | null> {
  const address = await catchNativeAsset(token);
  const addressKey = `${token.chainId}:${token.address.toLowerCase()}`;
  const chain = CG_CHAIN_MAP[token.chainId];
  if (!chain) {
    console.warn(`Unsupported chain ID: ${token.chainId}`);
    return null;
  }
  const url = `${CG_BASE_URL}/${chain}?contract_addresses=${address.toLowerCase()}&vs_currencies=usd`;
  const response = await fetch(url);
  if (!response.ok) {
    console.warn(`Coingecko error for ${addressKey}`, response);
    return null;
  }
  const data = await response.json();

  const tokenData = data[address.toLowerCase()];

  if (!tokenData || typeof tokenData.usd !== "number") {
    console.warn(`No USD price data found for ${addressKey}`);
    return null;
  }

  return tokenData.usd;
}

export class CoingeckoFeed implements PriceFeed {
  public get name(): string {
    return "Coingecko";
  }
  async getPrice(token: TokenQuery): Promise<number | null> {
    return getTokenPrice(token);
  }
}
