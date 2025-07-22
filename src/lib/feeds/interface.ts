import { TokenQuery } from "../types";

export interface PriceFeed {
  name: string;
  getPrice(token: TokenQuery): Promise<number | null>;
}
