<template>
    <!-- 配送时间 -->
    <h3 class="box-title">配送时间</h3>
    <div class="box-body">
        <a class="my-btn" href="javascript:;" @click="changeDeliveryTiem(1)" :class="{active:deliveryTime === 1}">不限送货时间：周一至周日</a>
        <a class="my-btn" href="javascript:;" @click="changeDeliveryTiem(2)" :class="{active:deliveryTime === 2}">工作日送货：周一至周五</a>
        <a class="my-btn" href="javascript:;" @click="changeDeliveryTiem(3)" :class="{active:deliveryTime === 3}">双休日、假日送货：周六至周日</a>
    </div>
    <!-- 支付方式 -->
    <h3 class="box-title">支付方式</h3>
    <div class="box-body">
        <a class="my-btn" href="javascript:;" @click="changePayment(1)" :class="{active:payment === 1}">在线支付</a>
        <a class="my-btn" href="javascript:;" @click="changePayment(2)" :class="{active:payment === 2}">货到付款</a>
        <span style="color:#999">货到付款需付5元手续费</span>
    </div>
    <!-- 金额明细 -->
    <h3 class="box-title">金额明细</h3>
    <div class="box-body">
        <div class="total">
        <dl>
            <dt>商品件数：</dt>
            <dd>{{ checkInfo?.summary?.goodsCount }}件</dd>
        </dl>
        <dl>
            <dt>商品总价：</dt>
            <dd>¥{{ checkInfo?.summary?.totalPrice.toFixed(2) }}</dd>
        </dl>
        <dl>
            <dt>运<i></i>费：</dt>
            <dd>¥{{ checkInfo?.summary?.postFee.toFixed(2) }}</dd>
        </dl>
        <dl>
            <dt>应付总额：</dt>
            <dd class="price">{{ checkInfo?.summary?.totalPayPrice.toFixed(2) }}</dd>
        </dl>
        </div>
    </div>
    <!-- 提交订单 -->
    <div class="submit">
        <el-button type="primary" size="large" @click="submitOrder">提交订单</el-button>
    </div>
</template>

<script setup lang="ts" name="CheckoutPaySettings">
    import {ref} from 'vue'
    import {submitOrderAPI} from '@/apis/pay.ts'
    import type {GoodsItem, OrderInfoItem} from '@/apis/pay.ts'
    import {useRouter} from 'vue-router'
    import {useCartStore} from '@/stores/cartStore.ts'
    const cartStore = useCartStore();
    const router = useRouter();
    const props = defineProps(['checkInfo', 'curAddress']);
    // 选择送货时间
    const deliveryTime = ref(1);
    function changeDeliveryTiem(value:number) {
        deliveryTime.value = value;
    }
    // 选择支付方式
    const payment = ref(1);
    function changePayment(value:number) {
        payment.value = value;
    }

    // 接收订单数据
    const order = ref<OrderInfoItem>({} as OrderInfoItem);
    // 提交订单
    const submitOrder = async () => {
        try {
            const result = await submitOrderAPI({
                deliveryTimeType: deliveryTime.value,
                payType: payment.value,
                payChannel: 1,
                buyerMessage: '',
                goods: (props.checkInfo?.goods || []).map((item:GoodsItem) => {
                    return {
                        skuId: item.skuId,
                        count: item.count
                    };
                }),
                addressId: props.curAddress?.id
            }) as any;
            order.value = result.result;
            router.push(`/pay/${order.value?.id}`);
            await cartStore.getCartList();
        } catch(error) {
            console.dir(error);
        }
        
    }
</script>

<style scoped lang="scss">
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }

    .my-btn {
        width: 228px;
        height: 50px;
        border: 1px solid #e4e4e4;
        text-align: center;
        line-height: 48px;
        margin-right: 25px;
        color: #666666;
        display: inline-block;

        &.active,
        &:hover {
            border-color: $xtxColor;
        }
    }

    .total {
    dl {
        display: flex;
        justify-content: flex-end;
        line-height: 50px;

        dt {
            i {
                display: inline-block;
                width: 2em;
            }
        }

        dd {
            width: 240px;
            text-align: right;
            padding-right: 70px;

            &.price {
                font-size: 20px;
                color: $priceColor;
            }
        }
    }
    }

    .submit {
        text-align: right;
        padding: 60px;
        border-top: 1px solid #f5f5f5;
    }
</style>