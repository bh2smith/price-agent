import { z } from "zod";
import { Address, isAddress } from "viem";

const evmAddressSchema = z.custom<Address>(
  (val: unknown) => {
    return typeof val === "string" && isAddress(val, { strict: false });
  },
  {
    message: "Invalid EVM address",
  },
);

export const PriceQuerySchema = z.object({
  tokenAddress: evmAddressSchema,
  chainId: z.number(),
});
