import {useIntersectionObserver} from '@vueuse/core'
import type { App, DirectiveBinding } from 'vue'

export const imgLazyPlugin = {
    install(app: App) {
        // 实现一个图片懒加载的指令
        app.directive('img-lazy', {
            mounted(el:HTMLImageElement, binding:DirectiveBinding) {
                // el: 指令绑定的那个元素 img
                // binding: binding.value 指令等于号后面绑定的表达式的值
                const {stop} = useIntersectionObserver(// 调用vueuse封装的组件
                    el,
                    ([entry]) => {
                        // 判断是否进入可视区
                        if(entry?.isIntersecting) {
                            // 进入可视区, 给img的src属性赋值，完成渲染
                            el.src = binding.value;
                            // 加载完立刻停止监听
                            stop();
                        }
                    },
                )
            }
        });
    }
}