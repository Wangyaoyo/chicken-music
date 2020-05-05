import {jsonp} from 'common/js/jsonp'
import {commonParam, option} from "./config";
import axios from 'axios'

/* 开发环境（true）*/
const debug = process.env.NODE_ENV !== 'production'

/*
    接口层功能：
      1.封装网站需要的参数
      2.将页面的请求发送给node搭建的http服务
            debug判断是开发环境还是生产环境：
                开发环境，url为/api/...  请求发送到本地主机node搭建的http服务
                生产环境，url为http://39.105.52.64:8084/music/api/，请求到部署服务器上node搭建的http服务
 */
/*
    以下有两种获取数据的方法：
        1.jsonp
            直接从某网站上抓数据
        2.axios
            将请求发给node后端，再次伪装后发送axios请求给某网站
        区别：
            jsonp可以直接发送跨域请求，获取数据
            axios
 */
/* 获取推荐（轮播图）列表 */
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParam, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, option)
}

/* 获取歌单列表 */
export function getDiscList() {
  const url =debug ? '/api/getDiscList': 'http://39.105.52.64:8084/music/api/getDiscList'

  const data = Object.assign({}, commonParam, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/* 获取歌单歌曲列表 */
export function getDiscSong(dissid) {
  const url = debug ? '/api/getDiscSong': 'http://39.105.52.64:8084/music/api/getDiscSong'

  const data = Object.assign({}, commonParam, {
    platform: 'yqq.json',
    hostUin: 0,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    needNewCode: 0,
    disstid: dissid,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
