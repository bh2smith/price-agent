/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nodeMiddleware: true, // TEMPORARY: Only needed until Edge runtime support is added
  },
  serverExternalPackages: ["@coinbase/cdp-sdk"],
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, mb-metadata",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/ai-plugin.json",
        destination: "/api/ai-plugin",
      },
    ];
  },
  env: {
    ADDRESS: process.env.ADDRESS,
    USE_CDP_FACILITATOR: process.env.USE_CDP_FACILITATOR,
    CDP_API_KEY_ID: process.env.CDP_API_KEY_ID,
    CDP_API_KEY_SECRET: process.env.CDP_API_KEY_SECRET,
    NETWORK: process.env.NETWORK,
    PORT: process.env.PORT,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Handle Node.js modules that might not be compatible with Edge Runtime
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
    };

    return config;
  },
};

export default nextConfig;
