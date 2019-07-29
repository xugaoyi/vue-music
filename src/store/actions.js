import * as types from './mutation-types'

export const selectPlay = function ({commit, state}, {list, index}) { // 点击歌曲时的播放
  commit(types.SET_SEQUENCE_LIST, list) // set顺序播放列表
  commit(types.SET_PLAYLIST, list) // set播放列表
  commit(types.SET_CURRENT_INDEX, index) // set点击歌曲的索引
  commit(types.SET_FULL_SCREEN, true) // set打开大播放器
  commit(types.SET_PLAYING_STATE, true) // set开始播放
}