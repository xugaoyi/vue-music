// 操作缓存相关 基于库good-storage操作本地存储 https://github.com/ustbhuangyi/storage

import storage from 'good-storage'

const SEARCH_KEY = '__search__' // 存入本地存储的key名称
const SEARCH_MAX_LENGTH = 15 // 存储条数最大值

const PLAY_KEY = '__play__' // 存入本地存储的key名称
const PLAY_MAX_LENGTH = 200 // 存储条数最大值

const FAVORITE_KEY = '__favorite__' // 存入本地存储的key名称
const FAVORITE_MAX_LENGTH = 200 // 存储条数最大值

// 插入数据到数组操作
function insertArray(arr, val, compare, maxLen) { // compare函数
  const index = arr.findIndex(compare) // arr中是否已存在query 且返回索引值
  // compare，把函数当参数传入，相当于
  // const index = arr.findIndex((item) => {
  //   return item === query
  // })

  if (index === 0) { // 存在第一条位置，直接返回
    return
  }
  if (index > 0) { // 存在arr内，则删除原来的
    arr.splice(index, 1) // 删除原来的
  }

  arr.unshift(val) // 插入数据到第一位置

  if (maxLen && arr.length > maxLen) { // 有长度限制并且超出限制
    arr.pop() // 删除最后一个元素
  }
}

// 删除操作
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 点击搜索结果时保存历史记录到本地存储
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) // 获取本地localstorage中的SEARCH_KEY，没有则返回[] (good-storage的语法)
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 读取搜索历史
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

// 删除单条搜索历史
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清空搜索历史
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 写入播放历史
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

// 读取播放历史
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

// 写入收藏歌曲
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 取消收藏歌曲
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 读取全部收藏歌曲
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}