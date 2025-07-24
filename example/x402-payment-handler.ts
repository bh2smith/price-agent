import {
  Chain,
  Hex,
  encodeAbiParameters,
  getAddress,
  keccak256,
  PrivateKeyAccount,
  HttpTransport,
  WalletClient,
  createWalletClient,
  http,
  publicActions,
} from "viem";
import {
  base,
  baseSepolia,
  avalanche,
  avalancheFuji,
  iotex,
} from "viem/chains";
import { PaymentRequirementsSchema, Network } from "x402/types";
import { randomBytes } from "crypto";

export type ConnectedWallet = WalletClient<
  HttpTransport,
  undefined, // Chain
  PrivateKeyAccount
>;

interface PaymentAccept {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
  extra: {
    name: string;
    version: string;
    [key: string]: unknown; // In case extra can have more fields
  };
}

export interface PaymentRequiredResponse {
  x402Version: number;
  error: string;
  accepts: PaymentAccept[];
}

// // Currently supported x402 networks. https://docs.cdp.coinbase.com/get-started/supported-networks
const chainMap: Record<Network, Chain> = {
  ["base"]: base,
  ["base-sepolia"]: baseSepolia,
  ["avalanche"]: avalanche,
  ["avalanche-fuji"]: avalancheFuji,
  ["iotex"]: iotex,
};

export async function handlePaymentRequiredResponse(
  url: string,
  signer: PrivateKeyAccount,
  paymentRequiredResponse: PaymentRequiredResponse,
) {
  // TODO(bh2smith): Handle accepts.length > 1!
  const { network, payTo, maxAmountRequired, maxTimeoutSeconds } =
    PaymentRequirementsSchema.parse(paymentRequiredResponse.accepts[0]);

  const wallet = createWalletClient({
    account: signer,
    chain: chainMap[network],
    transport: http(),
  }).extend(publicActions);

  const from = signer.address;
  const to = getAddress(payTo);
  const value = maxAmountRequired;
  const validAfter = "0";
  const validBefore = Math.floor(
    Date.now() / 1000 + maxTimeoutSeconds,
  ).toString();
  const nonce: Hex = `0x${randomBytes(32).toString("hex")}`;
  // 1. Encode the authorization data (x402 Permits)
  const encoded = encodeAbiParameters(
    [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
    ],
    [from, to, BigInt(value), BigInt(validAfter), BigInt(validBefore), nonce],
  );

  // 2. Hash & sign the encoded payload.
  const signature = await wallet.signMessage({
    message: { raw: keccak256(encoded) },
  });

  // 3. Construct the final `X-PAYMENT` header payload
  const x402Payload = {
    x402Version: 1,
    scheme: "exact",
    network,
    payload: {
      signature,
      authorization: {
        from,
        to,
        value,
        validAfter,
        validBefore,
        nonce,
      },
    },
  };

  // 5. Encode as base64
  const xPaymentHeader = Buffer.from(JSON.stringify(x402Payload)).toString(
    "base64",
  );

  return fetch(url, {
    headers: {
      "X-PAYMENT": xPaymentHeader,
    },
  });
}

export async function withPayment(
  url: string,
  signer: PrivateKeyAccount,
  fetchFn = fetch, // allow injection for testing/mocking
): Promise<Response> {
  // 1. Try the request without payment
  let response = await fetchFn(url);

  // 2. If 402, parse payment requirements and retry with payment
  if (response.status === 402) {
    const paymentRequiredData: PaymentRequiredResponse = await response.json();
    console.log("Payment required - using signer", signer.address);
    // handlePaymentRequiredResponse will perform the payment and return the paid response
    response = await handlePaymentRequiredResponse(
      url,
      signer,
      paymentRequiredData,
    );
    console.log("Response", await response.json());
  }
  console.log("No payment required");
  return response;
}
