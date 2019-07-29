<template>
  <div id="app">
    <m-header></m-header>
    <tad></tad>
    <keep-alive> <!-- 添加此标签可防止在切换页面时重新加载页面 -->
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from './components/m-header/m-header'
import Tad from './components/tab/tab'
import Player from './components/player/player'

export default {
  components: {
    MHeader,
    Tad,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>