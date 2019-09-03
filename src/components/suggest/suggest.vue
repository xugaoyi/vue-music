<template>
   <!-- 搜索结果列表 -->
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import Singer from '@/common/js/singer'
import NoResult from '@/base/no-result/no-result'
import { search } from '@/api/search'
import { ERR_OK } from '@/api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import { mapMutations, mapActions } from 'vuex'

const TYPE_SINGER = 'singer'
const perpage = 20 // 每页查询多少条数据

export default {
  props: {
    showSinger: {
      type: Boolean,
      default: true
    },
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      beforeScroll: true, // 传入给scroll的属性，打开滚动前处理事件
      pullup: true, // 上拉加载
      hasMore: true // 是否已加载完
    }
  },
  methods: {
    refresh() { // 刷新scroll
      this.$refs.suggest.refresh()
    },
    search() { // 执行搜索
      // 恢复初始值
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then((res) => { // 调用搜索接口 参数：1搜索关键字  2请求第几页 3是否显示歌手
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.result = result
          })
          this._checkMore(res.data) // 检查是否还有更多数据
        }
      })
    },
    searchMore() { // 上拉加载
      if (!this.hasMore) { // 是否还有更多
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then((res) => { // 调用搜索接口 参数：1搜索关键字  2请求第几页 3是否显示歌手
        if (res.code === ERR_OK) {
          // this.result = this.result.concat(this._genResult(res.data))
          this._genResult(res.data).then((result) => {
            this.result = this.result.concat(result)
          })
          this._checkMore(res.data) // 检查是否还有更多数据
        }
      })
    },
    getIconCls(item) { // 图标类型
      if (item.type === TYPE_SINGER) {
        return 'icon-mine' // 歌手图标
      } else {
        return 'icon-music' // 音乐图标
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) { // 如果是歌手直接显示歌手名称，否则显示歌曲和歌手的拼接
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) { // 进入歌手详情
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer) // 设置singer的vuex
      } else { // 进入歌曲
        this.insertSong(item)
      }
      this.$emit('select') // 点击搜索结果外部的操作有：保存到本地存储和vuex
    },
    listScroll () { // 滚动结果列表时
      this.$emit('listScroll')
    },
    _checkMore(data) { // 检查是否还有更多数据
      const song = data.song
      if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult(data) { // 拼接数据
      let ret = []
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } }) // 扩展运算符，把被扩展对象的每个属性展开push到ret
      }
      return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
        ret = ret.concat(songs)
        return ret
      })
    },
    _normalizeSongs(list) { // 对数据进行改装
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong'])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        return
      }
      this.search(newQuery) // 执行搜索
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>