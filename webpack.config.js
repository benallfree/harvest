const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const os = require('os')
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')

let ip = null
let ifaces = os.networkInterfaces()
for (let dev in ifaces) {
  const iface = ifaces[dev].filter(function(details) {
    return details.family === 'IPv4' && details.internal === false
  })
  if (iface.length > 0) ip = iface[0].address
}

const devServer = {
  contentBase: [
    path.join(__dirname, 'www'),
    path.join(__dirname, 'platforms/ios/www'),
  ],
  host: ip,
  port: 8080,
  // hot: true,
}

const devServerHost = `http://${devServer.host}:${devServer.port}/`

module.exports = {
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'www'),
    publicPath: devServerHost,

    filename: 'app.js',
  },
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.(png|jpg|gif|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  devServer,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtraWatchWebpackPlugin({
      dirs: ['../repos/cordova-live-update/dist'],
    }),
    // new HtmlWebpackPlugin({
    //   template: './src/index.html',
    //   templateParameters: {
    //     host: devServerHost,
    //   },
    // }),
    new webpack.DefinePlugin({
      LIVE_UPDATE_URL: JSON.stringify(
        {
          production: 'https://cordovaliveupdate.com/asdf',
        }[process.env.NODE_ENV] || `http://${ip}:4000`,
      ),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
}
