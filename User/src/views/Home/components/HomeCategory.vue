<template>
    <div class="HomeCategory">
        <div class="category">
            <ul>
                <li v-for="item in categoryStore.categoryList" :key="item.id">
                    <RouterLink :to="`/category/${item.id}`" class="categoryTitle">{{ item.name }}</RouterLink>
                    <RouterLink :to="`/category/sub/${chil.id}`" class="categoryContent" v-for="chil in item.children.slice(0,2)" :key="chil.id">{{ chil.name }}</RouterLink>
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
        height: 500px;
        width: 250px;
        .category {
            width: 100%;
            height: 100%;
            ul {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                background-color: rgba(35, 40, 56, 0.88);
                li {
                    padding-left: 40px;
                    display: flex;
                    flex: 1;
                    align-items: center;
                    // 一级分类样式
                    .categoryTitle {
                        font-size: 16px;
                        color: #fff;
                    }
                    // 二级分类样式
                    .categoryContent {
                        font-size: 14px;
                        color: #fff;
                        margin-left: 10px;
                    }
                    &:hover {
                        background-color: $brandColor;
                        .layer {
                            display: block;
                        }
                    }
                    // layer弹层样式
                    .layer {
                        position: absolute;
                        width: 990px;
                        height: 500px;
                        top: 0px;
                        left: 250px;
                        background-color: rgba(255, 255, 255, 0.94);
                        padding: 10px;
                        display: none;
                        .recommend {
                            margin-top: 18px;
                            display: flex;
                            align-items: flex-end;
                            h4 {
                                margin-left: 10px;
                                font-size: 20px;
                                font-weight: 400;
                            }
                            p {
                                margin-left: 14px;
                                font-size: 14px;
                                color: $inkColor2;
                            }
                        }
                        .goods {
                            padding-top: 30px;
                            padding-bottom: 30px;
                            display: flex;
                            align-items: space-between;
                            flex-wrap: wrap;
                            width: 100%;
                            height: 100%;
                            a {
                                display: flex;
                                align-items: center;
                                margin-left: 14px;
                                width: 306px;
                                height: 120px;
                                background-color: #fff;
                                img {
                                    margin-left: 10px;
                                    width: 100px;
                                    height: 100px;
                                }
                                .goodsContent {
                                    padding-left: 10px;
                                    display: flex;
                                    flex-direction: column;
                                    h5 {
                                        margin: 0px;
                                        font-weight: 400;
                                        font-size: 16px;
                                        color: $inkColor2;
                                    }
                                    .desc {
                                        color: $inkColor3;
                                        font-size: 14px;
                                        display: -webkit-box;
                                        overflow: hidden;
                                        -webkit-line-clamp: 2;
                                        line-clamp: 2;
                                        -webkit-box-orient: vertical;
                                        word-break: break-all;
                                    }
                                    .price {
                                        color: $priceColor;
                                        font-size: 14px;
                                        i {
                                            font-size: 20px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>