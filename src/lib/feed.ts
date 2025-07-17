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

  static withAllSources(): FeedRevolver {
    return new FeedRevolver([
      new CoingeckoFeed(),
      new DefilamaFeed(),
      new DexScreenerFeed(),
    ]);
  }

  async getPrice(token: PriceQuery): Promise<number | null> {
    // Create a copy of sources and shuffle them using timestamp as seed
    const timestamp = Date.now();
    const shuffledSources = this.shuffleWithSeed([...this.sources], timestamp);

    // Try each source in random order until we get a valid price
    for (const source of shuffledSources) {
      console.log(
        `Trying ${source.name} to fetch price for ${token.chainId}:${token.address}`,
      );
      try {
        const price = await source.getPrice(token);
        if (price !== null) {
          console.log(`${source.name} found price ${price}`);
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

  private shuffleWithSeed<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    let currentSeed = seed;

    // Simple seeded random number generator
    const seededRandom = () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };

    // Fisher-Yates shuffle with seeded random
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
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
