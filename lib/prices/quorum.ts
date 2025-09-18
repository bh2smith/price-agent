// Class for fetching token prices from various sources.
import {
  AlchemyFeed,
  CoingeckoFeed,
  DefilamaFeed,
  DexScreenerFeed,
  ZerionFeed,
  PriceFeed,
} from ".";
import { IconFeed, ZerionIconFeed } from "@/lib/icons";
import { getAlchemyKey, getZerionKey } from "@/src/app/config";
import { TokenQuery } from "@/lib/schema";

export class QuorumFeed implements PriceFeed {
  private sources: PriceFeed[];
  private iconFeed: IconFeed;
  public get name(): string {
    return `QuorumFeed: ${this.sources.length} sources`;
  }
  constructor(sources: PriceFeed[]) {
    this.sources = sources;
    this.iconFeed = new ZerionIconFeed(getZerionKey());
  }

  static withAllSources(): QuorumFeed {
    return new QuorumFeed([
      new CoingeckoFeed(),
      new DefilamaFeed(),
      new DexScreenerFeed(),
      new AlchemyFeed(getAlchemyKey()),
      new ZerionFeed(getZerionKey()),
    ]);
  }

  async getPrice(
    token: TokenQuery,
  ): Promise<{ price: number; source: string } | null> {
    const results = await Promise.all(
      this.sources.map((feed) => feed.getPrice(token)),
    );

    const nonNullResults = results.filter(
      (result): result is { price: number; source: string } => result !== null,
    );

    console.log(
      `Non-null price results: ${nonNullResults.length} / ${results.length}`,
    );

    if (nonNullResults.length >= Math.ceil(results.length / 2)) {
      const avgPrice =
        nonNullResults.reduce((sum, result) => sum + result.price, 0) /
        nonNullResults.length;

      const sourcesUsed = [
        ...new Set(nonNullResults.map((result) => result.source)),
      ].join(", ");
      return {
        price: avgPrice,
        source: `Mean of ${sourcesUsed}`,
      };
    }

    return null;
  }

  async getIcon(token: TokenQuery): Promise<string | null> {
    return this.iconFeed.getIcon(token);
  }
}
