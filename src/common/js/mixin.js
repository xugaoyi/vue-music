/**
 * 此mixin的作用：
 * 当组件调用并注册此js的playlistMixin方法，会把playlistMixin内部的方法应用到该组件，
 * 如果该组件的methods中没有定义handlePlaylist时，会执行此文件的handlePlaylist方法从而在控制台报错
 * 如果定义了handlePlaylist方法则会覆盖此文件的handlePlaylist方法，并且会引用playlistMixin内的其他方法
 */

import { mapGetters } from 'vuex'

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