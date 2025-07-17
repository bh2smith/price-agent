import { NextResponse } from "next/server";
import { PriceQuerySchema } from "@/src/app/api/schema";
import { type Address } from "viem";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const validationResult = validateQuery(url.searchParams);
  if (!validationResult.ok) {
    return NextResponse.json(
      { error: validationResult.error },
      { status: 400 },
    );
  }
  console.log("prices/", validationResult.query);
  try {
    const price = getTokenPrice(validationResult.query);
    return NextResponse.json({ price }, { status: 200 });
  } catch (error) {
    const publicMessage = "Error validating payload";
    console.error(publicMessage, error);
    return NextResponse.json({ error: publicMessage }, { status: 500 });
  }
}

export type ValidationResult<T> =
  | { ok: true; query: T }
  | { ok: false; error: string };

function validateQuery(params: URLSearchParams): ValidationResult<PriceQuery> {
  const result = PriceQuerySchema.safeParse(
    Object.fromEntries(params.entries()),
  );
  if (!result.success) {
    return { ok: false, error: result.error.message };
  }
  return { ok: true, query: result.data };
}

interface PriceQuery {
  address: Address;
  chainId: number;
}

interface PriceResponse {
  address: Address;
  chainId: number;
  price: number;
}

function getTokenPrice(query: PriceQuery): PriceResponse {
  console.log("Handle Price Query", query);
  // TODO: Implement real price fetching logic
  return {
    ...query,
    price: 123.45,
  };
}
