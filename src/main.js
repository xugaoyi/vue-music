import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'
import { SET_PLAY_HISTORY, SET_FAVORITE_LIST } from './store/mutation-types'
import { loadPlay, loadFavorite } from '@/common/js/cache'
import { processSongsUrl } from '@/common/js/song'

import '@/common/stylus/index.styl'

// 移动端控制台console，测试完后注释代码。
// import VConsole from 'vconsole'
// /* eslint-disable no-unused-vars */
// var vConsole = new VConsole()
// console.log('test')

fastclick.attach(document.body)

Vue.use(VueLazyload, { // 图片懒加载
  loading: require('@/common/image/default.png')
})

const historySongs = loadPlay()
processSongsUrl(historySongs).then((songs) => {
  store.commit(SET_PLAY_HISTORY, songs)
})

const favoriteSongs = loadFavorite()
processSongsUrl(favoriteSongs).then((songs) => {
  store.commit(SET_FAVORITE_LIST, songs)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})