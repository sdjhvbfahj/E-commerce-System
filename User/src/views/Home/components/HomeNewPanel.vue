<template>
    <!-- 封装新鲜好物和人气推荐两个模块 -->
    <div class="HomePanel">
        <div class="wrapper">
            <div class="title">
                <div class="left">
                    <h2>{{title}}</h2>
                    <span>{{subtitle}}</span>
                </div>
                <div class="right">
                    <RouterLink to="/">
                        查看更多
                        <i class="iconfont icon-jinru"></i>
                    </RouterLink>
                </div>
            </div>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="HomePanel">
    const {title, subtitle} = defineProps<{title:string, subtitle:string}>()
</script>

<style scoped lang="scss">
    .HomePanel {
        background-color: #fff;
        height: 540px;
        .wrapper {
            width: 1240px;
            margin: 0px auto;
            .title {
                padding: 40px 0px;
                display: flex;
                justify-content: space-between;
                .left {
                    display: flex;
                    align-items: flex-end;
                    h2 {
                        margin: 0px 0px 0px 5px;
                        font-weight: 400;
                        font-size: 32px;
                    }
                    span {
                        margin-left: 20px;
                        font-size: 16px;
                        color: #999;
                    }
                }
                .right {
                    display: flex;
                    align-items: flex-end;
                    a {
                        font-size: 16px;
                        color: #999;
                        &:hover {
                            color: $xtxColor;
                        }
                    }
                }
            }
        }
    }
</style>