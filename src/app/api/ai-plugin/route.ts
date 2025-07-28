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
          parameters: [
            { $ref: "#/components/parameters/XPaymentHeader" },
            {
              ...addressParam,
              example: "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
            },
            { ...chainIdParam },
          ],
          responses: {
            "200": {
              description: "Price response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      price: {
                        type: "number",
                        description: "The price of the token",
                      },
                      source: {
                        type: "string",
                        description: "The source of the price data",
                      },
                    },
                    required: ["price", "source"],
                  },
                },
              },
            },
            "400": { description: "Missing parameters" },
            "402": { $ref: "#/components/responses/X402PaymentRequired" },
          },
        },
      },
    },
    components: {
      parameters: {
        XPaymentHeader: {
          name: "x-payment",
          in: "header",
          // required: true,
          schema: {
            type: "string",
          },
          description: "Base64-encoded x402 payment authorization payload",
        },
      },
      responses: {
        X402PaymentRequired: {
          description: "Payment required via x402",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/X402PaymentRequired",
              },
            },
          },
        },
      },
      schemas: {
        X402PaymentRequired: {
          type: "object",
          properties: {
            x402Version: { type: "number", example: 1 },
            error: { type: "string", example: "X-PAYMENT header is required" },
            accepts: {
              type: "array",
              items: { $ref: "#/components/schemas/X402Accept" },
            },
          },
          required: ["x402Version", "error", "accepts"],
        },
        X402Accept: {
          type: "object",
          properties: {
            scheme: { type: "string", enum: ["exact"] },
            network: {
              type: "string",
              enum: [
                "base",
                "base-sepolia",
                "avalanche",
                "avalanche-fuji",
                "iotex",
              ],
            },
            maxAmountRequired: {
              type: "string",
              description: "Wei Amount of required payment (not token units)",
            },
            resource: { type: "string", format: "uri" },
            description: { type: "string" },
            mimeType: { type: "string" },
            payTo: { type: "string" },
            maxTimeoutSeconds: { type: "integer" },
            asset: { type: "string" },
            extra: {
              type: "object",
              properties: {
                name: { type: "string" },
                version: { type: "string" },
              },
              required: ["name", "version"],
            },
          },
          required: [
            "scheme",
            "network",
            "maxAmountRequired",
            "resource",
            "description",
            "mimeType",
            "payTo",
            "maxTimeoutSeconds",
            "asset",
            "extra",
          ],
        },
      },
    },
  };

  return NextResponse.json(pluginData);
}
