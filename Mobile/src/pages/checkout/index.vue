<template>
    <view class="checkout m-page m-page--with-bar">
        <!-- 收货地址 -->
        <view class="m-block address" hover-class="address--press" @click="chooseAddress">
            <template v-if="address">
                <view class="address__head">
                    <text class="address__name">{{ address.receiver }}</text>
                    <text class="address__mobile">{{ address.contact }}</text>
                    <text v-if="address.isDefault === 0" class="m-tag">默认</text>
                </view>
                <text class="address__detail">{{ address.fullLocation }} {{ address.address }}</text>
            </template>
            <template v-else>
                <view class="address__empty">
                    <image class="address__pin" src="/static/icons/location.png" mode="aspectFit" />
                    <view>
                        <text class="address__name">还没有收货地址</text>
                        <text class="address__detail">点击添加一个，方便配送</text>
                    </view>
                </view>
            </template>
            <view class="chevron"></view>
        </view>

        <!-- 商品清单 -->
        <view class="m-block goods">
            <text class="goods__title">商品清单</text>
            <view v-for="item in goodsList" :key="item.id" class="goods__row">
                <image class="goods__pic" :src="item.picture" mode="aspectFill" />
                <view class="goods__body">
                    <text class="goods__name m-ellipsis-2">{{ item.name }}</text>
                    <text class="goods__attrs m-ellipsis">{{ item.attrsText }}</text>
                    <view class="goods__foot">
                        <text class="goods__price">¥{{ item.price }}</text>
                        <text class="goods__count">x{{ item.count }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 配送与支付 -->
        <view class="m-block settings">
            <view class="settings__row">
                <text class="settings__label">配送时间</text>
                <view class="settings__options">
                    <view
                        v-for="item in DELIVERY_TYPES"
                        :key="item.value"
                        class="chip"
                        :class="{ 'chip--active': deliveryTimeType === item.value }"
                        @click="deliveryTimeType = item.value"
                    >
                        <text>{{ item.label }}</text>
                    </view>
                </view>
            </view>
            <view class="settings__row">
                <text class="settings__label">支付方式</text>
                <view class="settings__options">
                    <view
                        v-for="item in PAY_TYPES"
                        :key="item.value"
                        class="chip"
                        :class="{ 'chip--active': payType === item.value }"
                        @click="payType = item.value"
                    >
                        <text>{{ item.label }}</text>
                    </view>
                </view>
            </view>
            <view class="settings__row settings__row--input">
                <text class="settings__label">买家留言</text>
                <input class="settings__input" v-model="buyerMessage" type="text" placeholder="选填，可填写备注信息" placeholder-class="ph" />
            </view>
        </view>

        <!-- 金额明细 -->
        <view class="m-block summary">
            <view class="summary__row">
                <text>商品金额</text>
                <text>¥{{ money(summary.totalPrice) }}</text>
            </view>
            <view class="summary__row">
                <text>运费</text>
                <text>{{ summary.postFee ? `¥${money(summary.postFee)}` : '免运费' }}</text>
            </view>
            <view class="summary__row summary__row--total">
                <text>应付金额</text>
                <text class="summary__pay">¥{{ money(summary.totalPayPrice) }}</text>
            </view>
        </view>

        <view class="note">演示环境：提交后会自动模拟一次支付成功</view>

        <!-- 提交条 -->
        <view class="m-action-bar submit">
            <view class="submit__sum">
                <text class="submit__label">应付</text>
                <text class="submit__price">¥{{ money(summary.totalPayPrice) }}</text>
            </view>
            <view class="m-btn submit__btn" :class="{ 'm-btn--disabled': submitting || !goodsList.length }" hover-class="m-btn--press" @click="submit">
                <text>{{ submitting ? '提交中…' : '提交订单' }}</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { onLoad, onUnload } from '@dcloudio/uni-app'
    import { getOrderInfoAPI } from '@/apis/checkout.ts'
    import { mockPay } from '@/mock'
    import { submitOrderAPI } from '@/apis/pay.ts'
    import { money } from '@/utils/format.ts'
    import { toast } from '@/utils/auth.ts'

    const DELIVERY_TYPES = [
        { label: '不限时间', value: 1 },
        { label: '工作日', value: 2 },
        { label: '周末', value: 3 },
    ]
    const PAY_TYPES = [
        { label: '微信支付', value: 1 },
        { label: '支付宝', value: 2 },
    ]

    const address = ref<any>(null)
    const goodsList = ref<any[]>([])
    const summary = ref({ goodsCount: 0, totalPrice: 0, postFee: 0, totalPayPrice: 0 })
    const deliveryTimeType = ref(1)
    const payType = ref(1)
    const buyerMessage = ref('')
    const submitting = ref(false)

    const canSubmit = computed(() => Boolean(address.value) && goodsList.value.length > 0)

    async function loadOrderInfo() {
        const result = (await getOrderInfoAPI()) as any
        const data = result.result
        goodsList.value = data?.goods ?? []
        summary.value = data?.summary ?? summary.value
        const list: any[] = data?.userAddresses ?? []
        // 没选过地址时默认取「默认地址」，其次取第一条
        const keep = address.value?.id
        address.value = list.find((item) => item.id === keep) ?? list.find((item) => item.isDefault === 0) ?? list[0] ?? null
    }

    function chooseAddress() {
        uni.navigateTo({ url: '/pages/address/list?select=1' })
    }

    async function submit() {
        if (!goodsList.value.length) {
            toast('没有可结算的商品')
            return
        }
        if (!address.value) {
            toast('请先添加收货地址')
            return
        }
        if (submitting.value) return
        submitting.value = true
        try {
            const created = (await submitOrderAPI({
                deliveryTimeType: deliveryTimeType.value,
                payType: payType.value,
                payChannel: payType.value,
                buyerMessage: buyerMessage.value,
                goods: goodsList.value.map((item) => ({ skuId: item.skuId, count: item.count })),
                addressId: address.value.id,
            })) as any
            const order = created.result
            // 演示环境：直接模拟支付成功，再进结果页
            await mockPay(order.id)
            uni.redirectTo({ url: `/pages/pay/result?id=${order.id}&money=${money(summary.value.totalPayPrice)}` })
        } finally {
            submitting.value = false
        }
    }

    onLoad(() => {
        loadOrderInfo()
        // 地址列表页选好后回传
        uni.$on('address-selected', (item: any) => {
            address.value = item
        })
    })

    onUnload(() => {
        uni.$off('address-selected')
    })
</script>

<style scoped lang="scss">
    /* ---------- 地址 ---------- */
    .address {
        position: relative;
        padding: $gapMd;
        padding-right: 60rpx;
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        &--press {
            background: #fafbfc;
        }
    }

    .address__head {
        display: flex;
        align-items: center;
        gap: $gapSm;
    }

    .address__name {
        font-size: $fsMd;
        font-weight: 600;
        color: $inkColor;
    }

    .address__mobile {
        color: $inkColor2;
        font-size: $fsSm;
    }

    .address__detail {
        color: $inkColor2;
        font-size: $fsSm;
        line-height: 1.45;
    }

    .address__empty {
        display: flex;
        align-items: center;
        gap: $gapMd;
    }

    .address__pin {
        width: 56rpx;
        height: 56rpx;
    }

    .chevron {
        position: absolute;
        right: $gapMd;
        top: 50%;
        width: 16rpx;
        height: 16rpx;
        margin-top: -8rpx;
        border-top: 3rpx solid $inkColor3;
        border-left: 3rpx solid $inkColor3;
        transform: rotate(135deg);
    }

    /* ---------- 商品 ---------- */
    .goods {
        padding: $gapMd;
    }

    .goods__title {
        display: block;
        margin-bottom: $gapMd;
        font-size: $fsMd;
        font-weight: 600;
    }

    .goods__row {
        display: flex;
        gap: $gapMd;
        padding-bottom: $gapMd;
        margin-bottom: $gapMd;
        border-bottom: 1px solid $lineColor;

        &:last-child {
            padding-bottom: 0;
            margin-bottom: 0;
            border-bottom: none;
        }
    }

    .goods__pic {
        width: 160rpx;
        height: 160rpx;
        border-radius: $radiusSm;
        background: #f4f5f8;
        flex-shrink: 0;
    }

    .goods__body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6rpx;
    }

    .goods__name {
        font-size: $fsBase;
        line-height: 1.4;
    }

    .goods__attrs {
        font-size: $fsXs;
        color: $inkColor3;
    }

    .goods__foot {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .goods__price {
        color: $priceColor;
        font-weight: 600;
    }

    .goods__count {
        color: $inkColor3;
        font-size: $fsSm;
    }

    /* ---------- 配送 / 支付 ---------- */
    .settings {
        padding: $gapMd;
    }

    .settings__row {
        display: flex;
        align-items: center;
        gap: $gapMd;
        padding: $gapSm 0;

        &--input {
            border-top: 1px solid $lineColor;
            padding-top: $gapMd;
        }
    }

    .settings__label {
        width: 140rpx;
        flex-shrink: 0;
        color: $inkColor3;
        font-size: $fsSm;
    }

    .settings__options {
        flex: 1;
        display: flex;
        gap: $gapSm;
        flex-wrap: wrap;
    }

    .settings__input {
        flex: 1;
        font-size: $fsSm;
        color: $inkColor;
    }

    .ph {
        color: $inkColor3;
    }

    .chip {
        padding: 0 $gapMd;
        height: 56rpx;
        display: flex;
        align-items: center;
        border-radius: 28rpx;
        background: #f4f5f8;
        color: $inkColor2;
        font-size: $fsSm;
        border: 2rpx solid transparent;

        &--active {
            color: $brandColor;
            background: $brandColorSoft;
            border-color: $brandColor;
        }
    }

    /* ---------- 金额 ---------- */
    .summary {
        padding: $gapMd;
    }

    .summary__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $gapSm 0;
        font-size: $fsSm;
        color: $inkColor2;

        &--total {
            border-top: 1px solid $lineColor;
            margin-top: $gapSm;
            padding-top: $gapMd;
            color: $inkColor;
            font-size: $fsBase;
        }
    }

    .summary__pay {
        color: $priceColor;
        font-size: $fsLg;
        font-weight: 600;
    }

    .note {
        padding: $gapMd $pagePadding 0;
        color: $inkColor3;
        font-size: $fsXs;
    }

    /* ---------- 提交条 ---------- */
    .submit {
        justify-content: space-between;
    }

    .submit__sum {
        display: flex;
        align-items: baseline;
        gap: 8rpx;
    }

    .submit__label {
        font-size: $fsSm;
        color: $inkColor3;
    }

    .submit__price {
        color: $priceColor;
        font-size: $fsLg;
        font-weight: 600;
    }

    .submit__btn {
        width: 280rpx;
        flex-shrink: 0;
    }
</style>
