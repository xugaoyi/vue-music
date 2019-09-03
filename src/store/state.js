/**
 * state存放数据
 */

import { playMode } from '@/common/js/config'
import { loadSearch } from '@/common/js/cache'

const state = {
  singer: {}, // 歌手详情页内单个歌手数据

  playing: false, // 是否播放
  fullScreen: false, // 播放器展开收起(大播放与小播放器)
  playlist: [], // 歌曲播放列表（随播放模式改变的播放列表）
  sequenceList: [], // 歌曲顺序播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放歌曲索引

  disc: {}, // 歌单详情页内单个歌手数据
  topList: {}, // 排行详情页当前点击的单个榜单数据，通过此数据获取歌曲列表数据

  searchHistory: loadSearch() // 搜索历史列表 从本地存储获取
}
export default state