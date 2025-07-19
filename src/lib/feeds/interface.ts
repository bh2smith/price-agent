import { PriceQuery } from "../types";

export interface FeedSource {
  name: string;
  getPrice(token: PriceQuery): Promise<number | null>;
}
