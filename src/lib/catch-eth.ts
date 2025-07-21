import { Network } from "near-ca";
import { TokenQuery } from "./types";
import { Address, getAddress } from "viem";

export const NATIVE_ASSET = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export function isNativeAsset(token?: string): boolean {
  return (
    token === undefined || token.toLowerCase() === NATIVE_ASSET.toLowerCase()
  );
}

export function getNativeAsset(chainId: number): Address {
  const network = Network.fromChainId(chainId);
  const wethAddress = network.nativeCurrency.wrappedAddress;
  if (!wethAddress) {
    throw new Error(
      `Couldn't find wrapped address for Network ${network.name} (chainId=${chainId})`,
    );
  }
  return getAddress(wethAddress);
}

export async function catchNativeAsset({
  address,
  chainId,
}: TokenQuery): Promise<Address> {
  return isNativeAsset(address) ? getNativeAsset(chainId) : address;
}
