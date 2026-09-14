import type {App} from 'vue'
import Banner from './Banner.vue'
import GoodsItem from './GoodsItem.vue'
import XtxSku from './XtxSku.vue'
// 将components里面的组件进行全局化注册
export const componentPlugin = {
    install(app: App) {
        // app.component('组件名字', 组件配置对象)
        app.component('Banner', Banner);
        app.component('GoodsItem', GoodsItem);
        app.component('XtxSku', XtxSku);
    }
}