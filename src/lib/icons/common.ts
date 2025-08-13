const bucketUrl = "https://storage.googleapis.com/bitte-public";
const tokensUrl = `${bucketUrl}/intents/tokens`;
const chainsUrl = `${bucketUrl}/intents/chains`;

export const NATIVE_ASSET_ICONS: Record<number, string> = {
  1: `${tokensUrl}/eth_token.svg`,
  100: `${tokensUrl}/xdai_token.svg`,
  137: `${chainsUrl}/polygon.svg`, // TODO: GET TOKEN.
  8453: `${tokensUrl}/eth_token.svg`,
  42161: `${tokensUrl}/eth_token.svg`,
  43114: `${chainsUrl}/avax.svg`, // TODO: GET TOKEN.
  11155111: `${tokensUrl}/eth_token.svg`,
};

export const CHAIN_ICONS: Record<number, string> = {
  1: `${chainsUrl}/eth.svg`,
  100: `${chainsUrl}/gnosis.svg`,
  137: `${chainsUrl}/polygon.svg`,
  8453: `${chainsUrl}/base.svg`,
  42161: `${chainsUrl}/arbi.svg`,
  43114: `${chainsUrl}/avax.svg`,
  11155111: `${chainsUrl}/eth.svg`,
};
