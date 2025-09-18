import { Address } from "viem";
import { paymentMiddleware, Network } from "x402-next";
import { facilitator } from "@coinbase/x402";

export function envBool(name: string, defaultValue = false): boolean {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  // Accept common truthy values
  return /^(1|true|yes|on)$/i.test(raw.trim());
}

const useMiddleware = envBool("USE_X402");
const useCdpFacilitator = envBool("USE_CDP_FACILITATOR");

const payTo = (process.env.ADDRESS ||
  "0x54F08c27e75BeA0cdDdb8aA9D69FD61551B19BbA") as Address;
const network = (process.env.NETWORK || "base") as Network;

// Configure facilitator
const facilitatorConfig = useCdpFacilitator ? facilitator : undefined;

// If disabled, return identity middleware
function passthrough(_: Request) {
  return; // no-op → Next.js continues the request
}

export const middleware = useMiddleware
  ? paymentMiddleware(
      payTo,
      {
        "/api/tools/prices": {
          price: "$0.001",
          network,
          config: {
            description: "Protected API endpoint",
          },
        },
      },
      facilitatorConfig,
      {
        appName: "Token Price API",
        appLogo: "/x402-icon-blue.png",
      },
    )
  : passthrough;

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/tools/:path*"],
  runtime: "nodejs", // TEMPORARY: Only needed until Edge runtime support is added
};
