<template>
    <div class="HomeCategory">
        <div class="category">
            <ul>
                <li v-for="item in categoryStore.categoryList" :key="item.id">
                    <RouterLink :to="`/category/${item.id}`" class="categoryTitle">{{ item.name }}</RouterLink>
                    <span class="dot">/</span>
                    <RouterLink :to="`/category/sub/${chil.id}`" class="categoryContent" v-for="chil in item.children.slice(0,2)" :key="chil.id">{{ chil.name }}</RouterLink>
                    <i class="iconfont icon-jinru arrow"></i>
                    <div class="layer">
                        <span class="recommend">
                            <h4>分类推荐</h4>
                            <p>根据您的购买或浏览记录推荐</p>
                        </span>
                        <div class="goods">
                            <RouterLink :to="`/detail/${goods.id}`" v-for="goods in item.goods.slice(0,9)" :key="goods.id">
                                <img :src="goods.picture">
                                <div class="goodsContent">
                                    <h5>{{ goods.name }}</h5>
                                    <p class="desc">{{ goods.desc }}</p>
                                    <p class="price">￥<i>{{ goods.price }}</i></p>
                                </div>
                            </RouterLink>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts" name="HomeCategory">
    import {useCategoryStore} from '@/stores/categoryStore.ts'
    const categoryStore = useCategoryStore();
</script>

<style scoped lang="scss">
    .HomeCategory {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 500px;
    }
    .category {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 16px;
        box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);

        ul {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 8px 0;

            li {
                position: relative;
                display: flex;
                flex: 1;
                align-items: center;
                padding: 0 14px 0 20px;
                border-radius: 10px;
                transition: background 0.25s;

                // 一级分类
                .categoryTitle {
                    font-size: 14px;
                    font-weight: 500;
                    color: $inkColor;
                }
                .dot {
                    margin: 0 5px;
                    color: #d8dbe2;
                    font-size: 12px;
                }
                // 二级分类
                .categoryContent {
                    font-size: 12px;
                    color: $inkColor3;
                    margin-right: 8px;

                    &:hover {
                        color: $brandColor;
                    }
                }
                .arrow {
                    position: absolute;
                    right: 14px;
                    font-size: 12px;
                    color: #d8dbe2;
                    opacity: 0;
                    transition: opacity 0.25s;
                }
                &:hover {
                    background: $brandColorSoft;

                    .categoryTitle {
                        color: $brandColor;
                    }
                    .arrow {
                        opacity: 1;
                        color: $brandColor;
                    }
                    .layer {
                        display: block;
                    }
                }

                // 悬浮弹层
                .layer {
                    position: absolute;
                    top: -8px;
                    left: 100%;
                    margin-left: 18px;
                    width: 978px;
                    height: 500px;
                    padding: 24px 22px;
                    background-color: #fff;
                    border-radius: 16px;
                    box-shadow: 0 18px 40px rgba(35, 40, 56, 0.14);
                    display: none;

                    .recommend {
                        display: flex;
                        align-items: flex-end;

                        h4 {
                            font-size: 18px;
                            font-weight: 500;
                            color: $inkColor;
                        }
                        p {
                            margin-left: 12px;
                            font-size: 12px;
                            color: $inkColor3;
                        }
                    }
                    .goods {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                        margin-top: 16px;

                        a {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            width: 304px;
                            height: 122px;
                            padding: 11px 12px;
                            border-radius: 10px;
                            background-color: #fafbfc;
                            transition: all 0.25s;

                            img {
                                width: 100px;
                                height: 100px;
                                flex-shrink: 0;
                                border-radius: 8px;
                                object-fit: cover;
                                background-color: #f0f1f4;
                            }
                            .goodsContent {
                                flex: 1;
                                min-width: 0;

                                h5 {
                                    font-size: 13px;
                                    font-weight: 400;
                                    color: $inkColor;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }
                                .desc {
                                    margin-top: 4px;
                                    color: $inkColor3;
                                    font-size: 12px;
                                    display: -webkit-box;
                                    overflow: hidden;
                                    -webkit-line-clamp: 2;
                                    line-clamp: 2;
                                    -webkit-box-orient: vertical;
                                    word-break: break-all;
                                }
                                .price {
                                    margin-top: 4px;
                                    color: $priceColor;
                                    font-size: 13px;

                                    i {
                                        font-size: 16px;
                                        font-style: normal;
                                    }
                                }
                            }
                            &:hover {
                                background-color: #fff;
                                box-shadow: 0 6px 18px rgba(35, 40, 56, 0.1);
                            }
                        }
                    }
                }
            }
        }
    }
</style>
