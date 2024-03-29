<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text"  @click="changeMode">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll :data="sequenceList" :refreshDelay="refreshDelay" ref="listContent" class="list-content">
          <transition-group ref="list" name="list" tag="ul">
            <li ref="listItem" class="item" v-for="(item,index) in sequenceList" :key="item.id" @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表？" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
// import { mapGetters, mapMutations, mapActions } from 'vuex'
import { mapActions } from 'vuex'
import { playMode } from '@/common/js/config' // 播放模式
import Scroll from '@/base/scroll/scroll'
import Confirm from '@/base/confirm/confirm'
import { playerMixin } from '@/common/js/mixin' // 共享代码的引入
import AddSong from '@/components/add-song/add-song'

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false,
      refreshDelay: 120 // 延迟刷新scroll组件，处理使用transition-group后滚动位置不对的问题
    }
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
    // ...mapGetters([ // 这里相当于把获取到的数据存放到data
    //   'sequenceList',
    //   'currentSong',
    //   'playlist',
    //   'mode'
    // ])
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => { // 需在显示列表时刷新才能使scroll组件滚动
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    getCurrentIcon(item) { // 添加当前播放歌曲图标
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem(item, index) { // 选中歌曲
      if (this.mode === playMode.random) { // 随机播放模式 (因为随机播放时的播放列表是打乱的，索引在获取索引是需要findIndex)
        index = this.playlist.findIndex((song) => { // 找到当前点击歌曲在播放列表中的索引，赋值给currentIndex
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrent(current) { // 滚动到当前播放歌曲
      const index = this.sequenceList.findIndex((song) => { // 找到当前播放歌曲在顺序列表中的索引（播放列表不管什么播放模式都是顺序列表展示）
        return current.id === song.id
      })
      /**
       * bug修复说明：
       * 使用this.$refs.listItem[index]在添加歌曲到队列后无法获取正确的li列表DOM，可能是因为li在scroll组件实例内部的DOM，
       * 因此需通过使用$el的方式才能正确的获取到更新后的DOM
       * this.$refs.list.$el.children[index]
       */
      this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300) // 滚动到相应位置 300毫秒
    },
    deleteOne(item) {
      this.deleteSong(item)
      if (!this.playlist.length) { // 当已删除完
        this.hide()
      }
    },
    showConfirm() { // 是否清空询问框
      this.$refs.confirm.show()
    },
    confirmClear() { // 清空
      this.deleteSongList()
      this.hide()
    },
    addSong() { // 添加歌曲
      this.$refs.addSong.show()
    },
    // ...mapMutations({
    //   setCurrentIndex: 'SET_CURRENT_INDEX',
    //   setPlayingState: 'SET_PLAYING_STATE' // 播放状态
    // }),
    ...mapActions(['deleteSong', 'deleteSongList'])
  },
  watch: {
    currentSong(newSong, oldSong) { // 当切换歌曲时 滚动到相应位置
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>