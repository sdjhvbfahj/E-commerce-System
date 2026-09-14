<template>
    <div class="HomeProductPanel">
        <div class="top">
            <!-- 一级分类标题 -->
            <div class="left">
                <h3>{{ title }}</h3>
            </div>
            <div class="right">
                <ul>
                    <li v-for="item in category" :key="item.id">
                        <!-- 二级分类标题 -->
                        <RouterLink class="category" :to="`/category/sub/${item.id}`">{{ item.name }}</RouterLink>
                    </li>
                    <!-- 查看更多选项 -->
                    <RouterLink class="more" :to="`/category/${catId}`">
                        查看更多
                        <i class="iconfont icon-jinru"></i>
                    </RouterLink>
                </ul>
            </div>
        </div>
        <div class="bottom">
            <!-- 使用默认插槽呈现具体内容 -->
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts" name="HomeProductPanel">
    defineProps(['title', 'category', 'catId']);
</script>

<style scoped lang="scss">
    .HomeProductPanel {
        width: 100%;
        height: 100%;

        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;

            .left {
                h3 {
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
            }
            .right {
                ul {
                    display: flex;
                    align-items: center;

                    li {
                        .category {
                            display: block;
                            padding: 6px 14px;
                            margin: 0px 2px;
                            font-size: 13px;
                            border-radius: 15px;
                            color: $inkColor2;
                            background: #f5f6f8;
                            transition: all 0.25s;

                            &:hover {
                                color: #fff;
                                background: $brandColor;
                            }
                        }
                    }
                }
                .more {
                    margin-left: 18px;
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
    }
</style>
