// 操作缓存相关 基于库good-storage操作本地存储 https://github.com/ustbhuangyi/storage

import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// insertArray 插入数据到数组
function insertArray(arr, val, compare, maxLen) { // compare 比较函数
  const index = arr.findIndex(compare) // arr中是否已存在compare 且返回索引值
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

// 点击搜索结果时保存记录到本地存储
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) // 获取本地localstorage中的SEARCH_KEY，没有则返回[] (good-storage的语法)
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}