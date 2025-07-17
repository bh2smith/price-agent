import { ZerionAPI } from "zerion-sdk";
import { type Address, getAddress } from "viem";
import { Network } from "near-ca";

const bucketUrl = "https://storage.googleapis.com/bitte-public";
const tokensUrl = `${bucketUrl}/intents/tokens`;
const chainsUrl = `${bucketUrl}/intents/chains`;

export const NATIVE_ASSET = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export function isNativeAsset(token?: string): boolean {
  return (
    token === undefined || token.toLowerCase() === NATIVE_ASSET.toLowerCase()
  );
}

type NativeAsset = {
  address: Address;
  symbol: string;
  scanUrl: string;
  decimals: number;
};

export function getNativeAsset(chainId: number): NativeAsset {
  const network = Network.fromChainId(chainId);
  const wethAddress = network.nativeCurrency.wrappedAddress;
  if (!wethAddress) {
    throw new Error(
      `Couldn't find wrapped address for Network ${network.name} (chainId=${chainId})`,
    );
  }
  return {
    address: getAddress(wethAddress),
    symbol: network.nativeCurrency.symbol,
    scanUrl: `${network.scanUrl}/address/${wethAddress}`,
    decimals: network.nativeCurrency.decimals,
  };
}

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

export async function altGetTokenLogoUri(
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
    const wethFallback = getNativeAsset(chainId).address.toLowerCase();
    const token = await zerion.fungibles(wrappedAsset?.data.id || wethFallback);
    return {
      icon: NATIVE_ASSET_ICONS[chainId],
      price: token.attributes.market_data.price,
    };
  }
  try {
    const token = await zerion.fungibles(address.toLowerCase());
    return {
      icon: token.attributes.icon.url,
      price: token.attributes.market_data.price,
    };
  } catch (error) {
    console.warn("Token Meta", error);
    const icon = await altGetTokenLogoUri(address, chainId);
    return {
      ...(icon !== undefined && { icon }),
      price: 0,
    };
  }
}
