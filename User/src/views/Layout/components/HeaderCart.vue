<template>
    <el-popover
        placement="bottom-end"
        :width="420"
        trigger="hover"
        :popper-style="{ padding: '0', '--el-popover-padding': '0', borderRadius: '14px' }"
    >
        <div class="content">
            <div class="cartContent">
                <div class="cartGoods" v-for="item in cartStore.cartList" :key="item.id">
                    <div class="left">
                        <img v-img-lazy="item.picture">
                    </div>
                    <div class="center">
                        <h4>{{item.name}}</h4>
                        <p>{{item.attrsText}}</p>
                    </div>
                    <div class="right">
                        <p class="price">￥{{ item.price }}</p>
                        <p class="count">x{{ item.count }}</p>
                    </div>
                    <div class="delete">
                        <i class="iconfont icon-close" @click="cartStore.deleteCart(item.skuId)"></i>
                    </div>
                </div>
                <!-- 空购物车 -->
                <div class="empty" v-if="!cartStore.cartList?.length">
                    <i class="iconfont icon-3"></i>
                    <p>购物车还是空的，去挑几件好物吧</p>
                    <RouterLink to="/">去逛逛</RouterLink>
                </div>
            </div>
            <div class="totalPrice">
                <div class="left">
                    <p class="sum">共 {{ cartStore.cartCount }} 件商品</p>
                    <p class="price">￥{{ (cartStore.cartTotalPrice).toFixed(2) }}</p>
                </div>
                <div class="right">
                    <RouterLink to="/cart">去结算</RouterLink>
                </div>
            </div>
        </div>
        <template #reference>
            <div class="cart" @click="$router.push('/cart')">
                <i class="iconfont icon-3"></i>
                <span class="txt">购物车</span>
                <span class="badge">{{ cartStore.cartCount }}</span>
            </div>
        </template>
    </el-popover>
</template>

<script setup lang="ts" name="HeaderCart">
    import {useCartStore} from '@/stores/cartStore.ts'
    const cartStore = useCartStore();
    cartStore.getCartList();
</script>

<style scoped lang="scss">
    /* 触发按钮：胶囊样式 */
    .cart {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        height: 46px;
        padding: 0 18px;
        border-radius: 23px;
        cursor: pointer;
        background: $brandColorSoft;
        color: $brandColor;
        transition: all 0.25s;

        .iconfont {
            font-size: 20px;
        }
        .txt {
            font-size: 15px;
        }
        .badge {
            min-width: 20px;
            height: 20px;
            padding: 0 6px;
            border-radius: 10px;
            background: $brandColor;
            color: #fff;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
        }
        &:hover {
            background: $brandColor;
            color: #fff;

            .badge {
                background: #fff;
                color: $brandColor;
            }
        }
    }
    /* 弹出层内容 */
    .content {
        width: 100%;
        border-radius: 14px;
        overflow: hidden;
        background: #fff;

        .cartContent {
            width: 100%;
            max-height: 312px;
            overflow: auto;
            padding: 6px 14px;

            .cartGoods {
                position: relative;
                width: 100%;
                padding: 12px 0;
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                border-bottom: 1px dashed $lineColor;

                &:last-child {
                    border-bottom: none;
                }
                .left {
                    width: 64px;
                    height: 64px;
                    flex-shrink: 0;
                    border-radius: 10px;
                    overflow: hidden;
                    background: #f5f6f8;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
                .center {
                    flex: 1;
                    min-width: 0;

                    h4 {
                        font-size: 14px;
                        font-weight: 400;
                        color: $inkColor;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        line-clamp: 2;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    p {
                        margin-top: 4px;
                        font-size: 12px;
                        color: $inkColor3;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .right {
                    width: 76px;
                    text-align: right;

                    .price {
                        font-size: 15px;
                        color: $priceColor;
                    }
                    .count {
                        margin-top: 4px;
                        font-size: 13px;
                        color: $inkColor3;
                    }
                }
                .delete {
                    width: 16px;
                    height: 16px;

                    i {
                        display: none;
                        width: 16px;
                        height: 16px;
                        line-height: 16px;
                        font-size: 16px;
                        color: $inkColor3;

                        &:hover {
                            color: $helpColor;
                        }
                    }
                }
                &:hover .delete i {
                    display: block;
                }
            }
            .empty {
                padding: 34px 0 26px;
                text-align: center;

                .iconfont {
                    font-size: 34px;
                    color: #dfe2e9;
                }
                p {
                    margin: 12px 0 14px;
                    font-size: 13px;
                    color: $inkColor3;
                }
                a {
                    display: inline-block;
                    padding: 7px 22px;
                    border-radius: 16px;
                    font-size: 13px;
                    color: #fff;
                    background: $brandGradient;
                }
            }
        }
        .totalPrice {
            width: 100%;
            height: 72px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 18px;
            background: #fafbfc;
            border-top: 1px solid $lineColor;

            .left {
                .sum {
                    font-size: 13px;
                    color: $inkColor3;
                }
                .price {
                    margin-top: 4px;
                    font-size: 18px;
                    color: $priceColor;
                }
            }
            .right {
                a {
                    display: block;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 22px;
                    border-radius: 20px;
                    font-size: 14px;
                    color: #fff;
                    background: $brandGradient;
                    box-shadow: $shadowBrand;
                }
            }
        }
    }
</style>
