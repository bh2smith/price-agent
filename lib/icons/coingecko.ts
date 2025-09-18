import Coingecko from "@coingecko/coingecko-typescript";
import { IconFeed } from "./interface";
import { isNativeAsset } from "../catch-eth";
import { NATIVE_ASSET_ICONS, supportedChainIds, tokenId } from "./common";
import { getAddress } from "viem";
import { TokenQuery } from "../schema";

export class CoinGeckoIconFeed implements IconFeed {
  name = "CoinGecko";
  // According to the Coin Gecko Terms of Service: https://www.coingecko.com/en/terms
  canArchive = false;
  client!: Coingecko;
  supportedChains: Record<number, string> = {};
  networkTokens: Record<string, string> = {};
  fetchedChains = new Set<number>();

  static async init(demo: boolean = true): Promise<CoinGeckoIconFeed> {
    const feed = new CoinGeckoIconFeed();

    feed.client = new Coingecko({
      ...(demo
        ? {
            environment: "demo",
            demoAPIKey: process.env["COINGECKO_DEMO_API_KEY"],
          }
        : {
            environment: "pro",
            proAPIKey: process.env["COINGECKO_PRO_API_KEY"],
          }),
    });

    console.log("CoinGecko: Requesting all chains");
    const platforms = await feed.client.assetPlatforms.get();
    const chainz = platforms.filter(
      (x) =>
        typeof x.chain_identifier === "number" &&
        supportedChainIds.includes(x.chain_identifier),
    );
    for (const p of chainz) {
      if (p.id) {
        feed.supportedChains[p.chain_identifier!] = p.id;
      } else {
        console.warn("Coingecko unsupported chain", p);
      }
    }

    return feed;
  }

  async getIcon({ address, chainId }: TokenQuery): Promise<string | null> {
    if (isNativeAsset(address)) {
      return NATIVE_ASSET_ICONS[chainId];
    }
    const key = tokenId({ chainId, address });
    if (this.networkTokens[key]) {
      return this.networkTokens[key];
    }
    // Already fetched this chain before. Just return lookup (null if not found).
    if (this.fetchedChains.has(chainId)) {
      return this.networkTokens[key] || null;
    }
    const network = this.supportedChains[chainId];
    if (!network) {
      console.warn("CoinGecko: Unsupported Chain", chainId);
      return null;
    }
    console.log("Requesting all tokens for", network);
    const networkTokens = await this.client.tokenLists.getAllJson(network);
    if (!networkTokens.tokens) {
      console.warn("No tokens found for network", network);
      return null;
    }
    for (const token of networkTokens.tokens) {
      if (token.logoURI && token.address) {
        this.networkTokens[
          tokenId({ address: getAddress(token.address), chainId })
        ] = token.logoURI;
      }
    }
    // Mark chain as fetched so we don't hit the API again
    this.fetchedChains.add(chainId);
    return this.networkTokens[tokenId({ address, chainId })] || null;
  }
}
