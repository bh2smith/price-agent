import { getZerionKey } from "@/src/app/config";
import { ZerionIconFeed } from "@/src/lib/icons/zerion";
import { TORN_MAINNET, TRUMP_BASE } from "./fixtures";

describe("Zerion Icon Archive", () => {
  it("should retrieve and archive token icons", async () => {
    const zerion = new ZerionIconFeed(getZerionKey(), true);
    const icon = await zerion.getIcon(TORN_MAINNET);
    console.log(icon);
  });
});
