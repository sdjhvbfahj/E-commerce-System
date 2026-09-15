import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'

import App from './App.vue'

/**
 * uni-app（Vue3）的入口写法：必须导出 createApp 供各端调用。
 * 同时把 Pinia 一起返回，uni-app 运行时需要拿到它做 SSR/多页实例复用。
 *
 * 与用户端的差异：这里没有 vue-router（页面路由由 pages.json 定义）、
 * 没有 Element Plus（移动端用自研轻量组件），也没有 axios（走本地假数据客户端）。
 */
export function createApp() {
  const app = createSSRApp(App)

  const pinia = Pinia.createPinia()
  app.use(pinia)

  return { app, Pinia }
}
