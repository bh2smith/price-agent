import path from "path";
import csv from "csv-parser";
import { getZerionKey } from "@/src/app/config";
import { ZerionIconFeed } from "@/src/lib/icons/zerion";
import fs from "node:fs";
import { getAddress } from "viem";
import { S3Archive } from "@/src/lib/icons";
import { DexScreenerIcons } from "@/src/lib/icons/dex-screener";
import { SmolDappIcons } from "@/src/lib/icons/smoldapp";

const INPUT_CSV = "input.csv";
const OUTPUT_DIR = "downloaded-icons";

async function main() {
  const archive = new S3Archive([
    new SmolDappIcons(),
    new DexScreenerIcons(),
    new ZerionIconFeed(getZerionKey()),
  ]);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  // Load all rows into an array
  const rows: { chainId: string; address: string }[] = [];
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(INPUT_CSV)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  // Process each row sequentially
  for (const { chainId, address } of rows) {
    await archive.getIcon({
      chainId: Number(chainId),
      address: getAddress(address),
    });
    // sleep for 0.5 seconds
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  console.log("Done processing CSV.");
}

main().catch(console.error);
