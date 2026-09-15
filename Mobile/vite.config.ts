import { defineConfig } from 'vite'
import uniPlugin from '@dcloudio/vite-plugin-uni'

/**
 * 说明：@dcloudio/vite-plugin-uni 这个版本是 CJS 产物，
 * 在 "type": "module" 的工程里默认导入有时会拿到命名空间对象而不是函数，
 * 这里做一次兜底取值，避免 "uni is not a function"。
 */
const uni = (typeof uniPlugin === 'function' ? uniPlugin : (uniPlugin as any).default) as typeof uniPlugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    // 与用户端(5173)、管理端(5175)错开端口，方便三端同时开着对比
    port: 5176,
  },
})
