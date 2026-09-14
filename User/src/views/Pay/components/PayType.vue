<template>
    <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
            <p>支付平台</p>
            <!-- 微信支付：演示环境仅做展示 -->
            <a class="btn wx noUse" href="javascript:;">微信支付</a>
            <!-- 支付宝：点击后走本地「假支付」，模拟支付回调成功 -->
            <a class="btn alipay" href="javascript:;" :class="{noUse:payInfo.countdown === -1}" @click="goPay">支付宝</a>
            <span class="tip">演示环境：点击「支付宝」直接模拟支付成功</span>
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
    import {useRoute, useRouter} from 'vue-router'
    import {ElMessage} from 'element-plus'
    import {mockPay} from '@/mock'
    const props = defineProps(['payInfo']);
    const route = useRoute();
    const router = useRouter();

    /**
     * 假支付：原项目跳转到黑马沙箱支付宝页面，
     * 这里改为直接调用 mock 层的支付接口，然后跳回本地的支付结果页
     */
    async function goPay() {
        if(props.payInfo?.countdown === -1) {
            ElMessage({message: '订单已超时，无法支付', type: 'warning'});
            return;
        }
        try {
            await mockPay(route.params.id as string);
            router.push({path: '/paycallback', query: {payResult: 'true', orderId: route.params.id}});
        } catch(error) {
            ElMessage({message: '支付失败，请稍后重试', type: 'error'});
        }
    }
</script>

<style scoped lang="scss">
    .pay-type {
        margin-top: 20px;
        background-color: #fff;
        border-radius: 16px;
        box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);
        padding-bottom: 70px;
        overflow: hidden;

        p {
            line-height: 70px;
            height: 70px;
            padding-left: 30px;
            font-size: 16px;

            &.head {
                border-bottom: 1px solid $lineColor;
            }
        }

        .btn {
            width: 150px;
            height: 50px;
            border: 1px solid #e4e4e4;
            text-align: center;
            line-height: 48px;
            margin-left: 30px;
            border-radius: 12px;
            color: $inkColor2;
            display: inline-block;

            &.active,
            &:hover {
                border-color: $brandColor;
            }

            &.alipay {
                border-color: #1677ff;
                color: #1677ff;
                font-weight: 500;
                cursor: pointer;

                &:hover {
                    background: #f0f7ff;
                    border-color: #1677ff;
                }
            }

            &.wx {
                border-color: #07c160;
                color: #07c160;
                font-weight: 500;
            }
            &.noUse {
                cursor: not-allowed;
                opacity: 0.6;
            }
        }
        .tip {
            margin-left: 14px;
            font-size: 14px;
            color: #999;
        }
        .pay-style {
            .btn {
                cursor: not-allowed;
            }
        }
    }
</style>
