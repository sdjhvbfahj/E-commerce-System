<template>
    <div class="goods-footer">
        <div class="goods-article">
            <!-- 商品详情 -->
            <div class="goods-tabs">
                <nav>
                    <a>商品详情</a>
                </nav>
                <div class="goods-detail">
                    <!-- 属性 -->
                    <ul class="attrs">
                        <li v-for="item in detailList.details?.properties" :key="item.name">
                            <span class="dt">{{ item.name }}</span>
                            <span class="dd">{{ item.value }}</span>
                        </li>
                    </ul>
                    <!-- 图片 -->
                    <img v-for="item in detailList.details?.pictures" :key="item" v-img-lazy="item">
                </div>
            </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
            <!-- 24小时热销榜 -->
            <DetailHot :type="1"/>
            <!-- 周热销榜 -->
            <DetailHot :type="2"/>
        </div>
    </div>
</template>

<script setup lang="ts" name="DetailGoodsFooter">
    import DetailHot from './DetailHot.vue'
    defineProps(['detailList']);
</script>

<style scoped lang="scss">
    .goods-footer {
        display: flex;
        margin-top: 20px;
        .goods-article {
            width: 940px;
            margin-right: 20px;
        }
        .goods-aside {
            width: 280px;
        }
    }
    .goods-warn {
        min-height: 600px;
        background: #fff;
        margin-top: 20px;
    }
    .number-box {
        display: flex;
        align-items: center;
        .label {
            width: 60px;
            color: #999;
            padding-left: 10px;
        }
    }
    .goods-tabs {
        min-height: 600px;
        background: #fff;
        border-radius: 16px;
        box-shadow: $shadowSm;
        overflow: hidden;
        nav {
            height: 64px;
            line-height: 64px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            border-bottom: 1px solid $lineColor;
            a {
                padding: 0 22px;
                font-size: 16px;
                font-weight: 500;
                color: $inkColor;
                position: relative;
                &::after {
                    content: '';
                    position: absolute;
                    left: 22px;
                    right: 22px;
                    bottom: 0;
                    height: 3px;
                    border-radius: 2px;
                    background: $brandGradient;
                }
                >span {
                    color: $priceColor;
                    font-size: 15px;
                    margin-left: 10px;
                }
            }
        }
    }
    .goods-detail {
        padding: 36px 40px;
        .attrs {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 30px;
            padding: 18px 22px;
            border-radius: 12px;
            background: #f7f8fa;
            li {
                display: flex;
                margin-bottom: 10px;
                width: 50%;

                .dt {
                    width: 100px;
                    color: $inkColor3;
                }
                .dd {
                    flex: 1;
                    color: $inkColor2;
                }
            }
        }
        >img {
            width: 100%;
            border-radius: 12px;
            margin-bottom: 12px;
        }
    }
</style>