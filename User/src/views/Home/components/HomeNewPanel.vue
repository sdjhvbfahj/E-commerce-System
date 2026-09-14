<template>
    <!-- 封装新鲜好物和人气推荐两个模块 -->
    <div class="HomePanel">
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
</template>

<script setup lang="ts" name="HomePanel">
    withDefaults(defineProps<{title:string, subtitle:string, morePath?:string}>(), {
        morePath: '/topic'
    })
</script>

<style scoped lang="scss">
    .HomePanel {
        background-color: #fff;
        border-radius: 16px;
        padding: 26px 28px 30px;
        box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);

        .head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 22px;

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
