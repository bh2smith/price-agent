// Retrieves token prices by address from dexscreener.

import { Address } from "viem";
import { catchNativeAsset } from "../catch-eth";
import { TokenQuery } from "../types";
import { PriceFeed } from "./interface";

const DEXSCREENER_BASE_URL = "https://api.dexscreener.com/latest/dex/tokens";

export interface DexscreenerResponse {
  schemaVersion: string;
  pairs: DexPair[];
}

export interface DexPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  priceNative: string; // price of baseToken in quoteToken
  priceUsd: string;
  txns: TransactionStats;
  volume: VolumeStats;
  priceChange: PriceChangeStats;
  liquidity?: LiquidityStats;
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  labels?: string[];
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
}

export interface TransactionStats {
  m5: TxCount;
  h1: TxCount;
  h6: TxCount;
  h24: TxCount;
}

export interface TxCount {
  buys: number;
  sells: number;
}

export interface VolumeStats {
  m5: number;
  h1: number;
  h6: number;
  h24: number;
}

export interface PriceChangeStats {
  m5?: number;
  h1?: number;
  h6?: number;
  h24?: number;
}

export interface LiquidityStats {
  usd: number;
  base: number;
  quote: number;
}

export class DexScreenerFeed implements PriceFeed {
  public get name(): string {
    return "DexScreener";
  }
  async getPrice(token: TokenQuery): Promise<number | null> {
    const address = await catchNativeAsset(token);
    const response = await fetch(`${DEXSCREENER_BASE_URL}/${address}`);
    const data = (await response.json()) as DexscreenerResponse;
    return evaluatePrice(data.pairs, token.address);
  }
}

export function evaluatePrice(
  pairs: DexPair[],
  address: Address,
): number | null {
  const filteredPairs = pairs.filter(
    (p) => p.liquidity && p.liquidity.usd > 10000 && parseFloat(p.priceUsd) > 0,
  );
  if (filteredPairs.length === 0) {
    return null;
  }
  const totalPrice = filteredPairs.reduce(
    (sum, pair) => sum + getTokenUsdPrice(pair, address)!,
    0,
  );
  return totalPrice / filteredPairs.length;
}

function getTokenUsdPrice(pair: DexPair, tokenAddress: Address): number | null {
  const { baseToken, quoteToken } = pair;
  const baseIsGno =
    baseToken.address.toLowerCase() === tokenAddress.toLowerCase();
  const quoteIsGno =
    quoteToken.address.toLowerCase() === tokenAddress.toLowerCase();

  if (baseIsGno) {
    return parseFloat(pair.priceUsd); // direct price
  } else if (quoteIsGno) {
    const priceNative = parseFloat(pair.priceNative);
    const priceUsd = parseFloat(pair.priceUsd);
    if (priceNative > 0) {
      return priceUsd / priceNative; // inverted price
    }
  }

  return null;
}
