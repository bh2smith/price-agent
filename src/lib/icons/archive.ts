// ... existing code ...
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getEnvVar } from "@/src/app/config";

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

  private getKey(chainId: number, address: string): string {
    return `tokens/${chainId}/${address}.png`;
  }

  getIconUrl(chainId: number, address: string): string {
    return `${this.publicUrl}/${this.getKey(chainId, address)}`;
  }

  async iconExists(chainId: number, address: string): Promise<boolean> {
    const key = this.getKey(chainId, address);
    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return true;
    } catch (err: any) {
      if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw err; // rethrow if it's a different error
    }
  }

  async uploadIcon({
    chainId,
    address,
    buffer,
  }: {
    chainId: number;
    address: string;
    buffer: Buffer;
  }): Promise<void> {
    if (await this.iconExists(chainId, address)) {
      return;
    }
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: this.getKey(chainId, address),
        Body: buffer,
        ContentType: "image/png"
      }),
    );
    console.log(`Uploaded icon to ${this.getIconUrl(chainId, address)}`);
  }
}

export { S3Archive };
