import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
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
    // Правило для обработки SVG
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...(fileLoaderRule.resourceQuery?.not || []), /url/] },
        use: ['@svgr/webpack'],
      },
    );

    // Исключаем SVG из fileLoaderRule
    fileLoaderRule.exclude = /\.svg$/i;

    // Настройка CSS/SCSS модулей отдельно
    // config.module.rules.push(
    //   // Для CSS/SCSS модулей
    //   {
    //     test: /\.module\.(scss|sass)$/,
    //     use: [
    //       {
    //         loader: 'css-loader',
    //         options: {
    //           modules: {
    //             auto: true, // Включение модулей для файлов `.module`
    //             localIdentName: '[name]__[local]--[hash:base64:5]',
    //           },
    //         },
    //       },
    //       'sass-loader',
    //     ],
    //   },
    //   // Для глобальных SCSS/SASS файлов
    //   {
    //     test: /\.(scss|sass)$/,
    //     exclude: /\.module\.(scss|sass)$/,
    //     use: [
    //       'css-loader',
    //       {
    //         loader: 'sass-loader',
    //         options: {
    //           additionalData: `@import '@/styles/color'`,
    //         },
    //       },
    //     ],
    //   }
    // );

    return config;
  },
};

export default nextConfig;