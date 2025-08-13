import { ZerionAPI } from "zerion-sdk";
import { TokenQuery } from "../types";
import { IconFeed } from "./interface";

export class ZerionIconFeed implements IconFeed {
  name = "Zerion Icons";
  private zerion: ZerionAPI;

  constructor(apiKey: string) {
    this.zerion = new ZerionAPI(apiKey);
  }
  async getIcon(token: TokenQuery): Promise<string | null> {
    const { attributes } = await this.zerion.getToken(token);
    const iconUrl = attributes.icon?.url;
    if (!iconUrl) {
      console.log("Zerion: No icon found");
      return null;
    }
    return iconUrl;
  }
}
