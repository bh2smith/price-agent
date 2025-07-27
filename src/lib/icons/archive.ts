// ... existing code ...
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getEnvVar } from "@/src/app/config";
import { TokenQuery } from "../types";

class S3Archive {
  private s3: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
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
