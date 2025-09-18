import { NextRequest } from "next/server";
import { TokenQuery, TokenQuerySchema } from "@/lib/schema";
import { toolRouter } from "@/lib/route-tool";

const logic = (x: TokenQuery) => ({
  todo: "implement route",
  query: x,
});

export async function GET(request: NextRequest) {
  return toolRouter(request, TokenQuerySchema, logic, "token");
}
