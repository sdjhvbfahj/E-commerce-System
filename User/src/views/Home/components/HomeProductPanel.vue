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
                    <RouterLink class="more" to="/">
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
    defineProps(['title', 'category']);
</script>

<style scoped lang="scss">
    .HomeProductPanel {
        width: 100%;
        height: 100%;
        .top {
            height: 125px;
            padding: 40px 0px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
                h3 {
                    margin-left: 6px;
                    font-size: 32px;
                    font-weight: 400;
                }
            }
            .right {
                ul {
                    display: flex;
                    li {
                        .category {
                            display: block;
                            padding: 2px 10px;
                            margin: 0px 1px;
                            font-size: 16px;
                            border-radius: 5px;
                            &:hover {
                                background-color: $xtxColor;
                                color: #fff;
                            }
                        }
                    }
                }
                .more {
                    line-height: 26px;
                    font-size: 16px;
                    color: #999;
                    margin-left: 60px;
                    margin-right: 4px;
                    &:hover {
                        color: $xtxColor;
                    }
                }
            }
        }
        .bottom {
            width: 100%;
            height: 600px;
        }
    }
</style>