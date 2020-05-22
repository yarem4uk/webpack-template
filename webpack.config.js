const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCss = require('mini-css-extract-plugin')
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

const optimization = () => {
  const config =  {
    splitChunks: {
      chunks: 'all',
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCss(),
      new TerserPlugin(),
    ]
  }
  return config 
}

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoader = (extra) => {
  const loaders = [
    {
      loader: MiniCss.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
      }
    },
    'css-loader'
  ]

  if (extra) {
    loaders.push(extra)
  }

  return loaders
}


module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: './index.js',
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },

  optimization: optimization(),

  devtool: isDev ? 'source-map' : '',

  devServer: {
    port: 4200,
    hot: isDev,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),     
    new CleanWebpackPlugin(),
    new MiniCss({
      filename: filename('css'),
    })
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoader(),
      },

      {
        test: /\.s[ac]ss$/,
        use: cssLoader('sass-loader')
      },

      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader'],
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ]
  }
}
