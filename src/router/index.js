import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Reading from '@/views/Reading.vue'
import MeiHuaYiShu from '@/views/MeiHuaYiShu.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/reading', name: 'Reading', component: Reading },
  { path: '/meihua', name: 'MeiHuaYiShu', component: MeiHuaYiShu },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
