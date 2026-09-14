<template>
    <div class='cartList'>
        <!-- 表头 -->
        <div class="cart-head">
            <div class="col check">
                <el-checkbox class="cart-chenckbox" :modelValue="cartStore.allSelected" @change="(selected:boolean) => allSelectedChangge(selected)"/>全选
            </div>
            <div class="col goods">商品信息</div>
            <div class="col price">单价</div>
            <div class="col count">数量</div>
            <div class="col subtotal">小计</div>
            <div class="col action">操作</div>
        </div>

        <!-- 商品列表 -->
        <ul class="cart-body">
            <li v-for="item in cartStore.cartList" :key="item.id">
                <div class="col check">
                    <!-- 使用:modelValue和@change替代v-model语法糖, 方便后续调用接口 -->
                    <el-checkbox class="cart-chenckbox" :modelValue="item.selected" @change="(selected:boolean) => singleChange(item, selected)"/>
                </div>
                <div class="col goods">
                    <div class="thumb">
                        <img v-img-lazy="item.picture">
                    </div>
                    <div class="goodsInfo">
                        <h4 class="ellipsis-2">{{ item.name }}</h4>
                        <p class="attr ellipsis">{{ item.attrsText }}</p>
                    </div>
                </div>
                <div class="col price">￥{{ item.price }}</div>
                <div class="col count">
                    <el-input-number :modelValue="item.count" @change="countChange(item.skuId, item.selected, $event)" :min="1"/>
                </div>
                <div class="col subtotal">￥{{ (Number(item.price) * item.count).toFixed(2) }}</div>
                <!-- 功能按钮 -->
                <div class="col action">
                    <a href="javascript:;" @click="cartStore.deleteCart(item.skuId)">
                        <i class="iconfont icon-shanchu"></i>删除
                    </a>
                </div>
            </li>
        </ul>

        <el-empty v-if="!cartStore.cartList?.length" description="购物车还是空的，去挑几件好物吧">
            <el-button type="primary" @click="$router.push('/')">去逛逛</el-button>
        </el-empty>

        <!-- 渲染总信息 -->
        <div class="settlement">
            <div class="left">
                <span>共 <b>{{ cartStore.cartCount }}</b> 件商品，已选择 <b>{{ cartStore.selectedCount }}</b> 件，商品合计：<i>￥{{ (cartStore.selectedPrice).toFixed(2) }}</i></span>
            </div>
            <div class="right">
                <button @click="$router.push('/checkout')">下单结算</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="CartList">
    import {useCartStore, type CartItem} from '@/stores/cartStore.ts'
    const cartStore = useCartStore();
    // 单选框改变事件
    function singleChange(item:CartItem, selected:boolean) {
        // 调用函数, 修改商品selected值
        cartStore.cartSelectedChange(item, selected);
    }
    // 全选框改变
    function allSelectedChangge(selected:boolean) {
        // 调用cart的pinia中的改变全选决定单选函数
        cartStore.cartAllSelectedChange(selected);
    }
    // 改变count值
    function countChange(skuId:string, selected:boolean, countValue:number) {
        cartStore.cartCountChange(skuId, selected, countValue);
    }
</script>

<style scoped lang="scss">
    // 列表用 grid 排，六个栏位宽度统一，表头和行对齐
    @mixin cart-grid {
        display: grid;
        grid-template-columns: 108px minmax(0, 1fr) 150px 170px 150px 110px;
        align-items: center;
    }

    .cartList {
        margin-top: 4px;
        background-color: #fff;
        border-radius: 16px;
        box-shadow: $shadowSm;
        overflow: hidden;
    }
    .cart-head {
        @include cart-grid;
        height: 60px;
        padding: 0 24px;
        background: #f7f8fa;
        font-size: 14px;
        color: $inkColor2;
        border-bottom: 1px solid $lineColor;

        .check {
            display: flex;
            align-items: center;
            color: $inkColor3;
        }
    }
    .cart-body {
        padding: 0 24px;

        li {
            @include cart-grid;
            padding: 20px 0;
            border-bottom: 1px dashed $lineColor;
            transition: background 0.25s;

            &:last-child {
                border-bottom: none;
            }
            &:hover {
                background: #fcfcfd;
            }
        }
        .check {
            display: flex;
            align-items: center;
        }
        .goods {
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 0;

            .thumb {
                width: 84px;
                height: 84px;
                flex-shrink: 0;
                border-radius: 12px;
                overflow: hidden;
                background: #f5f6f8;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            .goodsInfo {
                min-width: 0;
                flex: 1;

                h4 {
                    font-size: 15px;
                    font-weight: 400;
                    color: $inkColor;
                    line-height: 22px;
                }
                .attr {
                    margin-top: 6px;
                    font-size: 12px;
                    color: $inkColor3;
                }
            }
        }
        .price {
            font-size: 14px;
            color: $inkColor2;
        }
        .subtotal {
            font-size: 16px;
            font-weight: 500;
            color: $priceColor;
        }
        .action a {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            color: $inkColor3;

            .iconfont {
                font-size: 13px;
            }
            &:hover {
                color: $helpColor;
            }
        }
    }
    /* 结算栏 */
    .settlement {
        position: sticky;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px 0 40px;
        height: 88px;
        background: #fff;
        border-top: 1px solid $lineColor;
        box-shadow: 0 -6px 18px rgba(35, 40, 56, 0.05);

        .left {
            font-size: 14px;
            color: $inkColor2;

            b {
                font-weight: 500;
                color: $brandColor;
                padding: 0 2px;
            }
            i {
                color: $priceColor;
                font-style: normal;
                font-weight: 600;
                font-size: 22px;
            }
        }
        .right button {
            width: 180px;
            height: 50px;
            border: none;
            cursor: pointer;
            color: #fff;
            font-size: 16px;
            border-radius: 25px;
            background: $brandGradient;
            box-shadow: $shadowBrand;
            transition: all 0.25s;

            &:hover {
                filter: brightness(1.05);
                transform: translateY(-1px);
            }
        }
    }
    .cart-chenckbox :deep(.el-checkbox__inner) {
        width: 16px;
        height: 16px;
        border-width: 1px;
        border-color: #c8ccd4;
        border-radius: 5px;
    }
</style>
