import { HonoRequest } from "hono";
import { ValidationResult } from "../types";
// import { type Address, isAddress } from "viem";

export interface PriceQuery {
  tokenAddress: string;
  chainId: number;
}

export function validate(req: HonoRequest): ValidationResult<PriceQuery> {
  const tokenAddress = req.query("tokenAddress");
  const chainId = req.query("chainId");

  // Validate presence
  if (!tokenAddress || !chainId) {
    return { ok: false, error: "Missing tokenAddress or chainId" };
  }

  // Validate chainId is a number
  if (isNaN(Number(chainId)) || !Number.isInteger(Number(chainId))) {
    return { ok: false, error: "chainId must be an integer" };
  }

  //   // Validate tokenAddress is a valid address
  //   if (!isAddress(tokenAddress)) {
  //     return { ok: false, error: "tokenAddress must be a valid address" };
  //   }

  return { ok: true, query: { tokenAddress, chainId: Number(chainId) } };
}

export function getTokenPrice(query: PriceQuery): string {
  // TODO: Implement real price fetching logic
  return "123.45";
}
