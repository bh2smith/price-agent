import { ZerionAPI } from "zerion-sdk";
import { type Address, getAddress } from "viem";
import { Network } from "near-ca";
import { getNativeAsset, isNativeAsset } from "./catch-eth";

const bucketUrl = "https://storage.googleapis.com/bitte-public";
const tokensUrl = `${bucketUrl}/intents/tokens`;
const chainsUrl = `${bucketUrl}/intents/chains`;

export const NATIVE_ASSET_ICONS: Record<number, string> = {
  1: `${tokensUrl}/eth_token.svg`,
  100: `${tokensUrl}/xdai_token.svg`,
  137: `${chainsUrl}/polygon.svg`, // TODO: GET TOKEN.
  8453: `${tokensUrl}/eth_token.svg`,
  42161: `${tokensUrl}/eth_token.svg`,
  43114: `${chainsUrl}/avax.svg`, // TODO: GET TOKEN.
  11155111: `${tokensUrl}/eth_token.svg`,
};

export const CHAIN_ICONS: Record<number, string> = {
  1: `${chainsUrl}/eth.svg`,
  100: `${chainsUrl}/gnosis.svg`,
  137: `${chainsUrl}/polygon.svg`,
  8453: `${chainsUrl}/base.svg`,
  42161: `${chainsUrl}/arbi.svg`,
  43114: `${chainsUrl}/avax.svg`,
  11155111: `${chainsUrl}/eth.svg`,
};

export async function getCowLogoUri(
  address: string,
  chainId: number,
): Promise<string | undefined> {
  if (isNativeAsset(address)) {
    return NATIVE_ASSET_ICONS[chainId];
  }
  const baseUrl = `https://raw.githubusercontent.com/cowprotocol/token-lists/main/src/public/images/${chainId}/${address}/logo.png`;
  // Check it URL resolves.
  const res = await fetch(baseUrl);
  if (res.ok) {
    return baseUrl;
  }
  return undefined;
}

export async function getTokenMeta(
  zerionKey: string,
  chainId: number,
  address: string,
): Promise<{ icon?: string; price: number }> {
  // Note: Zerion uses lower case addresses for some reason.
  const zerion = new ZerionAPI(zerionKey);
  if (isNativeAsset(address)) {
    // TODO: Cache this data (we only need the ID)
    const chains = await zerion.getChains(true);
    const relevantChain = chains.filter(
      (x) => BigInt(x.attributes.external_id) === BigInt(chainId),
    );
    if (relevantChain.length === 0) {
      throw new Error(`Wrapped Token not found for chainId=${chainId}`);
    }

    const wrappedAsset = relevantChain[0].relationships.wrapped_native_fungible;
    const wethFallback = getNativeAsset(chainId).toLowerCase();
    const { attributes } = await zerion.fungibles(
      wrappedAsset?.data.id || wethFallback,
    );
    return {
      icon: NATIVE_ASSET_ICONS[chainId],
      price: attributes.market_data.price,
    };
  }
  try {
    const { attributes } = await zerion.fungibles(address.toLowerCase());
    return {
      icon: attributes.icon.url,
      price: attributes.market_data.price,
    };
  } catch (error) {
    console.warn(`Token Meta not found for ${chainId}:${address}`, error);
    const icon = await getCowLogoUri(address, chainId);
    return {
      ...(icon !== undefined && { icon }),
      price: 0,
    };
  }
}
