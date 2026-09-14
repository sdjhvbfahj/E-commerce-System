<template>
    <div class="pay-info" v-if="payInfo?.countdown === -1">
        <span class="icon iconfont icon-shanchu red"></span>
        <div class="tip">
            <p>订单已超时取消</p>
            <!-- <p>支付还剩 <span>{{ usecountDown.formatTime }}</span>, 超时后将取消订单</p> -->
        </div>
        <div class="amount">
            <span>应付总额：</span>
            <span>¥{{ (payInfo?.payMoney || 0).toFixed(2) }}</span>
        </div>
    </div>
    <div class="pay-info" v-else>
        <span class="icon iconfont icon-queren- green"></span>
        <div class="tip">
            <p>订单提交成功！请尽快完成支付。</p>
            <p>支付还剩 <span>{{ useCountdown.formatTime }}</span>, 超时后将取消订单</p>
        </div>
        <div class="amount">
            <span>应付总额：</span>
            <span>¥{{ (payInfo?.payMoney || 0).toFixed(2) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts" name="PayInfo">
    import {useRoute} from 'vue-router'
    import {onMounted} from 'vue'
    import {countdown} from '@/composables/countdown.ts'

    const props = defineProps(['payInfo', 'getOrderInfo']);
    const useCountdown = countdown();
    const route = useRoute();
    
    onMounted(async () => {
        await props.getOrderInfo(route.params.id as string);
        // 支付倒计时
        await useCountdown.startCountdown(props.payInfo?.countdown);
    });
</script>

<style scoped lang="scss">
    .pay-info {
        background: #fff;
        display: flex;
        align-items: center;
        height: 240px;
        padding: 0 80px;

        .green {
            font-size: 80px;
            color: #1dc779;
        }
        .red {
            font-size: 80px;
            color: $priceColor;
        }

        .tip {
            padding-left: 10px;
            flex: 1;

            p {
                &:first-child {
                    font-size: 20px;
                    margin-bottom: 5px;
                }

                &:last-child {
                    color: #999;
                    font-size: 16px;
                }
            }
        }

        .amount {
            span {
                &:first-child {
                    font-size: 16px;
                    color: #999;
                }

                &:last-child {
                    color: $priceColor;
                    font-size: 20px;
                }
            }
        }
    }
</style>