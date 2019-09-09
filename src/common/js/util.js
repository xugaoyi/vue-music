function getRandomInt(min, max) { // 获取min到max的一个随机数，包含min和max本身
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) { // 随机打乱数组
  let _arr = arr.slice() // 调用数组副本，不改变原数组
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

// 节流函数
export function debounce(func, delay) { // func 函数 delay间隔时间
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}