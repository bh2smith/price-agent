// Unit tests for coingecko.ts

import { NATIVE_ASSET } from "@/src/lib/catch-eth";
import {
  DexPair,
  evaluatePrice,
  getTokenPrice,
} from "@/src/lib/feeds/dex-screener";

// Rate limits.
describe("dexscreener", () => {
  it.only("should return token prices on a few networks", async () => {
    const gno = "0x9c58bacc331c9aa871afd802db6379a98e80cedb";

    // await expect(
    //   getTokenPrice({ address: gno, chainId: 100 }),
    // ).resolves.toBeGreaterThan(0);

    const pairs = [
      {
        chainId: "gnosischain",
        dexId: "0xe32F7dD7e3f098D518ff19A22d5f028e076489B1",
        url: "https://dexscreener.com/gnosischain/0x46f2da8a69a150390a87db78e7aad8572c564963",
        pairAddress: "0x46f2dA8A69A150390a87Db78e7AaD8572c564963",
        baseToken: {
          address: "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb",
          name: "Gnosis Token on xDai",
          symbol: "GNO",
        },
        quoteToken: {
          address: "0x6C76971f98945AE98dD7d4DFcA8711ebea946eA6",
          name: "Wrapped liquid staked Ether 2.0 from Mainnet",
          symbol: "wstETH",
        },
        priceNative: "0.03448",
        priceUsd: "141.55",
        liquidity: {
          usd: 13054,
          base: 207694,
          quote: 46.17,
        },
      },
      {
        chainId: "gnosischain",
        dexId: "sushiswap",
        url: "https://dexscreener.com/gnosischain/0x0f9d54d9ee044220a3925f9b97509811924fd269",
        pairAddress: "0x0f9D54D9eE044220A3925f9b97509811924fD269",
        baseToken: {
          address: "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb",
          name: "Gnosis Token on xDai",
          symbol: "GNO",
        },
        quoteToken: {
          address: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
          name: "Wrapped XDAI",
          symbol: "WXDAI",
        },
        priceNative: "140.9825",
        priceUsd: "140.56",
        liquidity: {
          usd: 13054,
          base: 207694,
          quote: 46.17,
        },
      },
      {
        chainId: "gnosischain",
        dexId: "elkfinance",
        url: "https://dexscreener.com/gnosischain/0xac06311636978f0245f2542473763424923d6b55",
        pairAddress: "0xAc06311636978f0245f2542473763424923d6b55",
        baseToken: {
          address: "0xeEeEEb57642040bE42185f49C52F7E9B38f8eeeE",
          name: "Elk",
          symbol: "ELK",
        },
        quoteToken: {
          address: "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb",
          name: "Gnosis Token on xDai",
          symbol: "GNO",
        },
        priceNative: "0.0002223",
        priceUsd: "0.03142",
        liquidity: {
          usd: 13054,
          base: 207694,
          quote: 46.17,
        },
      },
      {
        chainId: "gnosischain",
        dexId: "honeyswap",
        url: "https://dexscreener.com/gnosischain/0x3b74c893f62424d1c96ce060332fd626eeaa875c",
        pairAddress: "0x3b74c893F62424d1C96Ce060332fd626eEaa875C",
        baseToken: {
          address: "0x4291F029B9e7acb02D49428458cf6fceAC545f81",
          name: "Water Token",
          symbol: "WATER",
        },
        quoteToken: {
          address: "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb",
          name: "Gnosis Token on xDai",
          symbol: "GNO",
        },
        priceNative: "0.0006356",
        priceUsd: "0.08985",
        liquidity: {
          usd: 13054,
          base: 207694,
          quote: 46.17,
        },
      },
    ] as DexPair[];

    const price = evaluatePrice(pairs, gno);
    console.log(`dexscreener price: ${price}`);

    // await expect(
    //   getTokenPrice({ address: USDC_POLYGON, chainId: 137 }),
    // ).resolves.not.toBeNull();
    // await expect(
    //   getTokenPrice({ address: USDC_GNOSIS, chainId: 100 }),
    // ).resolves.not.toBeNull();
  });

  it("native asset prices", async () => {
    for (const chainId of [1, 137, 100]) {
      const price = await getTokenPrice({ address: NATIVE_ASSET, chainId });
      console.log(`${chainId} price`, price);
      expect(price).toBeGreaterThan(0);
    }
  });
});
