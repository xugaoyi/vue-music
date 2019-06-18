<template>
  <div id="app">
    <m-header></m-header>
    <tad></tad>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from './components/m-header/m-header'
import Tad from './components/tab/tab'

export default {
  components: {
    MHeader,
    Tad
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>