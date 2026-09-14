<template>
    <div class="HomeProduct" v-for="item in goodsList" :key="item.id">
        <div class="wrapper">
            <HomeProductPanel :title="item.name" :category="item.children" :cat-id="item.id">
                <!-- 默认插槽 -->
                <div class="content">
                    <div class="left">
                        <RouterLink :to="`/category/${item.id}`">
                            <img v-img-lazy="item.picture">
                            <div class="left-mask">
                                <p class="name">{{ item.name }}专场</p>
                                <p class="go">进入分类<i class="iconfont icon-jinru"></i></p>
                            </div>
                        </RouterLink>
                    </div>
                    <div class="right">
                        <ul>
                            <li v-for="goods in item.goods" :key="goods.id">
                                <GoodsItem :goods/>
                                <!-- 鼠标悬停出现的更多宝贝的提示页面 -->
                                <div class="cover">
                                    <RouterLink :to="`/detail/${goods.id}`">
                                        <p>找相似</p>
                                        <p></p>
                                        <p>发现更多宝贝<span class="iconfont icon-jinru"></span></p>
                                    </RouterLink>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </HomeProductPanel>
        </div>
    </div>
</template>

<script setup lang="ts" name="HomeProduct">
    import HomeProductPanel from './HomeProductPanel.vue'
    import {getGoodsAPI, type GoodsCategoryItem} from '@/apis/home.ts'
    import {ref, onMounted} from 'vue'
    // 定义ref数据, 用于接收goods数据
    let goodsList = ref<GoodsCategoryItem[]>([]);
    async function getGoods() {
        const result = await getGoodsAPI() as any;
        goodsList.value = result.result;
    }
    onMounted(() => {
        getGoods();
    })
</script>

<style scoped lang="scss">
    /* 白色背景铺在整个楼层外层（原来模板的做法），wrapper 只负责居中 */
    .HomeProduct {
        width: 100%;
        padding: 34px 0 30px;

        .wrapper {
            width: 1240px;
            margin: 0px auto;
        }
        .content {
            display: flex;
            gap: 20px;
        }
        /* 左侧大图卡 */
        .left {
            width: 268px;
            height: 596px;
            flex-shrink: 0;
            border-radius: 14px;
            overflow: hidden;

            a {
                position: relative;
                display: block;
                width: 100%;
                height: 100%;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                .left-mask {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding: 46px 22px 22px;
                    color: #fff;
                    background: linear-gradient(180deg, rgba(35, 40, 56, 0) 0%, rgba(35, 40, 56, 0.72) 100%);

                    .name {
                        font-size: 20px;
                        font-weight: 500;
                    }
                    .go {
                        margin-top: 8px;
                        font-size: 13px;
                        opacity: 0.85;

                        .iconfont {
                            font-size: 12px;
                            margin-left: 4px;
                        }
                    }
                }
                &:hover img {
                    transform: scale(1.06);
                }
            }
        }
        /* 右侧商品格 */
        .right ul {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 291px;
            gap: 14px;

            li {
                position: relative;
                overflow: hidden;
                border-radius: 14px;
                background: #fff;
                box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);
                padding: 14px 16px 0;
                transition: all 0.3s ease;

                .cover {
                    position: absolute;
                    left: 0px;
                    bottom: -78px;
                    width: 100%;
                    height: 78px;
                    background: $brandGradient;
                    transition: all 0.4s ease;

                    a {
                        display: block;
                        width: 100%;
                        height: 100%;
                        text-align: center;

                        p:first-child {
                            margin: 13px 0px 5px;
                            font-size: 16px;
                            color: #fff;
                        }
                        p:nth-child(2) {
                            display: block;
                            margin: 3px auto;
                            width: 90px;
                            height: 1px;
                            background-color: rgba(255, 255, 255, 0.7);
                        }
                        p:last-child {
                            display: block;
                            margin-top: 5px;
                            font-size: 12px;
                            color: #fff;

                            .iconfont {
                                vertical-align: middle;
                                font-size: 12px;
                                color: #fff;
                            }
                        }
                    }
                }
                &:hover {
                    box-shadow: 0 12px 28px rgba(35, 40, 56, 0.14);
                    transform: translateY(-4px);

                    .cover {
                        bottom: 0px;
                    }
                }
            }
        }
    }
</style>
