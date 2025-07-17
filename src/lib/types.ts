import { Address } from "viem";

export interface PriceQuery {
  address: Address;
  chainId: number;
}
