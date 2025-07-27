// Unit tests for coingecko.ts
import { QuorumFeed } from "@/src/lib/quorum";
import { TORN_MAINNET, XCOMB_GNOSIS, WETH_BASE } from "./fixtures";

// Rate limits.
describe.skip("quorum", () => {
  it("should return token prices on a few networks", async () => {
    const revolver = QuorumFeed.withAllSources();
    const prices = await Promise.all(
      [TORN_MAINNET, XCOMB_GNOSIS, WETH_BASE].map(async (token) => {
        const resp = await revolver.getPrice(token);
        if (resp) {
          expect(resp.price).toBeGreaterThan(0);
        }
        return resp;
      }),
    );
    console.log(prices);
  });
});
