import { getAddress } from "viem";
import { TORN_MAINNET, TRUMP_BASE } from "../fixtures";
import { SmolDappIcons } from "@/lib/icons/smoldapp";
// Fetching icon for 42161:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
describe("Smol Icons", () => {
  it("should retrieve and archive token icons", async () => {
    const zerion = new SmolDappIcons();
    await expect(zerion.getIcon(TORN_MAINNET)).toBeDefined();
    await expect(zerion.getIcon(TRUMP_BASE)).toBeDefined();
    const chainId = 1;
    const tokens = [
      "0x0bee91533be2ede0936ea53457ce7bd9b0b398c6",
      "0x7eb4db4dddb16a329c5ade17a8a0178331267e28",
      "0x637f415687b7b2545ef2cd8dcc1614e1cc175850",
      "0x4dafe1db6b10a4cd82002798ad78b7ee3869c7c2",
      "0x73a15fed60bf67631dc6cd7bc5b6e8da8190acf5",
      "0x71a91302def71cc9f79da10f478aa84a8e1ccde3",
      "0xbffa38c3bd664830f4b5180b9c6332e467f5a657",
    ].map(getAddress);
    for (const address of tokens) {
      await expect(zerion.getIcon({ chainId, address })).toBeDefined();
    }
  });
});
