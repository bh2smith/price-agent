// Class for fetching token prices from various sources.

import { getTokenPrice as coingeckoPrice } from "./feeds/coingecko";
import { getTokenPrice as defilamaPrice } from "./feeds/defilama";
import { getTokenPrice as dexscreenerPrice } from "./feeds/dex-screener";
import { PriceQuery } from "./types";

export class FeedRevolver implements FeedSource {
  private sources: FeedSource[];
  public get name(): string {
    return `FeedRevolver: ${this.sources.length} sources`;
  }
  constructor(sources: FeedSource[]) {
    this.sources = sources;
  }

  async getPrice(token: PriceQuery): Promise<number | null> {
    // Create a copy of sources and shuffle them randomly
    const shuffledSources = [...this.sources].sort(() => Math.random() - 0.5);

    // Try each source in random order until we get a valid price
    for (const source of shuffledSources) {
      console.log(
        `Trying ${source.name} to fetch price for ${token.chainId}:${token.address}`,
      );
      try {
        const price = await source.getPrice(token);
        if (price !== null) {
          return price;
        }
        console.log(`${source.name} returned null price`);
      } catch (error) {
        console.log(`Error fetching price from ${source.name}:`, error);
      }
    }

    console.log(
      `All sources failed to return a valid price for ${JSON.stringify(token, null, 2)}`,
    );
    return null;
  }
}

export interface FeedSource {
  name: string;
  getPrice(token: PriceQuery): Promise<number | null>;
}

export class CoingeckoFeed implements FeedSource {
  public get name(): string {
    return "Coingecko";
  }
  async getPrice(token: PriceQuery): Promise<number | null> {
    return coingeckoPrice(token);
  }
}

export class DefilamaFeed implements FeedSource {
  public get name(): string {
    return "Defilama";
  }
  async getPrice(token: PriceQuery): Promise<number | null> {
    return defilamaPrice(token);
  }
}

export class DexScreenerFeed implements FeedSource {
  public get name(): string {
    return "DexScreener";
  }
  async getPrice(token: PriceQuery): Promise<number | null> {
    return dexscreenerPrice(token);
  }
}
