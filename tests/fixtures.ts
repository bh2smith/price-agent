import { Address } from "viem";

export const USDC_BASE = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
export const USDC_GNOSIS = "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83";
export const USDC_POLYGON = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";

export const TORN_MAINNET = "0x77777feddddffc19ff86db637967013e6c6a116c";

export const SAMPLE_TOKENS: Record<string, Address[]> = {
  base: [
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC
    "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c", // WBTC
    "0x4200000000000000000000000000000000000006", // WETH
    "0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452", // wstETH
    "0xc27468b12ffa6d714b1b5fbc87ef403f38b82ad4", // TRUMP
  ],

  gnosis: [
    "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83", // USDC
    "0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1", // WETH
    "0xe2e73a1c69ecf83f464efce6a5be353a37ca09b2", // LINK
    "0x4537e328bf7e4efa29d05caea260d7fe26af9d74", // UNI,
    "0x9c58bacc331c9aa871afd802db6379a98e80cedb", // GNO
  ],
  polygon: [
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // USDC
    "0xd93f7e271cb87c23aaa73edc008a79646d1f9912", // WSOL
    "0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b", // AVAX
  ],
};
