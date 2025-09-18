import { NextRequest } from "next/server";
import { TokenQuerySchema } from "@/lib/schema";
import { getTokenPrice } from "./logic";
import { toolRouter } from "@/lib/route-tool";

export async function GET(request: NextRequest) {
  return toolRouter(request, TokenQuerySchema, getTokenPrice);
}
