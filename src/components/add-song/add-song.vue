<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <!-- 头部 s -->
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!-- 头部 e -->

      <!-- 搜索框 s-->
      <div class="search-box-wrapper">
        <search-box @query="onQueryChange" ref="searchBox" placeholder="搜索歌曲"></search-box>
      </div>
      <!-- 搜索框 e-->

      <!-- 最近播放&搜索历史 s-->
      <div class="shortcut" v-show="!query">
        <!-- 选项卡组件 -->
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <!-- 最近播放 -->
          <scroll ref="songList"  class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <!-- 搜索历史 -->
          <scroll ref="searchList" class="list-scroll" v-if="currentIndex === 1" :data="searchHistory" :refreshDelay="refreshDelay">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <!-- 最近播放&搜索历史 e-->

      <!-- 搜索结果 s-->
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
      <!-- 搜索结果 e-->

      <!-- 提示框 s-->
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
      <!-- 提示框 e-->
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box'
import Suggest from '@/components/suggest/suggest' // 搜索结果组件
import Switches from '@/base/switches/switches'
import Scroll from '@/base/scroll/scroll'
import SongList from '@/base/song-list/song-list'
import Song from '@/common/js/song'
import SearchList from '@/base/search-list/search-list'
import TopTip from '@/base/top-tip/top-tip'
import { searchMixin } from '@/common/js/mixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [
        {name: '最近播放'},
        {name: '搜索历史'}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => { // 重新刷新scroll
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    selectSuggest() { // 选择搜索结果
      this.saveSearch()
      this.showTip()
    },
    switchItem(index) { // 切换tab
      this.currentIndex = index
    },
    selectSong(song, index) { // 选择播放历史的歌曲
      if (index !== 0) {
        // 这里的song是从本地存储读取的，它并不是Song的实例
        // 即使它有着和Song实例一样的数据格式，但它并没有Song实例内的方法
        // 因此需要转成Song实例
        this.insertSong(new Song(song))
        this.showTip()
      }
    },
    showTip() {
      this.$refs.topTip.show()
    },
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>