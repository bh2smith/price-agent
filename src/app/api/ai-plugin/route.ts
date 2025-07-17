import { NextResponse } from "next/server";
import { ACCOUNT_ID, PLUGIN_URL, SUPPORTED_NETWORKS } from "../../config";
import { chainIdParam, addressParam } from "@bitte-ai/agent-sdk";

export async function GET() {
  const pluginData = {
    openapi: "3.0.0",
    info: {
      title: "Bitte Token Data Agent",
      description: "An aggretaion of curated token data from various sources.",
      version: "1.0.0",
    },
    servers: [{ url: PLUGIN_URL }],
    "x-mb": {
      "account-id": ACCOUNT_ID,
      assistant: {
        name: "Token Data",
        description:
          "Token Data Aggregator. Great for the latest prices, icons, decimals, and more.",
        instructions:
          "You are a a data provider. It is your duty to accurately respond to requests about EVM Tokens. In particular, prices, iconUri, decmials, name, symbol and even data about corresponding tokens on other networks.",
        tools: [],
        image: `${PLUGIN_URL}/logo.png`,
        chainIds: SUPPORTED_NETWORKS,
      },
    },
    paths: {
      "/api/tools/prices": {
        get: {
          tags: ["prices"],
          operationId: "getPrice",
          summary: "Get token price",
          description:
            "Returns the price for a given token address and chain ID.",
          parameters: [{ ...addressParam }, { ...chainIdParam }],
          responses: {
            "200": {
              description: "Price response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      address: { type: "string" },
                      chainId: { type: "number" },
                      price: { type: "number" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Missing parameters",
            },
          },
        },
      },
    },
  };

  return NextResponse.json(pluginData);
}
