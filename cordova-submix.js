let mix = require('laravel-mix')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const os = require('os')
const exec = require('child_process').exec
const path = require('path')

async function ex(cmd, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`Running ${cmd}`)
    exec(cmd, { cwd }, function(err, stdout, stderr) {
      if (err) {
        reject(err)
      }
      resolve(stdout)
    })
  })
}

mix.extend('cordova', (webpackConfig, options = {}) => {
  mix.setPublicPath('www')
  mix.then(() => ex('cordova prepare'))
  webpackConfig.module.rules.push({
    test: /\.(mp3)$/,
    use: [
      {
        loader: 'file-loader',
        options: {},
      },
    ],
  })

  if (Mix.isWatching()) {
    let ip = null
    let ifaces = os.networkInterfaces()
    for (let dev in ifaces) {
      const iface = ifaces[dev].filter(function(details) {
        return details.family === 'IPv4' && details.internal === false
      })
      if (iface.length > 0) ip = iface[0].address
    }

    webpackConfig.devServer = {
      contentBase: [
        path.join(__dirname, 'www'),
        path.join(__dirname, 'platforms/ios/www'),
      ],
      host: ip,
      port: 8080,
      writeToDisk: filePath => {
        return /\.html$/.test(filePath)
      },
    }
    const devServerHost = `http://${ip}:${webpackConfig.devServer.port}/`
    webpackConfig.output = { publicPath: devServerHost }
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        template: './src/index.ejs',
        filename: './www/index.html',
      }),
    )
    mix.setResourceRoot(devServerHost)
  } else {
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        template: './src/index.ejs',
        filename: './index.html',
      }),
    )
  }
})
