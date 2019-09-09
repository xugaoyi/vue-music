import Vue from 'vue'
import Router from 'vue-router'

// 路由同步加载
// import Recommend from '@/components/recommend/recommend'
// import Singer from '@/components/singer/singer'
// import Rank from '@/components/rank/rank'
// import Search from '@/components/search/search'
// import SingerDetail from '@/components/singer-detail/singer-detail'
// import Disc from '@/components/disc/disc'
// import TopList from '@/components/top-list/top-list'
// import UserCenter from '@/components/user-center/user-center'

Vue.use(Router)

// 路由懒加载
const Recommend = () => import('@/components/recommend/recommend')
const Singer = () => import('@/components/singer/singer')
const Rank = () => import('@/components/rank/rank')
const Search = () => import('@/components/search/search')
const SingerDetail = () => import('@/components/singer-detail/singer-detail')
const Disc = () => import('@/components/disc/disc')
const TopList = () => import('@/components/top-list/top-list')
const UserCenter = () => import('@/components/user-center/user-center')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend' // 重定向
    },
    {
      path: '/recommend', // 推荐
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc // 歌单详情页
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail // 歌手详情
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id', // 在rank页面点击item时设置跳转子路由，通过vuex传入数据到详情页
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail // 歌手详情
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
