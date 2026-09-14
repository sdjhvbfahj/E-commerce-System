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
            <h3>{{ item.name }}</h3>
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
        background-color: #fff;
        border-radius: 16px;
        box-shadow: $shadowSm;
        padding: 26px 24px 30px;

        h2 {
            margin: 0px;
            padding-bottom: 22px;
            font-size: 20px;
            font-weight: 500;
            color: $inkColor;
            text-align: center;
        }
        ul {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 12px;

            li {
                a {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 152px;
                    border-radius: 14px;
                    background-color: #fafbfc;
                    transition: all 0.28s ease;

                    img {
                        width: 92px;
                        height: 92px;
                        border-radius: 12px;
                        object-fit: cover;
                        background: transparent;
                    }
                    h3 {
                        margin-top: 12px;
                        font-size: 14px;
                        font-weight: 400;
                        color: $inkColor2;
                    }
                    &:hover {
                        background-color: #fff;
                        box-shadow: 0 12px 26px rgba(35, 40, 56, 0.1);
                        transform: translateY(-4px);

                        h3 {
                            color: $brandColor;
                        }
                    }
                }
            }
        }
    }
    .category {
        margin-top: 20px;
        width: 100%;
        background-color: #fff;
        border-radius: 16px;
        box-shadow: $shadowSm;
        padding: 26px 28px 30px;

        .title {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: 24px;

            h3 {
                font-weight: 500;
                font-size: 20px;
                color: $inkColor;
            }
            p {
                margin-top: 8px;
                font-size: 13px;
                color: $inkColor3;
            }
            a {
                color: $inkColor3;
                position: absolute;
                top: 4px;
                right: 0px;
                font-size: 13px;

                .iconfont {
                    font-size: 12px;
                }
                &:hover {
                    color: $brandColor;
                }
            }
        }
        .goods {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 16px;

            li {
                :deep(a) {
                    display: block;
                    position: relative;
                    top: 0px;
                    padding: 16px 24px 22px;
                    text-align: center;
                    border-radius: 14px;
                    background-color: #fafbfc;
                    transition: all 0.3s ease;

                    &:hover {
                        top: -4px;
                        background-color: #fff;
                        box-shadow: 0 12px 26px rgba(35, 40, 56, 0.1);
                    }
                }
                :deep(a .info h4) {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                :deep(a .info p) {
                    color: $inkColor3;
                    font-size: 13px;
                }
            }
        }
    }
</style>
