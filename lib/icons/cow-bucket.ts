import { isNativeAsset } from "../catch-eth";
import { TokenQuery } from "../schema";
import { NATIVE_ASSET_ICONS } from "./common";
import { IconFeed } from "./interface";

export class CowBucketIcons implements IconFeed {
  name = "CoW Bucket";
  canArchive = true;
  bucketUrl =
    "https://raw.githubusercontent.com/cowprotocol/token-lists/main/src/public/images/";
  async getIcon({ address, chainId }: TokenQuery): Promise<string | null> {
    if (isNativeAsset(address)) {
      return NATIVE_ASSET_ICONS[chainId];
    }

    const fullUrl = `${this.bucketUrl}/${chainId}/${address}/logo.png`;
    // Check it URL resolves.
    const res = await fetch(fullUrl);
    if (res.ok) {
      return fullUrl;
    }
    return null;
  }
}
