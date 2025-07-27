import { ZerionAPI } from "zerion-sdk";
import { TokenQuery } from "../types";
import { IconFeed } from "./interface";
import { S3Archive } from "./archive";

export class ZerionIconFeed implements IconFeed {
  name = "Zerion Icons";
  private zerion: ZerionAPI;
  private archive: S3Archive | null = null;

  constructor(apiKey: string, enableArchive: boolean = false) {
    this.zerion = new ZerionAPI(apiKey);
    if (enableArchive) {
      try {
        this.archive = new S3Archive();
      } catch (error) {
        console.error("Failed to initialize S3 archive", error);
        this.archive = null;
      }
    }
  }
  async getIcon(token: TokenQuery): Promise<string | null> {
    if (this.archive) {
      const exists = await this.archive.iconExists(token);
      if (exists) {
        console.log(`Icon found in archive: ${this.archive.getIconUrl(token)}`);
        return this.archive.getIconUrl(token);
      }
    }
    const { attributes } = await this.zerion.getToken(token);
    const iconUrl = attributes.icon?.url;
    if (!iconUrl) {
      return null;
    }
    if (!this.archive) {
      return iconUrl;
    }
    try {
      const response = await fetch(iconUrl);
      const buffer = await response.blob();
      await this.archive.uploadIcon({
        token,
        buffer: Buffer.from(await buffer.arrayBuffer()),
      });
    } catch (error) {
      console.error(error);
    }
    // Continue to return the original URL (while we store icons)
    return iconUrl;
  }
}
