import { NextResponse } from "next/server";
import { PriceQuerySchema } from "@/src/app/api/schema";
import { TokenQuery } from "@/src/lib/types";
import { FeedRevolver } from "@/src/lib/revolver";
import { PriceResponse } from "@/src/lib/feeds/interface";

// Simple in-memory cache for price results
const priceCache = new Map<string, { price: number; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute in milliseconds

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
    const price = await getTokenPrice(validationResult.query);
    return NextResponse.json(price, { status: 200 });
  } catch (error) {
    const publicMessage = "Internal Server Error";
    console.error(publicMessage, error);
    return NextResponse.json({ error: publicMessage }, { status: 500 });
  }
}

type ValidationResult<T> =
  | { ok: true; query: T }
  | { ok: false; error: string };

function validateQuery(params: URLSearchParams): ValidationResult<TokenQuery> {
  const result = PriceQuerySchema.safeParse(
    Object.fromEntries(params.entries()),
  );
  if (!result.success) {
    return { ok: false, error: result.error.message };
  }
  return { ok: true, query: result.data };
}

async function getTokenPrice(query: TokenQuery): Promise<PriceResponse> {
  const cacheKey = `${query.chainId}:${query.address}`;
  const now = Date.now();

  // Check cache first
  const cached = priceCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    console.log(`Cache hit for ${cacheKey}: ${cached.price}`);
    return { price: cached.price, source: "cache" };
  }

  // Fetch fresh price
  const revolver = FeedRevolver.withAllSources();
  const res = await revolver.getPrice(query);
  if (!res) {
    throw new Error(`No price found for ${query.chainId}:${query.address}`);
  }

  // Cache the result
  priceCache.set(cacheKey, { price: res.price, timestamp: now });
  console.log(`Cached price for ${cacheKey}: ${res.price}`);

  return res;
}
