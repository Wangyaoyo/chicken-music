'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

/* 后端代理：配置路由 发起http请求 */
const axios = require('axios')
const express = require('express')
/* body-parser 过滤解析请求 */
const bodyParser = require('body-parser')

const app = express()
const apiRoutes = express.Router()
app.use('/api', apiRoutes)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap, usePostCSS: true})
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(apiRoutes) {
      /* 用来解析req.body的数据 解析成功覆盖原来的req.body,解析失败则为{} */
      /* extend选项用来配置使用querystring(false)或qs(true)来解析数据*/
      /* qs比querystring出色的地方在于可以解析多级嵌套的复杂对象（最多5级） */
      apiRoutes.use(bodyParser.urlencoded({extended:true}))
      /* 歌单 */
      apiRoutes.get('/api/getDiscList', function (req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e);
        })
      })
      /* 歌曲url */
      apiRoutes.post('/api/getPurlUrl',bodyParser.json(),function (req,res) {
        const url = 'http://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.post(url,req.body,{
          //http的请求头
          headers:{
            //包含一个url:表示请求的来源，也可以为空，设置是为了防止恶意请求
            referer:'https://y.qq.com',
            //指定来源服务器的域名
            origin:'https://y.qq.com',
            'Content-type':'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          res.json(response.data)
        }).catch((e)=>{
          console.log(e);
        })
      })
      /* 歌词 */
      apiRoutes.get('/api/lyric', function (req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            /* 指定被请求服务器的域名 */
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e);
        })
      })
      /* 歌单详情页 */
      apiRoutes.get('/api/getDiscSong', function (req, res) {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e);
        })
      })
      /* 排行榜 */
      apiRoutes.get('/api/getTopList', function (req, res) {
        const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e);
        })
      })

      /* 排行榜详情 */
      apiRoutes.get('/api/getTopListDetail', function (req, res) {
        const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e);
        })
      })
      /* 热门搜索词 */
      apiRoutes.get('/api/getHotKey', function (req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e);
        })
      })
      /* 搜索歌曲 */
      apiRoutes.get('/api/getSearchSong', function (req, res) {
        const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e);
        })
      })
    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        {from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html')},
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? {warnings: false, errors: true}
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
