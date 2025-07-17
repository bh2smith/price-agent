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
    const gnosis_weth = "0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1";
    const revolver = new FeedRevolver([
      new CoingeckoFeed(),
      new DefilamaFeed(),
      new DexScreenerFeed(),
    ]);
    const price = await revolver.getPrice({
      address: gnosis_weth,
      chainId: 100,
    });
    expect(price).toBeGreaterThan(0);
  });
});
