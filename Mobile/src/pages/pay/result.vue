<template>
    <view class="result m-page">
        <view class="result__card m-card">
            <image class="result__icon" :src="success ? '/static/icons/pay-success.png' : '/static/icons/pay-fail.png'" mode="aspectFit" />
            <text class="result__title">{{ success ? '支付成功' : '支付未完成' }}</text>
            <text class="result__amount">¥{{ moneyText }}</text>
            <view class="result__info">
                <view class="result__row">
                    <text>订单号</text>
                    <text>{{ orderId }}</text>
                </view>
                <view class="result__row">
                    <text>支付方式</text>
                    <text>微信支付（演示）</text>
                </view>
            </view>
            <view class="result__actions">
                <view class="m-btn m-btn--plain" hover-class="m-btn--press" @click="goOrder">查看订单</view>
                <view class="m-btn" hover-class="m-btn--press" @click="goHome">继续逛逛</view>
            </view>
        </view>
        <text class="result__note">演示环境：支付结果由本地假接口返回，未接入真实支付渠道。</text>
    </view>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { onLoad } from '@dcloudio/uni-app'
    import { money } from '@/utils/format.ts'

    const orderId = ref('')
    const moneyText = ref('0.00')
    const success = ref(true)

    function goOrder() {
        uni.redirectTo({ url: `/pages/order/list?state=2` })
    }

    function goHome() {
        uni.switchTab({ url: '/pages/home/index' })
    }

    onLoad((query) => {
        orderId.value = String(query?.id ?? '')
        moneyText.value = money(query?.money)
        success.value = String(query?.status ?? 'success') !== 'fail'
    })
</script>

<style scoped lang="scss">
    .result {
        padding: $gapLg $pagePadding;
    }

    .result__card {
        padding: $gapLg $gapMd $gapLg;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .result__icon {
        width: 128rpx;
        height: 128rpx;
    }

    .result__title {
        margin-top: $gapMd;
        font-size: $fsXl;
        font-weight: 600;
        color: $inkColor;
    }

    .result__amount {
        margin-top: $gapSm;
        font-size: 48rpx;
        font-weight: 600;
        color: $priceColor;
    }

    .result__info {
        width: 100%;
        margin-top: $gapLg;
        padding-top: $gapMd;
        border-top: 1px solid $lineColor;
    }

    .result__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $gapSm 0;
        font-size: $fsSm;
        color: $inkColor3;

        text:last-child {
            color: $inkColor2;
        }
    }

    .result__actions {
        width: 100%;
        margin-top: $gapLg;
        display: flex;
        gap: $gapMd;

        .m-btn {
            flex: 1;
        }
    }

    .result__note {
        display: block;
        margin-top: $gapLg;
        text-align: center;
        color: $inkColor3;
        font-size: $fsXs;
    }
</style>
