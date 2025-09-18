// Unit tests for coingecko.ts
import { FeedRevolver } from "@/lib/prices/revolver";
import { TORN_MAINNET, XCOMB_GNOSIS, TRUMP_BASE } from "./fixtures";

// Rate limits.
describe.skip("revolver", () => {
  it("should return token prices on a few networks", async () => {
    const revolver = FeedRevolver.withAllSources();
    const prices = await Promise.all(
      [TORN_MAINNET, XCOMB_GNOSIS, TRUMP_BASE].map(async (token) => {
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
