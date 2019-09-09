import * as types from './mutation-types'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from '@/common/js/cache'

// 查找歌曲是否已在列表中存在，如存在则返回index
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 点击歌曲时的播放
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list) // set顺序播放列表。相当于commit('SET_SEQUENCE_LIST', list)
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

// 插入歌曲到播放列表，（从搜索页点击歌曲、最近播放页点击歌曲）
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice() // 播放列表 副本
  let sequenceList = state.sequenceList.slice() // 顺序列表 副本
  let currentIndex = state.currentIndex // 当前播放索引

  let currentSong = playlist[currentIndex] // 记录当前歌曲
  let fpIndex = findIndex(playlist, song) // 查找当前歌曲在播放列表中是否已经存在
  currentIndex++ // 因为是插入歌曲，所有索引+1
  playlist.splice(currentIndex, 0, song) // 插入歌曲到当前索引位置 splice拼接数组 参数：1位置 2删除的个数 3插入的数据

  if (fpIndex > -1) { // 如果歌曲已存在播放列表
    if (currentIndex > fpIndex) { // 如果当前插入的索引大于列表中的索引
      playlist.splice(fpIndex, 1) // 删除数据，参数：1位置 2删除的个数
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true) // set打开大播放器
  commit(types.SET_PLAYING_STATE, true) // set开始播放
}

// 保存搜索历史到本地存储同时更新到vuex
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
// 删除搜索历史
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
// 情况搜索历史
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 删除播放列表中的某一首歌曲
export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice() // 播放列表 副本
  let sequenceList = state.sequenceList.slice() // 顺序列表 副本
  let currentIndex = state.currentIndex // 当前播放索引

  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1) // 删除播放列表中选择中的歌曲

  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playlist.length) { // 当前播放索引在要删除歌曲之后 或 当前播放歌曲是最后一首歌
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playlistState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playlistState) // 如果已删完播放列表 则改变播放状态为false, 否则为true
}

// 清空播放列表
export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

// 保存播放历史 (player内调用)
export const savePlayHistory = function({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song)) // 存入vuex同时执行savePlay方法存入本地存储
}

// 收藏歌曲
export const saveFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song)) // 存入vuex同时存入本地存储
}
// 取消收藏歌曲
export const deleteFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song)) // 存入vuex同时存入本地存储
}