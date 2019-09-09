<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getMusicList } from '@/api/rank'
import { ERR_OK } from '@/api/config'
import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'

export default {
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([ // ps：设置数据是对象类型，获取数据是数组类型
      'topList'
    ])
  },
  created() {
    this._getMusicList()
  },
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) { // 不是从排行榜点击进来时
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
