import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Reading from '@/views/Reading.vue'
import MeiHuaYiShu from '@/views/MeiHuaYiShu.vue'
import QiMen from '@/views/QiMen.vue'
import DaLiuRen from '@/views/DaLiuRen.vue'
import TaiYi from '@/views/TaiYi.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/reading', name: 'Reading', component: Reading },
  { path: '/meihua', name: 'MeiHuaYiShu', component: MeiHuaYiShu },
  { path: '/qimen', name: 'QiMen', component: QiMen },
  { path: '/liuren', name: 'DaLiuRen', component: DaLiuRen },
  { path: '/taiyi', name: 'TaiYi', component: TaiYi },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
