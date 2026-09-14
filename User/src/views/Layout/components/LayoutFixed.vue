<template>
    <div class="LayoutFixed" :class="{show: y>80}">
        <div class="wrapper">
            <!-- logo区 -->
            <div class="logo">
                <RouterLink to="/"></RouterLink>
            </div>
            <!-- 导航区 -->
            <div class="nav">
                <LayoutHeaderUI/>
            </div>
            <!-- 右侧导航区 -->
            <div class="right">
                <RouterLink to="/brand">品牌</RouterLink>
                <RouterLink to="/topic">专题</RouterLink>
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
        background-color: #fff;
         /* 设置位置模式为fixed, 初始位置为top: -100px; */
        position: fixed;
        left: 0px;
        top: -100px;
        width: 100%;
        height: 80px;
        opacity: 0;
         /* 当滚动一定距离, 实现吸顶导航交互 */
        &.show {
            top: 0px;
            opacity: 1;
            transition: all 0.4s;
        }
        .wrapper {
            width: 1240px;
            margin: 0px auto;
            height: 100%;
            display: flex;
            align-items: center;
             /* logo区 */
            .logo {
                width: 200px;
                height: 100%;
                margin-left: 28px;
                a {
                    display: block;
                    width: 100%;
                    height: 100%;
                    background-image: url(@/assets/images/logo.png);
                    background-repeat: no-repeat;
                    background-size: contain;
                }
            }
            /*  中间导航区样式在LayoutHeaderUL.vue文件中
                右侧导航区样式 */
            .right {
                border-left: 3px solid $sucColor;
                a {
                    line-height: 1;
                    margin-left: 44px;
                    font-size: 16px;
                    &:hover {
                        color: $sucColor;
                    }
                }
            }
        }
    }
</style>