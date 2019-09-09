/**
 * store入口文件（在main.js绑定此入口）
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions' // 这种语法可以这样获取里面的对象：actions.对象 ，不用像和ES6解构赋值 {对象1，对象2}一个个去写对象名称
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger' // 在控制台打印state参数的变化

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production' // 是否在开发环境中

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug, // 如开发环境中，开启严格模式，用于检测对于state的修改是不是通过mutations去修改，如直接修改会报错
  plugins: debug ? [createLogger()] : []
})