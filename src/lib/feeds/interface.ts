import { TokenQuery } from "../types";

export interface PriceResponse {
  price: number;
  source: string;
}
export interface PriceFeed {
  name: string;
  getPrice(token: TokenQuery): Promise<PriceResponse | null>;
}
