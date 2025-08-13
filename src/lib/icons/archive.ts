// ... existing code ...
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getEnvVar, getZerionKey } from "@/src/app/config";
import { TokenQuery } from "../types";
import { IconFeed } from "./interface";
import { DexScreenerIcons } from "./dex-screener";
import { ZerionIconFeed } from "./zerion";

class S3Archive implements IconFeed {
  private s3: S3Client;
  private bucket: string;
  private publicUrl: string;
  private sources: IconFeed[];
  name: string = "Archiving Icon Feed";

  constructor(sources: IconFeed[]) {
    this.s3 = new S3Client({
      region: "auto",
      endpoint: getEnvVar("S3_ENDPOINT"),
      credentials: {
        accessKeyId: getEnvVar("S3_ACCESS_KEY"),
        secretAccessKey: getEnvVar("S3_SECRET_KEY"),
      },
      forcePathStyle: false,
    });
    this.bucket = getEnvVar("S3_BUCKET");
    this.publicUrl = getEnvVar("S3_PUBLIC_URL");
    this.sources = sources;
  }

  static withAllSources(): S3Archive {
    return new S3Archive([
      new DexScreenerIcons(),
      new ZerionIconFeed(getZerionKey()),
    ]);
  }

  async getIcon(token: TokenQuery): Promise<string | null> {
    if (await this.iconExists(token)) {
      return this.getIconUrl(token);
    }
    const iconUrl = await this.fetchFromAnySource(token);
    if (!iconUrl) {
      // Couldn't find from any source.
      return null;
    }
    try {
      const response = await fetch(iconUrl);
      const buffer = await response.blob();
      await this.uploadIcon({
        token,
        buffer: Buffer.from(await buffer.arrayBuffer()),
      });
    } catch (error) {
      console.error(error);
    }
    return iconUrl;
  }

  // Attempts to get icon from all of this.source. Returns the first non-null item.
  async fetchFromAnySource(token: TokenQuery): Promise<string | null> {
    for (const source of this.sources) {
      try {
        const icon = await source.getIcon(token);
        if (icon) {
          return icon;
        }
      } catch (err) {
        console.error(`Error fetching from ${source.name}:`, err);
      }
    }
    return null;
  }

  private getKey({ chainId, address }: TokenQuery): string {
    return `tokens/${chainId}/${address}.png`;
  }

  getIconUrl(args: TokenQuery): string {
    return `${this.publicUrl}/${this.getKey(args)}`;
  }

  async iconExists(args: TokenQuery): Promise<boolean> {
    const key = this.getKey(args);
    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === "NotFound" || err.message === "Not Found") {
          return false;
        }
      }
      throw err; // rethrow if it's a different error
    }
  }

  async uploadIcon({
    token,
    buffer,
  }: {
    token: TokenQuery;
    buffer: Buffer;
  }): Promise<void> {
    if (await this.iconExists(token)) {
      return;
    }
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: this.getKey(token),
        Body: buffer,
        ContentType: "image/png",
      }),
    );
    console.log(`Uploaded icon to ${this.getIconUrl(token)}`);
  }
}

export { S3Archive };
