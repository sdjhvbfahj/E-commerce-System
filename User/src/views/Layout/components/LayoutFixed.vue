<template>
    <div class="LayoutFixed" :class="{show: y>180}">
        <div class="wrapper">
            <!-- logo区 -->
            <div class="logo">
                <RouterLink to="/">621电商</RouterLink>
            </div>
            <!-- 导航区 -->
            <div class="nav">
                <LayoutHeaderUI/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="LayoutFixed">
    import LayoutHeaderUI from './LayoutHeaderUI.vue';
    import {useScroll} from '@vueuse/core'
    // 监听页面y轴滚动距离
    const {y} = useScroll(window);
</script>

<style scoped lang="scss">
    .LayoutFixed {
        z-index: 999;
        /* 设置位置模式为fixed, 初始位置为top: -100px; */
        position: fixed;
        left: 0px;
        top: -110px;
        width: 100%;
        height: 68px;
        opacity: 0;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: saturate(180%) blur(12px);
        box-shadow: 0 6px 20px rgba(35, 40, 56, 0.08);
        /* 当滚动一定距离, 实现吸顶导航交互 */
        &.show {
            top: 0px;
            opacity: 1;
            transition: all 0.4s ease;
        }
        .wrapper {
            width: 1240px;
            margin: 0px auto;
            height: 100%;
            display: flex;
            align-items: center;
            /* logo区 */
            .logo {
                width: 190px;
                height: 100%;
                display: flex;
                align-items: center;

                a {
                    display: block;
                    width: 100%;
                    height: 46px;
                    font-size: 0px;
                    background-image: url(@/assets/images/logo.svg);
                    background-repeat: no-repeat;
                    background-position: left center;
                    background-size: contain;
                }
            }
            /*  中间导航区样式在 LayoutHeaderUI.vue 中 */
            .nav {
                flex: 1;
                display: flex;
                align-items: center;
            }
        }
    }
</style>
