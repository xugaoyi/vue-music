import jsonp from '@/common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

export function getRecommend() { // 获取轮播图数据
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, { // 配置url链接数据
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList () { // 获取歌单列表
  // 线上环境地址，根据需要配置修改
  const url = debug ? '/api/getDiscList' : 'http://localhost:9000/api/getDiscList'

  const data = Object.assign({}, commonParams, {
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

export function getSongList(disstid) { // 获取歌单内的歌曲列表
  const url = debug ? '/api/getCdInfo' : 'http://localhost:9000/api/getCdInfo'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}