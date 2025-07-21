// Unit tests for coingecko.ts

import { NATIVE_ASSET } from "@/src/lib/catch-eth";
import { getTokenPrice } from "@/src/lib/feeds/coingecko";
import { TokenQuery } from "@/src/lib/types";
import { SAMPLE_TOKENS } from "../fixtures";

const USDC_BASE = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
const USDC_GNOSIS = "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83";
const USDC_POLYGON = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";

// Rate limits.
describe("coingecko", () => {
  it.skip("should return token prices on a few networks", async () => {
    await expect(
      getTokenPrice({ address: USDC_BASE, chainId: 8453 }),
    ).resolves.not.toBeNull();
    await expect(
      getTokenPrice({ address: USDC_POLYGON, chainId: 137 }),
    ).resolves.not.toBeNull();
    await expect(
      getTokenPrice({ address: USDC_GNOSIS, chainId: 100 }),
    ).resolves.not.toBeNull();
  });

  it.skip("native asset prices", async () => {
    for (const chainId of [1, 137, 100]) {
      const price = await getTokenPrice({ address: NATIVE_ASSET, chainId });
      console.log(`${chainId} price`, price);
      expect(price).toBeGreaterThan(0);
    }
  });
});
