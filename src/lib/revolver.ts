// Class for fetching token prices from various sources.

import { getAlchemyKey, getZerionKey } from "../app/config";
import { AlchemyFeed } from "./feeds/alchemy";
import { CoingeckoFeed } from "./feeds/coingecko";
import { DefilamaFeed } from "./feeds/defilama";
import { DexScreenerFeed } from "./feeds/dex-screener";
import { PriceFeed } from "./feeds/interface";
import { IconFeed } from "./icons/interface";
import { ZerionIconFeed } from "./icons/zerion";
import { TokenQuery } from "./types";

export class FeedRevolver implements PriceFeed, IconFeed {
  private sources: PriceFeed[];
  private iconFeed: IconFeed;
  public get name(): string {
    return `FeedRevolver: ${this.sources.length} sources`;
  }
  constructor(sources: PriceFeed[]) {
    this.sources = sources;
    this.iconFeed = new ZerionIconFeed(getZerionKey(), true);
  }

  static withAllSources(): FeedRevolver {
    return new FeedRevolver([
      new CoingeckoFeed(),
      new DefilamaFeed(),
      new DexScreenerFeed(),
      new AlchemyFeed(getAlchemyKey()),
    ]);
  }

  async getPrice(token: TokenQuery): Promise<number | null> {
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

  async getIcon(token: TokenQuery): Promise<string | null> {
    return this.iconFeed.getIcon(token);
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
