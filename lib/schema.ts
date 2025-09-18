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

export const TokenQuerySchema = z.object({
  address: evmAddressSchema,
  chainId: z.coerce.number(),
});

export type TokenQuery = z.infer<typeof TokenQuerySchema>;

type ValidationResult<T> =
  | { ok: true; query: T }
  | { ok: false; error: string };

/** If you only need single-use validation */
export function validateQuery<S extends z.ZodTypeAny>(
  params: URLSearchParams,
  schema: S,
): ValidationResult<z.infer<S>> {
  const input = Object.fromEntries(params); // see array-safe version below
  const result = schema.safeParse(input);
  return result.success
    ? { ok: true, query: result.data }
    : { ok: false, error: result.error.message };
}
