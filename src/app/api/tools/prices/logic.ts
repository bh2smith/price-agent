import { FeedRevolver, PriceResponse } from "@/lib/prices";
import { TokenQuery } from "@/lib/schema";

// Simple in-memory cache for price results
const priceCache = new Map<string, { price: number; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute in milliseconds

export async function getTokenPrice(query: TokenQuery): Promise<PriceResponse> {
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
