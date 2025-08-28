import { TokenQuery } from "@/src/lib/types";
import { CoinGeckoIconFeed } from "@/src/lib/icons/coingecko";
import { tokenId } from "@/src/lib/icons/common";
import { CowBucketIcons } from "@/src/lib/icons";

const sampleList = [
  { chainId: 1, address: "0x0bee91533be2ede0936ea53457ce7bd9b0b398c6" },
  { chainId: 1, address: "0x7eb4db4dddb16a329c5ade17a8a0178331267e28" },
  { chainId: 1, address: "0x637f415687b7b2545ef2cd8dcc1614e1cc175850" },
  { chainId: 1, address: "0x4dafe1db6b10a4cd82002798ad78b7ee3869c7c2" },
  { chainId: 1, address: "0x73a15fed60bf67631dc6cd7bc5b6e8da8190acf5" },
  { chainId: 1, address: "0x71a91302def71cc9f79da10f478aa84a8e1ccde3" },
  { chainId: 1, address: "0xbffa38c3bd664830f4b5180b9c6332e467f5a657" },
  { chainId: 10, address: "0xFA436399d0458Dbe8aB890c3441256E3E09022a8" },
  { chainId: 10, address: "0x00B8D5a5e1Ac97Cb4341c4Bc4367443c8776e8d9" },
  { chainId: 10, address: "0xb47bC3ed6D70F04fe759b2529c9bc7377889678f" },
  { chainId: 10, address: "0x8b2F7Ae8cA8EE8428B6D76dE88326bB413db2766" },
  { chainId: 10, address: "0xDD89C7cd0613C1557B2DaAC6Ae663282900204f1" },
  { chainId: 10, address: "0x5d47bAbA0d66083C52009271faF3F50DCc01023C" },
  { chainId: 10, address: "0x17Aabf6838a6303fc6E9C5A227DC1EB6d95c829A" },
  { chainId: 10, address: "0xB2b42B231C68cbb0b4bF2FFEbf57782Fd97D3dA4" },
  { chainId: 10, address: "0x9A601C5bb360811d96A23689066af316a30c3027" },
  { chainId: 10, address: "0x81DDfAc111913d3d5218DEA999216323B7CD6356" },
  { chainId: 10, address: "0xA348700745D249c3b49D2c2AcAC9A5AE8155F826" },
  { chainId: 10, address: "0x4B03afC91295ed778320c2824bAd5eb5A1d852DD" },
  { chainId: 56, address: "0xFf7d6A96ae471BbCD7713aF9CB1fEeB16cf56B41" },
  { chainId: 56, address: "0xe6DF05CE8C8301223373CF5B969AFCb1498c5528" },
  { chainId: 56, address: "0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d" },
  { chainId: 56, address: "0x95034f653D5D161890836Ad2B6b8cc49D14e029a" },
  { chainId: 56, address: "0xB035723D62e0e2ea7499D76355c9D560f13ba404" },
  { chainId: 56, address: "0xa0c56a8c0692bD10B3fA8f8bA79Cf5332B7107F9" },
  { chainId: 56, address: "0x53E562b9B7E5E94b81f10e96Ee70Ad06df3D2657" },
  { chainId: 56, address: "0x6bdcCe4A559076e37755a78Ce0c06214E59e4444" },
  { chainId: 137, address: "0xD86b5923F3AD7b585eD81B448170ae026c65ae9a" },
  { chainId: 137, address: "0xB0a9C70FBBAF01Fc7B97d15bb7DF1C6c651720b7" },
  { chainId: 137, address: "0xd0258a3fD00f38aa8090dfee343f10A9D4d30D3F" },
  { chainId: 137, address: "0x229b1b6C23ff8953D663C4cBB519717e323a0a84" },
  { chainId: 137, address: "0x3a3Df212b7AA91Aa0402B9035b098891d276572B" },
  { chainId: 137, address: "0xAa9654BECca45B5BDFA5ac646c939C62b527D394" },
  { chainId: 137, address: "0xcC1B9517460D8aE86fe576f614d091fCa65a28Fc" },
  { chainId: 137, address: "0x4c28f48448720e9000907BC2611F73022fdcE1fA" },
  { chainId: 137, address: "0xE06Bd4F5aAc8D0aA337D13eC88dB6defC6eAEefE" },
  { chainId: 137, address: "0xcd7361ac3307D1C5a46b63086a90742Ff44c63B3" },
  { chainId: 137, address: "0x8A953CfE442c5E8855cc6c61b1293FA648BAE472" },
  { chainId: 137, address: "0x348e62131fce2F4e0d5ead3Fe1719Bc039B380A9" },
  { chainId: 137, address: "0x05089C9EBFFa4F0AcA269e32056b1b36B37ED71b" },
  { chainId: 137, address: "0x4C16f69302CcB511c5Fac682c7626B9eF0Dc126a" },
  { chainId: 137, address: "0x431CD3C9AC9Fc73644BF68bF5691f4B83F9E104f" },
  { chainId: 8453, address: "0x5D0aF35B4F6f4715961B56168De93bf0062b173D" },
  { chainId: 8453, address: "0x0C3F86b4e17B5Aaf8AD14f584E33902f505c4e76" },
  { chainId: 8453, address: "0x0adC87881B5970013BeE20694E5493914fD7Dd2E" },
  { chainId: 8453, address: "0x6d2454004bf6AbC64c84B0dB1750541cc7128eBC" },
  { chainId: 8453, address: "0x042C32942362A3d18336B17CF48052FA8800Dd21" },
  { chainId: 42161, address: "0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65" },
  { chainId: 42161, address: "0x2F27118E3D2332aFb7d165140Cf1bB127eA6975d" },
  { chainId: 42161, address: "0xFb411a4A80bB7A5Ec87C7651acDd605FE14c36e4" },
  { chainId: 42161, address: "0x39723C3C2aA50b2e27C139aE09915F118eEfF23e" },
  { chainId: 42161, address: "0xE4164a07941C1AB087563726bFB4686c997aEF59" },
  { chainId: 42161, address: "0xcCbb8003C66BAa30406f08C52E4beE8ab102f65B" },
  { chainId: 42161, address: "0xf6da7fB548da5D4066e6feFBcEf4c3f7b746b7F3" },
  { chainId: 42161, address: "0x45462873fc22842ACeCf4e165302feFe1d38BDc1" },
  { chainId: 42220, address: "0x061cc5a2C863E0C1Cb404006D559dB18A34C762d" },
  { chainId: 42220, address: "0x66803FB87aBd4aaC3cbB3fAd7C3aa01f6F3FB207" },
  { chainId: 42220, address: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787" },
  { chainId: 42220, address: "0x918146359264C492BD6934071c6Bd31C854EDBc3" },
  { chainId: 42220, address: "0x64dEFa3544c695db8c535D289d843a189aa26b98" },
  { chainId: 42220, address: "0xE919F65739c26a42616b7b8eedC6b5524d1e3aC4" },
  { chainId: 42220, address: "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0" },
  { chainId: 42220, address: "0x122013fd7dF1C6F636a5bb8f03108E876548b455" },
  { chainId: 42220, address: "0x37f750B7cC259A2f741AF45294f6a16572CF5cAd" },
  { chainId: 42220, address: "0x00Be915B9dCf56a3CBE739D9B9c202ca692409EC" },
  { chainId: 43114, address: "0x152b9d0FdC40C096757F570A51E494bd4b943E50" },
  { chainId: 43114, address: "0xb54f16fB19478766A268F172C9480f8da1a7c9C3" },
  { chainId: 43114, address: "0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a" },
  { chainId: 43114, address: "0x0da67235dD5787D67955420C84ca1cEcd4E5Bb3b" },
  { chainId: 43114, address: "0x7d1232B90D3F809A54eeaeeBC639C62dF8a8942f" },
  { chainId: 43114, address: "0xA32608e873F9DdEF944B24798db69d80Bbb4d1ed" },
  { chainId: 43114, address: "0x111111111111ed1D73f860F57b2798b683f2d325" },
  { chainId: 43114, address: "0xf693248F96Fe03422FEa95aC0aFbBBc4a8FdD172" },
  { chainId: 43114, address: "0x8F47416CaE600bccF9530E9F3aeaA06bdD1Caa79" },
  { chainId: 81457, address: "0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A" },
  { chainId: 81457, address: "0xEB466342C4d449BC9f53A865D5Cb90586f405215" },
  { chainId: 81457, address: "0x73c369F61c90f03eb0Dd172e95c90208A28dC5bc" },
  { chainId: 81457, address: "0x4fEE793d435c6D2c10C135983BB9d6D4fC7B9BBd" },
  { chainId: 81457, address: "0x740ECE57f1e2d900010E1f93188D760AEF37ed0b" },
  { chainId: 81457, address: "0xDC6Ae87f355Dc318070ac243F7030186f1f137EA" },
  { chainId: 81457, address: "0xF7bc58b8D8f97ADC129cfC4c9f45Ce3C0E1D2692" },
  { chainId: 81457, address: "0xE9f8fc2f63c540Dd69626DC94Ad8E0C08A6f26EA" },
  { chainId: 81457, address: "0x3779D0472242Fd9484A04b266E8b2E5BcD40aac4" },
  { chainId: 81457, address: "0xd069846f1eE7Da95217740636C9F5A4d751587A3" },
  { chainId: 81457, address: "0x146D410801F603c581829E453fE45f714Cd11FFA" },
  { chainId: 81457, address: "0xD51b6c4956705976669341Dc0713081579A92Bc4" },
  { chainId: 81457, address: "0xE63C9B9896d250CBa26aF7FEb706CfDF40814ad8" },
] as TokenQuery[];

describe("CoW Bucket Icons", () => {
  it("should retrieve and archive token icons", async () => {
    const feed = new CowBucketIcons();
    let missing = 0;
    for (const token of sampleList) {
      const icon = await feed.getIcon(token);
      console.log(`Token=${tokenId(token)}, Icon=${icon}`);
      if (!icon) {
        missing += 1;
      }
    }
    console.log(`Total Missing ${missing} of ${sampleList.length}`);
  }, 20000);
});
