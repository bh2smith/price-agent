// Unit tests for alchemy.ts

import { AlchemyFeed, isPriceDataResponse } from "@/src/lib/feeds/alchemy";
import { getAlchemyKey } from "@/src/app/config";

const USDC_BASE = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
const USDC_GNOSIS = "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83";
const USDC_POLYGON = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";

// Rate limits.
describe("alchemy", () => {
  const alchemyFeed = new AlchemyFeed(getAlchemyKey());
  it.skip("should return token prices on a few networks", async () => {
    await expect(
      alchemyFeed.getPrice({ address: USDC_BASE, chainId: 8453 }),
    ).resolves.not.toBeNull();
    await expect(
      alchemyFeed.getPrice({ address: USDC_POLYGON, chainId: 137 }),
    ).resolves.not.toBeNull();
    await expect(
      alchemyFeed.getPrice({ address: USDC_GNOSIS, chainId: 100 }),
    ).resolves.not.toBeNull();
  });

  it("should return token prices on a few networks", async () => {
    const data = {
      data: [
        {
          network: "eth-mainnet",
          address: "0x77777feddddffc19ff86db637967013e6c6a116c",
          prices: [
            {
              currency: "usd",
              value: "11.56795615195",
              lastUpdatedAt: "2025-07-27T06:37:50.747810337Z",
            },
          ],
        },
      ],
    };
    expect(isPriceDataResponse(data)).toBe(true);
  });
});
