import type { App } from 'vue'
import EChart from './EChart.vue'
// 将components里面的组件进行全局化注册
export const componentPlugin = {
    install(app: App) {
        app.component('EChart', EChart);
    },
};
