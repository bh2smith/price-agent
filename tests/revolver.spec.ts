// Unit tests for coingecko.ts
import { FeedRevolver } from "@/src/lib/feed";
import { TORN_MAINNET, XCOMB_GNOSIS, TRUMP_BASE } from "./fixtures";
import {
  AlchemyFeed,
  CoingeckoFeed,
  DefilamaFeed,
  DexScreenerFeed,
  ZerionFeed,
} from "@/src/lib/feeds";
import { getAlchemyKey, getZerionKey } from "@/src/app/config";
import { PriceQuery } from "@/src/lib/types";

// Rate limits.
describe("revolver", () => {
  it("should return token prices on a few networks", async () => {
    const revolver = new FeedRevolver([
      new AlchemyFeed(getAlchemyKey()),
      new CoingeckoFeed(),
      new DefilamaFeed(),
      new DexScreenerFeed(),
      new ZerionFeed(getZerionKey()),
    ]);
    const prices = await Promise.all(
      [TORN_MAINNET, XCOMB_GNOSIS, TRUMP_BASE].map(async (token) => {
        const price = await revolver.getPrice(token);
        expect(price).toBeGreaterThan(0);
        return price;
      }),
    );
    console.log(prices);
  });
});
