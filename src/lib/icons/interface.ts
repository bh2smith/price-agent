import { TokenQuery } from "../types";

export interface IconFeed {
  name: string;
  canArchive: boolean;
  getIcon(token: TokenQuery): Promise<string | null>;
}
