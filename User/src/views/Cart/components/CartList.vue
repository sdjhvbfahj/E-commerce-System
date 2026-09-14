<template>
    <div class='cartList'>
        <!-- 购物车列表 -->
        <table class="cartListInfo">
            <thead>
                <tr>
                    <th>
                        <el-checkbox class="cart-chenckbox" :modelValue="cartStore.allSelected" @change="(selected:boolean) => allSelectedChangge(selected)"/>全选
                    </th>
                    <th>商品信息</th>
                    <th>单价</th>
                    <th>数量</th>
                    <th>小计</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in cartStore.cartList" :key="item.id">
                    <td>
                        <!-- 使用:modelValue和@change替代v-model语法糖, 方便后续调用接口 -->
                        <el-checkbox class="cart-chenckbox" :modelValue="item.selected" @change="(selected:boolean) => singleChange(item, selected)"/>
                    </td>
                    <td>
                        <img v-img-lazy="item.picture">
                        <div class="goodsInfo">
                            <h4>{{ item.name }}</h4>
                        </div>
                    </td>
                    <td>￥{{ item.price }}</td>
                    <td>
                        <el-input-number :modelValue="item.count" @change="countChange(item.skuId, item.selected, $event)" :min="1"/>
                    </td>
                    <td>￥{{ (Number(item.price) * item.count).toFixed(2) }}</td>
                    <!-- 功能按钮 -->
                    <td>
                        <a href="javascript:;" @click="cartStore.deleteCart(item.skuId)">删除</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 渲染总信息 -->
        <div class="settlement">
            <div class="left">
                <span>共 {{ cartStore.cartCount }} 件商品，已选择 {{ cartStore.selectedCount }} 件，商品合计：<i>￥{{ (cartStore.selectedPrice).toFixed(2) }}</i></span>
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
    .cartListInfo {
        width: 100%;
        margin-top: 10px;
        background-color: #fff;
        thead {
            height: 70px;
            color: #666;
            // border-bottom: 1px solid #f5f5f5;
            tr {
                th {
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 70px;
                    .el-checkbox {
                        height: 20px;
                        margin-right: 4px;
                        margin-bottom: 3px;
                        vertical-align: middle;
                    }
                    &:first-child {
                        color: #999;
                        width: 120px;
                        text-align: start;
                        padding-left: 40px;
                    }
                    &:nth-child(2) {
                        width: 400px;
                    }
                    &:nth-child(3) {
                        width: 220px;
                    }
                    &:nth-child(4) {
                        width: 180px;
                    }
                    &:nth-child(5) {
                        width: 180px;
                    }
                    &:last-child {
                        width: 140px;
                    }
                }
            }
        }
        tbody {
            height: 120px;
            color: #666;
            tr {
                td {
                    font-size: 16px;
                    font-weight: 400;
                    text-align: center;
                    line-height: 100px;
                    &:first-child {
                        color: #999;
                        text-align: start;
                        padding-left: 40px;
                    }
                    &:nth-child(2) {
                        display: flex;
                        width: 100%;
                        height: 100%;
                        padding: 10px;
                        img {
                            width: 100px;
                            height: 100px;
                            margin-right: 10px;
                        }
                        .goodsInfo {
                            h4 {
                                text-align: start;
                                width: 260px;
                                font-weight: 400;
                                font-size: 16px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }
                    }
                    &:nth-child(3) {
                        font-size: 14px;
                    }
                    &:last-child {
                        a {
                            font-size: 14px;
                            color: $xtxColor;
                        }
                    }
                }
            }
        }
    }
    .settlement {
        margin-top: 20px;
        background-color: #fff;
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-between;
        .left {
            padding-left: 40px;
            font-size: 16px;
            flex: 1;
            display: flex;
            align-items: center;
            i {
                color: $priceColor;
                font-weight: 700;
            }
        }
        .right {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-right: 30px;
            button {
                width: 180px;
                height: 50px;
                background-color: $xtxColor;
                outline: none;
                border: 0px solid #000;
                color: #fff;
                font-size: 16px;
                border-radius: 6px;
                cursor: pointer;
            }
        }
    }
    .cart-chenckbox :deep(.el-checkbox__inner) {
        width: 16px;
        height: 16px;
        border-width: 1px;
        border-color: #999;
    }
</style>