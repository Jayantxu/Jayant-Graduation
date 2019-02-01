import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import register from '../views/Register'
import findPWD from '../views/FindPWD'
import writeNewComment from '../views/writeNewComment'
import userCenter from '../views/userCenter'
import nav1 from '../views/leftNavuserInfo/nav1'
import nav2 from '../views/leftNavuserInfo/nav2'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      hidden: true,
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      hidden: true,
      component: register
    },
    {
      path: '/findPWD',
      name: '/findPWD',
      hidden: true,
      component: findPWD
    },
    {
      path: '/writeNewComment',
      name: '/writeNewComment',
      hidden: true,
      component: writeNewComment
    },
    {
      path: '/userCenter',
      name: '用户中心',
      component: userCenter,
      hidden: false,
      children: [
        { path: '/userCenter/nav1', component: nav1, name: '行程计划', menuShow: true },
        { path: '/userCenter/nav2', component: nav2, name: '我的任务', menuShow: true }
      ]
    }
  ]
})
