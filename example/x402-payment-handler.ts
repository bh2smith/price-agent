/**
 * This file is just a manual implementation of some of the tools provided in x402.
 * At some point, we may want to go beyond the capabilities of thier dependency to handle things like:
 * 1. Validate user request input before hitting paywall
 * 2. Issue User Refunds on Server Errors.
 * 3. Dynamically compute fees based on (e.g. size of) request input.
 */
import {
  Chain,
  getAddress,
  PrivateKeyAccount,
  HttpTransport,
  WalletClient,
  createWalletClient,
  http,
  publicActions,
  Address,
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

const x402TypedData = {
  types: {
    TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
    ],
  },
  primaryType: "TransferWithAuthorization" as const,
};

// // Currently supported x402 networks. https://docs.cdp.coinbase.com/get-started/supported-networks
const chainMap: Record<Network, Chain> = {
  ["base"]: base,
  ["base-sepolia"]: baseSepolia,
  ["avalanche"]: avalanche,
  ["avalanche-fuji"]: avalancheFuji,
  ["iotex"]: iotex,
};

export function encodeTransferWithAuthorizationFor(
  from: Address,
  paymentRequiredResponse: PaymentRequiredResponse,
) {
  // TODO(bh2smith): Handle accepts.length > 1!
  const { network, payTo, maxAmountRequired, maxTimeoutSeconds, extra, asset } =
    PaymentRequirementsSchema.parse(paymentRequiredResponse.accepts[0]);
  const chain = chainMap[network];

  // Encode TypedData for TransferWithAuthorization (i.e. x402-Permit)
  const typedData = {
    ...x402TypedData,
    domain: {
      name: extra?.name,
      version: extra?.version,
      chainId: chain.id,
      verifyingContract: getAddress(asset),
    },
    message: {
      from,
      to: getAddress(payTo),
      value: BigInt(maxAmountRequired),
      validAfter: BigInt("0"),
      validBefore: BigInt(
        Math.floor(Date.now() / 1000 + maxTimeoutSeconds).toString(),
      ),
      nonce: `0x${randomBytes(32).toString("hex")}`,
    },
  };
  return { typedData, network, chain };
}

export async function handlePaymentRequiredResponse(
  url: string,
  signer: PrivateKeyAccount,
  paymentRequiredResponse: PaymentRequiredResponse,
) {
  const { typedData, network, chain } = encodeTransferWithAuthorizationFor(
    signer.address,
    paymentRequiredResponse,
  );
  const wallet = createWalletClient({
    account: signer,
    chain,
    transport: http(),
  }).extend(publicActions);

  const signature = await wallet.signTypedData(typedData);

  // Construct the final `X-PAYMENT` header payload
  // Convert BigInts in typedData.message to strings for JSON serialization
  const authorization = Object.fromEntries(
    Object.entries(typedData.message).map(([k, v]) => [
      k,
      typeof v === "bigint" ? v.toString() : v,
    ]),
  );
  const x402Payload = {
    x402Version: 1,
    scheme: "exact",
    network,
    payload: {
      signature,
      authorization,
    },
  };

  return fetch(url, {
    headers: {
      "X-PAYMENT": Buffer.from(JSON.stringify(x402Payload)).toString("base64"),
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
    try {
      // handlePaymentRequiredResponse will perform the payment and return the paid response
      response = await handlePaymentRequiredResponse(
        url,
        signer,
        paymentRequiredData,
      );
      const responseHeader = response.headers.get("x-payment-response");
      if (responseHeader) {
        console.log(
          "Response",
          Buffer.from(responseHeader, "base64").toString("utf-8"),
        );
      }
    } catch (error) {
      console.error("Error handling payment required response", error);
    }
  }
  return response;
}
