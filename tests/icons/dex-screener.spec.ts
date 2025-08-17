import { DexScreenerIcons } from "@/src/lib/icons/dex-screener";
import { TRUMP_BASE } from "../fixtures";
import { TokenQuery } from "@/src/lib/types";
// Fetching icon for 8453:0xb96450dcb16e4a30b999cb5f4087bae9c0ffac4e

const ELVIS_BASE: TokenQuery = {
  chainId: 8453,
  address: "0xb96450dcb16e4a30b999cb5f4087bae9c0ffac4e",
};
describe("Dex Screener Icon Archive", () => {
  it("should retrieve token icons", async () => {
    const source = new DexScreenerIcons();
    const icon = await source.getIcon(ELVIS_BASE);
    console.log(icon);
    expect(icon).toBeDefined();
  });
  it("No Icon Found", async () => {
    const source = new DexScreenerIcons();
    const icon = await source.getIcon(TRUMP_BASE);
    expect(icon).toBeNull();
  });
});
