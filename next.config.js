const baseURI =
  process.env.NODE_ENV !== "production"
    ? process.env.DEV_URI
    : process.env.PROD_URI;

module.exports = {
  isServer: false,
  env: {
    NEXTAUTH_URL: baseURI,
  },
  sassOptions: {
    includePaths: ["/styles"],
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    return config;
  },
};
