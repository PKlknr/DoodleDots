/* global process, __dirname */

const fs = require('fs');
const webpack = require('webpack');
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const svPreprocess = require('svelte-preprocess-postcss');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const {InjectManifest} = require('workbox-webpack-plugin');

const dev = process.env.NODE_ENV === 'development';
const version = require('./package.json').version;

const config = {
  watchOptions: {
    aggregateTimeout: 400,
  },
  context: path.join(__dirname, 'src'),
  entry: './main.js',
  mode: dev ? 'development' : 'none',

  output: {
    path: path.join(__dirname, 'build'),
    filename: dev ? 'index.js' : '[name].[contenthash].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          query: {
            preprocess: {style: svPreprocess()},
            dev,
            emitCss: !dev,
            immutable: true,
            format: 'esm',
          },
        },
      },
      {
        test: /\.(sa|sc|c|pc)ss$/,
        use: [
          dev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
    ].filter(x => x),
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      title: 'DoodleDots',
      template: 'index.ejs',
      filename: 'index.html',
      inject: true,
      version,
    }),

    new InjectManifest({
      swSrc: './sw.js',
      swDest: './service-worker.js',
    }),

    new CopyWebpackPlugin([{from: '../assets/img', to: 'img'}]),

    new MiniCssExtractPlugin({
      filename: dev ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: dev ? '[id].css' : '[id].[contenthash].css',
    }),

    !dev && new webpack.optimize.ModuleConcatenationPlugin(),

    new FaviconsWebpackPlugin({
      logo: '../assets/img/ck.svg.png',
      prefix: 'icons-[hash]/',
      cache: true,
      mode: dev ? 'light' : 'webapp',
      inject: true,

      favicons: {
        background: '#fff',
        appName: 'DoodleDots',
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          opengraph: false,
          twitter: false,
          yandex: false,
          windows: false,
        },
      },
    }),

    new WebpackPwaManifest({
      name: 'DoodleDots' + (dev ? ' (dev)' : ''),
      short_name: 'DoodleDots' + (dev ? '.dev' : ''),
      description: '!',
      crossorigin: 'use-credentials',
      fingerprints: false,
      inject: true,
      start_url: '/',
      background_color: '#2d314e',
      theme_color: '#2d314e',
      icons: [
        {
          src: path.resolve('./assets/img/ck.svg.png'),
          sizes: [96, 128, 192, 256, 384, 512],
        },
      ],
    }),

    !dev && new TerserPlugin(),
  ].filter(x => x),

  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'assets'),
    proxy: {
      '/api': 'http://localhost:8088',
    },
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    https: dev && {
      key: fs.readFileSync('./cert/privkey.pem'),
      cert: fs.readFileSync('./cert/fullchain.pem'),
    },
  },
};

if (process.env.NODE_ENV === 'analyze') {
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
