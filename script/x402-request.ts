// Sample/Test Function Call.

import { Hex, PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { withPayment } from "../example/x402-payment-handler";

function getSigner(): PrivateKeyAccount {
  const signerKey = process.env.SIGNER_KEY;
  if (!signerKey) {
    throw new Error("SIGNER_KEY is not set");
  }

  return privateKeyToAccount(signerKey as Hex);
}

export async function externalPriceFeed(query: {
  chainId: number;
  address: string;
}): Promise<number | null> {
  const priceAgent = "http://localhost:3000/api/tools/prices";
  // const priceAgent = "https://price-agent.vercel.app/api/tools/prices";
  const url = `${priceAgent}?chainId=${query.chainId}&address=${query.address}`;
  const signer = getSigner(); // however you get your signer

  try {
    const response = await withPayment(url, signer);

    if (!response.ok) {
      console.error(
        `API call failed: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const { price } = await response.json();
    return typeof price === "number" ? price : null;
  } catch (error) {
    console.error("Error calling price API:", error);
    return null;
  }
}

externalPriceFeed({
  chainId: 1,
  address: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
}).then(console.log);

// const url = "http://localhost:3000/api/tools/prices?address=0xae7ab96520de3a18e5e111b5eaab095312d7fe84&chainId=1";
// const sampleResponse = {
//   x402Version: 1,
//   error: "X-PAYMENT header is required",
//   accepts: [
//     {
//       scheme: "exact",
//       network: "base",
//       maxAmountRequired: "1000",
//       resource: "http://localhost:3000/api/tools/prices",
//       description: "Protected API endpoint",
//       mimeType: "application/json",
//       payTo: "0x54F08c27e75BeA0cdDdb8aA9D69FD61551B19BbA",
//       maxTimeoutSeconds: 300,
//       asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
//       extra: {
//         name: "USD Coin",
//         version: "2",
//       },
//     },
//   ],
// };
// const signerKey = process.env.SIGNER_KEY;
// if (!signerKey) {
//   throw new Error("SIGNER_KEY is not set");
// }
// const signer = createWalletClient({
//     account: privateKeyToAccount(signerKey as Hex),
//     chain: chainMap[network],
//     transport: http(),
//   }).extend(publicActions);

// handlePaymentRequiredResponse(url, sampleResponse);
