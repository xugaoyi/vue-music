import * as types from './mutation-types' // 为什么要用mutation-types？便于书写方便

const mutations = {
  [types.SET_SINGER](state, singer) { // state 为state.js中的state对象，singer要传过去的
    state.singer = singer
  }
}
export default mutations