<template>
    <el-popover
        placement="bottom-end"
        :width="440"
        trigger="hover"
        :popper-style="{ padding: '10px 0px 0px', '--el-popover-padding': '0'}"
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
        </div>
        <div class="totalPrice">
            <div class="left">
                <p class="sum">共 {{ cartStore.cartCount }} 件商品</p>
                <p class="price">￥{{ (cartStore.cartTotalPrice).toFixed(2) }}</p>
            </div>
            <div class="right">
                <RouterLink to="/cart">去购物车结算</RouterLink>
            </div>
        </div>
    </div>
        <template #reference>
            <div class="cart" @click="$router.push('/cart')">
                <i class="iconfont icon-3"></i>
                <p>{{ cartStore.cartCount }}</p>
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
    .cart {
        position: relative;
        margin-left: 15px;
        cursor: pointer;
    }
    .cart .iconfont {
        margin-top: 2px;
        font-size: 26px;
    }
    .cart p {
        display: block;
        padding: 1px 5px;
        border-radius: 50%;
        background-color: red;
        position: absolute;
        top: -5px;
        left: 14px;
        color: #fff;
    }
    .content {
        width: 100%;
        height: 390px;
        .cartContent {
            width: 100%;
            height: 310px;
            overflow: auto;
            padding-left: 10px;
            padding-right: 10px;
            .cartGoods {
                width: 100%;
                height: 100px;
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                cursor: pointer;
                border-bottom: 1px solid #eee;
                &:first-child {
                    border-top: 1px solid #eee;
                }
                .left {
                    width: 80px;
                    height: 80px;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .center {
                    width: 180px;
                    h4 {
                        font-size: 16px;
                        font-weight: 400;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        line-clamp: 2;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    p {
                        font-size: 14px;
                        color: #999;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        line-clamp: 2;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                }
                .right {
                    width: 80px;
                    text-align: center;
                    .price {
                        margin-bottom: 10px;
                        font-size: 16px;
                        color: $priceColor;
                    }
                    .count {
                        font-size: 16px;
                        color: #999;
                    }
                }
                .delete {
                    width: 16px;
                    height: 16px;
                    margin-right: 10px;
                    i {
                        display: none;
                        width: 16px;
                        height: 16px;
                        line-height: 16px;
                        font-size: 16px;
                        color: #999;
                        &:hover {
                            background: #f8f8f8;
                        }
                    }
                }
                &:hover {
                    .delete i {
                        display: block;
                    }
                }
            }
        }
        .totalPrice {
            width: 100%;
            height: 80px;
            display: flex;
            align-items: center;
            background-color: #f8f8f8;
            border-radius: 10px;
            .left {
                flex: 3;
                padding-left: 20px;
                .sum {
                    font-size: 16px;
                    color: #999;
                    padding-left: 3px;
                }
                .price {
                    margin-top: 2px;
                    font-size: 18px;
                    color: $priceColor;
                }
            }
            .right {
                flex: 1;
                a {
                    display: block;
                    width: 180px;
                    height: 50px;
                    border: 1px solid $xtxColor;
                    margin-right: 10px;
                    text-align: center;
                    line-height: 50px;
                    font-size: 18px;
                    color: $xtxColor;
                    background: #e6faf6;
                    border-radius: 10px;
                }
            }
        }
    }
</style>