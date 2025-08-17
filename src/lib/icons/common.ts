import { TokenQuery } from "../types";

const bucketUrl = "https://storage.googleapis.com/bitte-public";
const tokensUrl = `${bucketUrl}/intents/tokens`;
const chainsUrl = `${bucketUrl}/intents/chains`;

// This can be manually extended.
export const supportedChainIds = [
  1, 10, 56, 137, 1868, 8453, 42161, 42220, 43114, 81457,
];

// TODO(bh2smith): Ensure Map Keys contain all supported chains!

export const NATIVE_ASSET_ICONS: Record<number, string> = {
  1: `${tokensUrl}/eth_token.svg`,
  10: `${tokensUrl}/eth_token.svg`,
  56: `${tokensUrl}/bnb.svg`, // TODO: Get Token.
  100: `${tokensUrl}/xdai_token.svg`,
  137: `${chainsUrl}/polygon.svg`, // TODO: GET TOKEN.
  1868: `${tokensUrl}/eth_token.svg`,
  8453: `${tokensUrl}/eth_token.svg`,
  42161: `${tokensUrl}/eth_token.svg`,
  43114: `${chainsUrl}/avax.svg`, // TODO: GET TOKEN.
  11155111: `${tokensUrl}/eth_token.svg`,
};

export const CHAIN_ICONS: Record<number, string> = {
  1: `${chainsUrl}/eth.svg`,
  10: `${chainsUrl}/eth.svg`,
  56: `${tokensUrl}/bnb.svg`,
  100: `${chainsUrl}/gnosis.svg`,
  137: `${chainsUrl}/polygon.svg`,
  1868: `${chainsUrl}/soneium.png`,
  8453: `${chainsUrl}/base.svg`,
  42161: `${chainsUrl}/arbi.svg`,
  42220: `${chainsUrl}/celo.png`,
  43114: `${chainsUrl}/avax.svg`,
  81457: `${chainsUrl}/blast.png`,
  11155111: `${chainsUrl}/eth.svg`,
};

export const tokenId = (q: TokenQuery): string => `${q.chainId}:${q.address}`;
