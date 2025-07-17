import { NextResponse } from "next/server";
import { PriceQuerySchema } from "@/src/app/api/schema";
import { type Address } from "viem";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log("prices/", searchParams);
    const query = PriceQuerySchema.parse(
      Object.fromEntries(searchParams.entries()),
    );
    const price = getTokenPrice(query);
    return NextResponse.json({ price }, { status: 200 });
  } catch (error) {
    const publicMessage = "Error validating payload:";
    console.error(publicMessage, error);
    return NextResponse.json({ error: publicMessage }, { status: 500 });
  }
}

// export type ValidationResult<T> =
//   | { ok: true; query: T }
//   | { ok: false; error: string };

interface PriceQuery {
  tokenAddress: Address;
  chainId: number;
}

function getTokenPrice(query: PriceQuery): string {
  // TODO: Implement real price fetching logic
  return "123.45";
}
