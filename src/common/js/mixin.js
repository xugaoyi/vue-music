/**
 * 此mixin的作用：
 * 共享代码
 * 当组件调用并注册此文件 mixins: [playlistMixin]，会把playlistMixin内部的方法应用到该组件，
 * 如果该组件的methods中没有定义handlePlaylist时，会执行此文件的handlePlaylist方法从而在控制台报错
 * 如果定义了handlePlaylist方法则会覆盖此文件的handlePlaylist方法
 */

import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '@/common/js/config' // 播放模式语义化配置
import { shuffle } from '@/common/js/util' // 随机打乱数组方法

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

// 播放器共享代码
export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([ // 这里相当于把获取到的数据存放到data
      'sequenceList',
      'currentSong',
      'playlist',
      'mode'
    ])
  },
  methods: {
    changeMode() { // 切换播放模式
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) { // 随机
        list = shuffle(this.sequenceList)
      } else { // 顺序播放 与 单曲播放 （单曲播放不在这里判断，单曲播放由歌曲播放结束时重新播放本歌曲）
        list = this.sequenceList
      }
      this.resetCurrentIndex(list) // 防止因为改变模式而改变当前播放的歌曲
      this.setPlaylist(list)
    },
    resetCurrentIndex(list) { // 调整当前播放索引
      let index = list.findIndex((item) => { // 获取当前歌曲的索引
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({ // 映射 提交mutations
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  }
}

// 搜索共享代码
export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    addQuery(query) {
      this.$refs.searchBox.setQuery(query) // 调用子组件方法并传入值
    },
    onQueryChange(query) { // 接收搜索框组件派发的事件和传入的值
      this.query = query
    },
    blurInput() { // 当滚动搜索结果列表时 让输入框失去焦点，移动端中使键盘关闭
      this.$refs.searchBox.blur() // 调用子组件方法
    },
    saveSearch() { // 点击搜索结果时保存到本地存储和vuex
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}