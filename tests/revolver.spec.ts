// Unit tests for coingecko.ts
import {
  CoingeckoFeed,
  DefilamaFeed,
  DexScreenerFeed,
  FeedRevolver,
} from "@/src/lib/feed";
import { TORN_MAINNET } from "./fixtures";

// Rate limits.
describe("revolver", () => {
  it("should return token prices on a few networks", async () => {
    const revolver = new FeedRevolver([
      new CoingeckoFeed(),
      new DefilamaFeed(),
      new DexScreenerFeed(),
    ]);
    const price = await revolver.getPrice({
      address: TORN_MAINNET,
      chainId: 1,
    });
    console.log(`torn price`, price);
    expect(price).toBeGreaterThan(0);
  });
});
