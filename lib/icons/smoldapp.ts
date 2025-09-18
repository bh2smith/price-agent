import { isNativeAsset } from "../catch-eth";
import { TokenQuery } from "../schema";
import { NATIVE_ASSET_ICONS } from "./common";
import { IconFeed } from "./interface";

export class SmolDappIcons implements IconFeed {
  name = "SmolDapp";
  canArchive = true;
  bucketUrl = "https://assets.smold.app/api/token";
  async getIcon({ address, chainId }: TokenQuery): Promise<string | null> {
    if (isNativeAsset(address)) {
      return NATIVE_ASSET_ICONS[chainId];
    }

    const fullUrl = `${this.bucketUrl}/${chainId}/${address}/logo-128.png`;
    // Check it URL resolves.
    const res = await fetch(fullUrl);
    if (res.ok) {
      return fullUrl;
    }
    return null;
  }
}
