import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import(/* webpackChunkName: "upload" */ '../views/upload')
  }
]

const router = new VueRouter({ routes })

export default router
