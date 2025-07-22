import { Address } from "viem";

export interface TokenQuery {
  address: Address;
  chainId: number;
}
