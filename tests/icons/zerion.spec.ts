import { getZerionKey } from "@/src/app/config";
import { ZerionIconFeed } from "@/src/lib/icons/zerion";
import {
  TORN_MAINNET,
  TRUMP_BASE,
  USDC_BASE,
  USDC_GNOSIS,
  USDC_POLYGON,
} from "../fixtures";
// Fetching icon for 42161:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
describe("Zerion Icon Archive", () => {
  it.skip("should retrieve and archive token icons", async () => {
    const zerion = new ZerionIconFeed(getZerionKey());
    const icon = await zerion.getIcon(TORN_MAINNET);
    expect(icon).toBeDefined();
  });
  it.skip("No Icon Found", async () => {
    const zerion = new ZerionIconFeed(getZerionKey());
    const icon = await zerion.getIcon(TRUMP_BASE);
    expect(icon).toBeNull();
  });
});
