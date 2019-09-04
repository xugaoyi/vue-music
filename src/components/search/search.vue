<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>

    <!-- 热门搜索 -->
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotKey" :key="item.n" @click="addQuery(item.k)" >
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>

          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>

    <!-- 搜索结果 -->
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
    </div>

    <!-- 弹窗 -->
    <confirm ref="confirm" text="是否清空所有搜索历史？" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <!-- 歌手详情 -->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box'
import SearchList from '@/base/search-list/search-list'
import Suggest from '@/components/suggest/suggest'
import Confirm from '@/base/confirm/confirm'
import Scroll from '@/base/scroll/scroll'
import { getHotKey } from '@/api/search'
import { ERR_OK } from '@/api/config'
import { mapActions, mapGetters } from 'vuex'
import { playlistMixin } from '@/common/js/mixin' // 小播放器不遮挡列表处理

export default {
  mixins: [playlistMixin],
  created() {
    this._getHotKey()
  },
  data() {
    return {
      hotKey: [],
      query: ''
    }
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory) // hotKey和searchHistory其中之一有变化时都会重新计算，随后会更新scroll的高度
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    handlePlaylist(playlist) { // 小播放器不遮挡列表处理
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
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
    // 仅是直接调用mapActions方法的，可以直接在DOM标签上调用，mapActions相当于在methods上绑定了方法
    // deleteOne(item) { // 删除一条历史
    //   this.deleteSearchHistory(item)
    // },
    showConfirm() { // 弹窗询问是否清空历史记录
      this.$refs.confirm.show()
    },
    _getHotKey() { // 获取热门搜索关键字
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) { // 在从搜索结果切换到搜索记录时手动刷新scroll组件
        setTimeout(() => {
          this.$refs.shortcut.refresh() // 调用scroll组件的刷新事件
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>