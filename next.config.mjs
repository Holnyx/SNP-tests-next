const sassOptions = {
  additionalData: `
    @import "src/styles/color.sass"
    @import "src/styles/mixins.sass"
  `,
  implementation: 'sass-embedded',
};
const nextConfig = {
  reactStrictMode: true,
  sassOptions,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_BASE_URL}/api/:path*`,
      },
    ];
  },

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    );
    fileLoaderRule.exclude = /\.svg$/i;

    // config.module.rules.push(
    //   {
    //     test: /\.scss$/,
    //     use: ['style-loader', 'css-loader', 'sass-loader'],
    //     include: path.resolve(__dirname, './'),
    //   },
    //   {
    //     test: /\.s[ac]ss$/i,
    //     use: {
    //       loader: 'sass-loader',
    //       options: {
    //         sassOptions: {
    //           additionalData: '@import "src/styles/color.sass"',
    //         }
    //       },
    //     },
    //   }
    // );


    return config;
  },
};

export default nextConfig;