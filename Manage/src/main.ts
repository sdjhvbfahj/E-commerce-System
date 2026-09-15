import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
// Element Plus 图标：菜单图标写在数据里，需要动态渲染，所以全局注册
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/es/components/message/style/index'
import 'element-plus/es/components/message-box/style/index'

// 引入初始化样式文件
import '@/styles/common.scss'
// 引入权限指令插件并注册（v-permission）
import { permissionPlugin } from '@/directives/permission.ts'
// 引入全局组件插件
import { componentPlugin } from '@/components/index.ts'

const app = createApp(App);
const pinia = createPinia();

// 注册pinia数据持久化插件(等价于localStorage)
pinia.use(piniaPluginPersistedstate);

Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
    app.component(key, component);
});

app.use(pinia);
app.use(router);
app.use(permissionPlugin);
app.use(componentPlugin);

app.mount('#app');
