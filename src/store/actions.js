import * as types from './mutation-types'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/util'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 点击歌曲时的播放
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list) // set顺序播放列表
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList) // set播放列表为随机列表
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list) // set播放列表
  }
  commit(types.SET_CURRENT_INDEX, index) // set点击歌曲的索引
  commit(types.SET_FULL_SCREEN, true) // set打开大播放器
  commit(types.SET_PLAYING_STATE, true) // set开始播放
}

// 点击随机播放全部
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random) // set播放模式为随机
  commit(types.SET_SEQUENCE_LIST, list) // set顺序播放列表
  commit(types.SET_PLAYLIST, shuffle(list)) // set播放列表
  commit(types.SET_CURRENT_INDEX, 0) // set点击歌曲的索引
  commit(types.SET_FULL_SCREEN, true) // set打开大播放器
  commit(types.SET_PLAYING_STATE, true) // set开始播放
}