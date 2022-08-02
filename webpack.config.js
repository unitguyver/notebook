const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const reload = require('./scripts/hot-reload')

const views = [
  'Popup', // 插件主页
  'Options', // 插件配置
  'NewTab', // 新标签页

  'DevTools', // 控制台工具
  'Panel', // 控制台工具页面
]

const scripts = views.concat([
  'Content', // 页面注入
  'BackGround', // 后台脚本
  'Inject', // 页面注入
])

const paths = {
  src: (str) => path.join(__dirname, './src', str),
  public: (str) => path.join(__dirname, './public', str),
}

module.exports = {
  mode: 'development',

  devtool: false,

  entry: scripts.reduce(
    (map, item) => ({
      ...map,
      [item.toLowerCase()]: paths.src(`/views/${item}/index.tsx`),
    }),
    {}
  ),

  output: {
    publicPath: '/',
    filename: 'js/[name].js',
    clean: true,
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      assert: false,
      util: false,
      '@': paths.src(''),
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          plugins: ['@babel/plugin-transform-runtime'],
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              esModule: false,
            },
          },
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: 'url-loader',
      },
      {
        test: /\.ttf$/,
        use: ['file-loader'],
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        ext: {
          chunks(chunk) {
            return chunk.runtime === 'content'
          },
          name(module, chunks, cacheGroupKey) {
            if (chunks.length === 1) {
              if (chunks[0].name) {
                return chunks[0].name
              }
            }
            return 'ext'
          },
        },
      },
    },
  },

  plugins: [
    ...views.map((item) => {
      const name = item.toLowerCase()
      return new HtmlWebpackPlugin({
        template: paths.public('/index.html'),
        filename: `html/${name}.html`,
        chunks: [name],
      })
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public('/manifest.json'),
          to: 'manifest.json',
        },
        {
          from: paths.src('/assets/locales'),
          to: '_locales',
        },
        {
          from: paths.src('/assets/img'),
          to: 'img',
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new MonacoWebpackPlugin({
      languages: ['javascript', 'css'],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        WS_PORT: reload.port,
      },
    }),
  ],
}
