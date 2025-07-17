import { DEPLOYMENT_URL } from "vercel-url";

const ACCOUNT_ID = process.env.ACCOUNT_ID;

// Set the plugin url in order of BITTE_CONFIG, env, DEPLOYMENT_URL (used for Vercel deployments)
const PLUGIN_URL =
  DEPLOYMENT_URL ||
  `${process.env.NEXT_PUBLIC_HOST || "localhost"}:${process.env.PORT || 3000}`;

if (!PLUGIN_URL) {
  console.error(
    "!!! Plugin URL not found in env, BITTE_CONFIG or DEPLOYMENT_URL !!!",
  );
  process.exit(1);
}

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

const SUPPORTED_NETWORKS = [
  1, // mainnet
  100, // gnosis
  137, // polygon
  8453, // base
  42161, // arbitrum
  43114, // avalanche
  11155111, // sepolia
];

export { ACCOUNT_ID, PLUGIN_URL, SUPPORTED_NETWORKS };
