import { TokenQuery } from "../types";

export interface IconFeed {
  name: string;
  getIcon(token: TokenQuery): Promise<string | null>;
}
