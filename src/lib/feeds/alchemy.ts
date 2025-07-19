import { catchNativeAsset } from "../catch-eth";
import { PriceQuery } from "../types";
import { FeedSource } from "./interface";

// Network mapping for Alchemy API
const ALCHEMY_NETWORK_MAP: Record<number, string> = {
  1: "eth-mainnet",
  100: "gnosis-mainnet",
  137: "polygon-mainnet",
  8453: "base-mainnet",
  42161: "arb-mainnet",
  43114: "avax-mainnet",
};

interface Price {
  currency: string;
  value: string;
  lastUpdatedAt: string;
}

interface PriceEntry {
  network: string;
  address: string;
  prices: Price[];
  error: string;
}

interface PriceDataResponse {
  data: PriceEntry[];
}

export class AlchemyFeed implements FeedSource {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public get name(): string {
    return "Alchemy";
  }
  async getPrice(token: PriceQuery): Promise<number | null> {
    const address = await catchNativeAsset(token);
    const addressKey = `${token.chainId}:${token.address.toLowerCase()}`;

    const network = ALCHEMY_NETWORK_MAP[token.chainId];
    if (!network) {
      console.warn(`Unsupported chain ID: ${token.chainId}`);
      return null;
    }

    const url = `https://api.g.alchemy.com/prices/v1/${this.apiKey}/tokens/by-address`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addresses: [
            {
              network,
              address: address.toLowerCase(),
            },
          ],
        }),
      });

      if (!response.ok) {
        console.warn(`Alchemy error for ${addressKey}`, response);
        return null;
      }

      const data = await response.json();
      if (!isPriceDataResponse(data)) {
        console.warn(`Invalid response format for ${addressKey}`);
        return null;
      }

      const tokenData = data.data[0];
      if (
        !tokenData.prices ||
        !Array.isArray(tokenData.prices) ||
        tokenData.prices.length === 0
      ) {
        console.warn(`No price data found for ${addressKey}`);
        return null;
      }

      const usdPrice = tokenData.prices.find(
        (price: { currency: string; value: string }) =>
          price.currency === "usd",
      );
      if (!usdPrice || typeof usdPrice.value !== "string") {
        console.warn(`No USD price found for ${addressKey}`);
        return null;
      }

      return parseFloat(usdPrice.value);
    } catch (error) {
      console.error(
        `Error fetching price from Alchemy for ${addressKey}:`,
        error,
      );
      return null;
    }
  }
}

// TypeGuard functions
function isPrice(obj: unknown): obj is Price {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Price).currency === "string" &&
    typeof (obj as Price).value === "string" &&
    typeof (obj as Price).lastUpdatedAt === "string"
  );
}

function isPriceEntry(obj: unknown): obj is PriceEntry {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as PriceEntry).network === "string" &&
    typeof (obj as PriceEntry).address === "string" &&
    Array.isArray((obj as PriceEntry).prices) &&
    (obj as PriceEntry).prices.every(isPrice) &&
    typeof (obj as PriceEntry).error === "string"
  );
}

function isPriceDataResponse(obj: unknown): obj is PriceDataResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Array.isArray((obj as PriceDataResponse).data) &&
    (obj as PriceDataResponse).data.length > 0 &&
    (obj as PriceDataResponse).data.every(isPriceEntry)
  );
}
