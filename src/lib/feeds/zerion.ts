import { ZerionAPI } from "zerion-sdk";
import { catchNativeAsset } from "../catch-eth";
import { TokenQuery } from "../types";
import { PriceFeed } from "./interface";

export class ZerionFeed implements PriceFeed {
  public get name(): string {
    return "Zerion";
  }

  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getPrice(token: TokenQuery): Promise<number | null> {
    const address = await catchNativeAsset(token);
    const zerion = new ZerionAPI(this.apiKey);

    try {
      const tokenData = await zerion.getToken({
        ...token,
        address,
      });
      return tokenData.attributes.market_data.price;
    } catch (error) {
      console.warn(
        `Token Meta not found for ${token.chainId}:${address}`,
        error,
      );
      return null;
    }
  }
}
