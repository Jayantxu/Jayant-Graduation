import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import register from '@/views/register'
import findPWD from '@/views/FindPWD'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/findPWD',
      name: '/findPWD',
      component: findPWD
    }
  ]
})
