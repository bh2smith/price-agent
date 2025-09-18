import { isNativeAsset } from "../catch-eth";
import { TokenQuery } from "../schema";
import { NATIVE_ASSET_ICONS } from "./common";
import { IconFeed } from "./interface";

export const CHAIN_MAP: Record<number, string> = {
  1: `ethereum`,
  10: `optimism`,
  56: `bsc`,
  100: `gnosis`, // maybe xdai
  137: `polygon`,
  8453: `base`,
  42161: `arbitrum`,
  42220: `celo`,
  43114: `avalanche`,
  81457: `blast`,
  11155111: `sepolia`,
};

// TODO(bh2smith): This is a shitty unreliable source.
// We should attempt to fetch the token and scrape the icon from the return data.
export class DexScreenerIcons implements IconFeed {
  name = "DexScreener";
  canArchive = true;
  bucketUrl = "https://dd.dexscreener.com/ds-data/tokens";
  async getIcon({ address, chainId }: TokenQuery): Promise<string | null> {
    if (isNativeAsset(address)) {
      return NATIVE_ASSET_ICONS[chainId];
    }
    const chain = CHAIN_MAP[chainId];
    if (!chain) {
      console.warn("undefined dex-screener chain for", chainId);
    }
    // ethereum/0xe485e2f1bab389c08721b291f6b59780fec83fd7.png
    const fullUrl = `${this.bucketUrl}/${chain}/${address}.png`;
    // Check it URL resolves.
    const res = await fetch(fullUrl);
    if (res.ok) {
      return fullUrl;
    }
    return null;
  }
}
