import { ZerionAPI } from "zerion-sdk";
import { catchNativeAsset } from "../catch-eth";
import { TokenQuery } from "../types";
import { PriceFeed, PriceResponse } from "./interface";

export class ZerionFeed implements PriceFeed {
  public get name(): string {
    return "Zerion";
  }

  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getPrice(token: TokenQuery): Promise<PriceResponse | null> {
    const address = await catchNativeAsset(token);
    const zerion = new ZerionAPI(this.apiKey);

    try {
      const tokenData = await zerion.getToken({
        ...token,
        address,
      });
      const price = tokenData.attributes.market_data.price;
      if (price) {
        return { price, source: this.name };
      }
      return null;
    } catch (error) {
      console.warn(
        `Token Meta not found for ${token.chainId}:${address}`,
        error,
      );
      return null;
    }
  }
}
