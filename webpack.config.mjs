import path from 'path';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SemiWebpackPlugin from '@douyinfe/semi-webpack-plugin';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  entry: './src/index.tsx', // 入口文件
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.tsx?$/, // 处理 .ts 和 .tsx 文件
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource', // 在 Webpack 5 中使用 asset modules
        generator: {
          filename: '[name][ext]?[hash]' // 输出文件的文件名格式
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'], // 添加 .tsx 和 .ts 扩展名
  },
  devServer: {
    historyApiFallback: true,
    client: {
      overlay: true,
      logging: 'info', // 可以根据需要设置为 'none', 'error', 'warn', 'info', 'log'
    },
    static: {
      directory: path.join(__dirname, './dist'),
    },
    devMiddleware: {
      publicPath: '/dist/',
    },
  },
  performance: {
    hints: false
  },
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // 指定模板 HTML 文件路径
      filename: 'index.html', // 输出文件名
      inject: 'body' // 将所有资源注入到 body 元素的底部
    }),
    // new SemiWebpackPlugin({
    //   theme: '@semi-bot/semi-theme-buttontest',
    //   include: '~@semi-bot/semi-theme-buttontest/scss/local.scss',
    //   theme: '@semi-bot/semi-theme-buttontest2'
    //   /* ...options */
    // }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          warnings: false
        }
      }
    })],
  }
};

export default config;
