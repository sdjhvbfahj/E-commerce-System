<template>
    <!-- 封装新鲜好物 / 人气推荐 / 热门品牌 / 最新专题等模块 -->
    <div class="HomePanel" :class="{plain}">
        <div class="wrapper">
            <div class="head">
                <div class="left">
                    <h2>{{title}}</h2>
                    <span>{{subtitle}}</span>
                </div>
                <RouterLink class="more" :to="morePath">
                    查看更多
                    <i class="iconfont icon-jinru"></i>
                </RouterLink>
            </div>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="HomePanel">
    withDefaults(defineProps<{title:string, subtitle:string, morePath?:string, plain?:boolean}>(), {
        morePath: '/topic',
        // plain = true 时不铺白底（热门品牌及以下的板块都不要背景色）
        plain: false
    })
</script>

<style scoped lang="scss">
    /* 白色背景铺在外层，里面的 wrapper 只负责居中（保持原来模板的做法） */
    .HomePanel {
        width: 100%;
        background-color: #fff;
        padding: 34px 0 40px;

        &.plain {
            background-color: transparent;
        }

        .wrapper {
            width: 1240px;
            margin: 0px auto;
        }
        .head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;

            .left {
                display: flex;
                align-items: baseline;

                h2 {
                    position: relative;
                    padding-left: 14px;
                    font-size: 22px;
                    font-weight: 500;
                    color: $inkColor;

                    &::before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 4px;
                        height: 20px;
                        border-radius: 2px;
                        background: $brandGradient;
                    }
                }
                span {
                    margin-left: 12px;
                    font-size: 13px;
                    color: $inkColor3;
                }
            }
            .more {
                font-size: 13px;
                color: $inkColor3;

                .iconfont {
                    font-size: 12px;
                }
                &:hover {
                    color: $brandColor;
                }
            }
        }
    }
</style>
