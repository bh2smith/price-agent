export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value) {
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error(`${key} is not set`);
  }
  return value;
}

export function getZerionKey(): string {
  return getEnvVar("ZERION_KEY");
}

export const SUPPORTED_NETWORKS = [
    1, // mainnet
    100, // gnosis
    137, // polygon
    8453, // base
    42161, // arbitrum
    43114, // avalanche
    11155111, // sepolia
];
