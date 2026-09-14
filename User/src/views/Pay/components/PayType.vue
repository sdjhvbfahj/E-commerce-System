<template>
    <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
            <p>支付平台</p>
            <a class="btn wx noUse" href="javascript:;"></a>
            <!-- 订单超时--不能支付(href地址变成javascript:;  鼠标样式改变) -->
            <a class="btn alipay" :href="payInfo.countdown === -1 ? 'javascript:;' : payUrl" :class="{noUse:payInfo.countdown === -1}"></a>
        </div>
        <div class="item pay-style">
            <p>支付方式</p>
            <a class="btn" href="javascript:;">招商银行</a>
            <a class="btn" href="javascript:;">工商银行</a>
            <a class="btn" href="javascript:;">建设银行</a>
            <a class="btn" href="javascript:;">农业银行</a>
            <a class="btn" href="javascript:;">交通银行</a>
        </div>
    </div>
</template>

<script setup lang="ts" name="PayType">
    import {useRoute} from 'vue-router'
    const props = defineProps(['payInfo']);
    const route = useRoute();
    // 支付地址
    /* 
        账号: scobys4865@sandbox.com
        密码: 111111
    */
    const baseURL = 'https://apipc-xiaotuxian-front.itheima.net/'
    const backURL = 'http://localhost:5173/paycallback'
    const redirectUrl = encodeURIComponent(backURL)
    const payUrl = `${baseURL}pay/aliPay?orderId=${route.params.id}&redirect=${redirectUrl}`
</script>

<style scoped lang="scss">
    .pay-type {
        margin-top: 20px;
        background-color: #fff;
        padding-bottom: 70px;

        p {
            line-height: 70px;
            height: 70px;
            padding-left: 30px;
            font-size: 16px;

            &.head {
                border-bottom: 1px solid #f5f5f5;
            }
        }

        .btn {
            width: 150px;
            height: 50px;
            border: 1px solid #e4e4e4;
            text-align: center;
            line-height: 48px;
            margin-left: 30px;
            color: #666666;
            display: inline-block;

            &.active,
            &:hover {
                border-color: $xtxColor;
            }

            &.alipay {
                background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png) no-repeat center / contain;
            }

            &.wx {
                background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg) no-repeat center / contain;
            }
            &.noUse {
                cursor: not-allowed;
            }
        }
        .pay-style {
            .btn {
                cursor: not-allowed;
            }
        }
    }
</style>