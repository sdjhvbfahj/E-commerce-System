<template>
    <div class="allCategory">
        <h2>全部分类</h2>
        <ul>
            <!-- 遍历全部分类 -->
            <li v-for="item in secondCategory" :key="item.id">
                <RouterLink :to="`/category/sub/${item.id}`">
                    <img :src="item.picture">
                    <h3>{{item.name}}</h3>
                </RouterLink>
            </li>
        </ul>
    </div>
    <!-- 遍历每个类别的商品 -->
    <div class="category" v-for="item in secondCategory" :key="item.id">
        <div class="title">
            <h3>- {{ item.name }} -</h3>
            <p>温暖柔软 品质之选</p>
            <RouterLink :to="`/category/sub/${item.id}`">
                查看更多<i class="iconfont icon-jinru"></i>
            </RouterLink>
        </div>
        <ul class="goods">
            <li v-for="goods in item.goods" :key="goods.id">
                <GoodsItem :goods="goods"/>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts" name="CategoryGoods">
    // 引入商品样式
    defineProps(['secondCategory']);
</script>

<style scoped lang="scss">
    .allCategory {
        margin-top: 20px;
        width: 100%;
        height: 260px;
        background-color: #fff;
        h2 {
            margin: 0px;
            font-size: 28px;
            color: #666;
            font-weight: 400;
            text-align: center;
            height: 90px;
            line-height: 90px;
        }
        ul {
            display: flex;
            padding: 0px 32px;
            overflow: hidden;
            li {
                width: 168px;
                height: 160px;
                a {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    &:hover {
                        h3 {
                            color: $xtxColor;
                        }
                    }
                    img {
                        width: 100px;
                        height: 100px;
                        background: transparent;
                    }
                    h3 {
                        margin-top: 10px;
                        font-size: 16px;
                        font-weight: 400;
                    }
                }
            }
        }
    }
    .category {
        margin-top: 20px;
        width: 100%;
        height: 458px;
        background-color: #fff;
        .title {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 120px;
            h3 {
                font-weight: 400;
                font-size: 28px;
                color: #666;
            }
            p {
                margin-top: 10px;
                font-size: 20px;
                color: #999;
            }
            a {
                color: #999;
                position: absolute;
                top: 12px;
                right: 10px;
                font-size: 16px;
                &:hover {
                    color: $xtxColor;
                }
            }
        }
        .goods {
            display: flex;
            width: 100%;
            height: 338px;
            padding: 19px 65px;
            li {
                width: 220px;
                height: 300px;
                :deep(a) {
                    position: relative;
                    top: 0px;
                    padding: 15px 30px;
                    text-align: center;
                    transition: all 0.3s;
                    &:hover {
                        top: -3px;
                        box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.2);
                    }
                }
                :deep(a .info h4) {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                :deep(a .info p) {
                    color: #999;
                    font-size: 14px;
                }
            }
        }
    }
</style>