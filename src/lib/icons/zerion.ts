import { ZerionAPI } from "zerion-sdk";
import { TokenQuery } from "../types";
import { IconFeed } from "./interface";

export class ZerionIconFeed implements IconFeed {
  name = "Zerion";
  canArchive = true;
  private zerion: ZerionAPI;

  constructor(apiKey: string) {
    this.zerion = new ZerionAPI(apiKey);
  }
  async getIcon(token: TokenQuery): Promise<string | null> {
    try {
      const { attributes } = await this.zerion.getToken(token);
      const iconUrl = attributes.icon?.url;
      if (!iconUrl) {
        return null;
      }
      return iconUrl;
    } catch (err: unknown) {
      console.error((err as Error).message);
      return null;
    }
  }
}
