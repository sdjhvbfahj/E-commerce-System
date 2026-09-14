import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import 'element-plus/es/components/message/style/index'

// 引入初始化样式文件
import '@/styles/common.scss'
// 引入懒加载指令插件并注册
import {imgLazyPlugin} from '@/directives/index.ts'
// 引入全局组件插件
import {componentPlugin} from '@/components/index.ts'

const app = createApp(App);
const pinia = createPinia();

// 注册pinia用户数据持久化插件(等价于localStorage)
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(imgLazyPlugin);
app.use(componentPlugin);

app.mount('#app');
