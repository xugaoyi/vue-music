/**
 * 设置state数据
 */

import * as types from './mutation-types' // 为什么要用mutation-types？便于书写方便

const mutations = {
  /**
   * @param {*} state 为state.js中的state对象
   * @param {*} 第二个参数是要传过去的
   */
  [types.SET_SINGER](state, singer) { // 在singer.vue调用
    state.singer = singer
  },

  [types.SET_PLAYING_STATE](state, flay) {
    state.playing = flay
  },
  [types.SET_FULL_SCREEN](state, flay) {
    state.fullScreen = flay
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },

  [types.SET_DISC](state, disc) {
    state.disc = disc
  },

  [types.SET_TOP_LIST](state, topList) {
    state.topList = topList
  },

  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  }
}
export default mutations