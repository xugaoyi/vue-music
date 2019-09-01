<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>

    <!-- 热门搜索 -->
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKey" :key="item.n" @click="addQuery(item.k)" >
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>

    <!-- 歌手详情 -->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box'
import { getHotKey } from '@/api/search'
import { ERR_OK } from '@/api/config'
import Suggest from '@/components/suggest/suggest'

export default {
  created() {
    this._getHotKey()
  },
  data() {
    return {
      hotKey: [],
      query: ''
    }
  },
  methods: {
    addQuery(query) {
      this.$refs.searchBox.setQuery(query) // 调用子组件方法并传入值
    },
    onQueryChange(query) { // 接收搜索框组件派发的事件和传入的值
      this.query = query
    },
    _getHotKey() { // 获取热门搜索关键字
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    }
  },
  components: {
    SearchBox,
    Suggest
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