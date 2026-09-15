<template>
    <view class="detail m-page m-page--with-bar">
        <!-- 状态头 -->
        <view class="head">
            <text class="head__state">{{ meta.label }}</text>
            <text class="head__tip">{{ meta.tip }}</text>
            <view v-if="order?.orderState === 1" class="head__countdown">
                <text>剩余 {{ formatTime }} 自动关闭</text>
            </view>
        </view>

        <!-- 物流时间轴 -->
        <view v-if="timeline.length" class="m-block timeline">
            <text class="block-title">物流信息</text>
            <view v-for="(node, index) in timeline" :key="node.label" class="tl">
                <view class="tl__left">
                    <view class="tl__dot" :class="{ 'tl__dot--done': node.done }"></view>
                    <view v-if="index !== timeline.length - 1" class="tl__line" :class="{ 'tl__line--done': node.done }"></view>
                </view>
                <view class="tl__body">
                    <text class="tl__label" :class="{ 'tl__label--done': node.done }">{{ node.label }}</text>
                    <text class="tl__time">{{ node.time || '待更新' }}</text>
                </view>
            </view>
        </view>

        <!-- 收货信息 -->
        <view v-if="order" class="m-block block">
            <text class="block-title">收货信息</text>
            <view class="row">
                <text class="row__label">收货人</text>
                <text class="row__value">{{ order.receiverContact }} {{ order.receiverMobile }}</text>
            </view>
            <view class="row">
                <text class="row__label">收货地址</text>
                <text class="row__value">{{ order.receiverAddress }}</text>
            </view>
        </view>

        <!-- 商品清单 -->
        <view class="m-block block">
            <text class="block-title">商品清单</text>
            <view v-for="sku in order?.skus ?? []" :key="sku.id" class="goods">
                <image class="goods__pic" :src="sku.image" mode="aspectFill" />
                <view class="goods__body">
                    <text class="goods__name m-ellipsis-2">{{ sku.name }}</text>
                    <text class="goods__attrs m-ellipsis">{{ sku.attrsText }}</text>
                    <view class="goods__foot">
                        <text class="goods__price">¥{{ Number(sku.curPrice).toFixed(2) }}</text>
                        <text class="goods__count">x{{ sku.quantity }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 金额 -->
        <view v-if="order" class="m-block block">
            <text class="block-title">金额明细</text>
            <view class="row">
                <text class="row__label">商品总额</text>
                <text class="row__value">¥{{ Number(order.totalMoney).toFixed(2) }}</text>
            </view>
            <view class="row">
                <text class="row__label">运费</text>
                <text class="row__value">{{ order.postFee ? `¥${Number(order.postFee).toFixed(2)}` : '免运费' }}</text>
            </view>
            <view class="row row--total">
                <text class="row__label">实付款</text>
                <text class="row__value row__value--price">¥{{ Number(order.payMoney).toFixed(2) }}</text>
            </view>
        </view>

        <!-- 订单信息 -->
        <view v-if="order" class="m-block block">
            <text class="block-title">订单信息</text>
            <view class="row">
                <text class="row__label">订单编号</text>
                <text class="row__value">{{ order.id }}</text>
            </view>
            <view class="row">
                <text class="row__label">下单时间</text>
                <text class="row__value">{{ dateTime(order.createTime) }}</text>
            </view>
            <view class="row">
                <text class="row__label">支付方式</text>
                <text class="row__value">{{ order.payType === 2 ? '支付宝' : '微信支付' }}</text>
            </view>
        </view>

        <!-- 底部操作 -->
        <view v-if="actions.length" class="m-action-bar bar">
            <view
                v-for="action in actions"
                :key="action.key"
                class="m-btn m-btn--sm bar__btn"
                :class="{ 'm-btn--ghost': action.ghost }"
                hover-class="m-btn--press"
                @click="action.run"
            >
                <text>{{ action.label }}</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { onLoad, onUnload } from '@dcloudio/uni-app'
    import { getOrderInfoAPI } from '@/apis/pay.ts'
    import { mockPay } from '@/mock'
    import { orderStateMeta, type OrderAction } from '@/constants/order.ts'
    import { useCartStore } from '@/stores/cartStore.ts'
    import { useCountdown } from '@/utils/countdown.ts'
    import { dateTime } from '@/utils/format.ts'
    import { toast } from '@/utils/auth.ts'

    const cartStore = useCartStore()
    const { formatTime, startCountdown, stop } = useCountdown()

    const order = ref<any>(null)
    const meta = computed(() => orderStateMeta(order.value?.orderState ?? 1))

    /** 物流节点：按订单各阶段时间拼时间轴，未到达的节点置灰 */
    const timeline = computed(() => {
        if (!order.value) return []
        const state = order.value.orderState
        if (state === 1 || state === 6) return []
        return [
            { label: '提交订单', time: dateTime(order.value.createTime), done: true },
            { label: '完成付款', time: dateTime(order.value.payTime), done: Boolean(order.value.payTime) },
            { label: '商家发货', time: dateTime(order.value.consignTime), done: Boolean(order.value.consignTime) },
            { label: '交易完成', time: dateTime(order.value.endTime), done: Boolean(order.value.endTime) },
        ]
    })

    function hasAction(action: OrderAction) {
        return meta.value.actions.includes(action)
    }

    const actions = computed(() => {
        if (!order.value) return []
        const list: { key: string; label: string; ghost?: boolean; run: () => void }[] = []
        if (hasAction('cancel')) list.push({ key: 'cancel', label: '取消订单', ghost: true, run: explain('取消订单') })
        if (hasAction('pay')) list.push({ key: 'pay', label: '立即付款', run: pay })
        if (hasAction('confirm')) list.push({ key: 'confirm', label: '确认收货', run: explain('确认收货') })
        if (hasAction('comment')) list.push({ key: 'comment', label: '去评价', run: explain('评价') })
        if (hasAction('rebuy')) list.push({ key: 'rebuy', label: '再次购买', ghost: true, run: rebuy })
        return list
    })

    function explain(name: string) {
        return () =>
            uni.showModal({
                title: name,
                content: '演示环境未接入该接口，订单状态由假数据固定。',
                showCancel: false,
            })
    }

    async function pay() {
        await mockPay(order.value.id)
        toast('支付成功', 'success')
        load()
    }

    async function rebuy() {
        const sku = order.value?.skus?.[0]
        if (!sku) return
        await cartStore.addCart({
            id: sku.spuId,
            name: sku.name,
            picture: sku.image,
            price: Number(sku.curPrice).toFixed(2),
            count: 1,
            skuId: sku.id,
            attrsText: sku.attrsText,
            selected: true,
        })
        toast('已加入购物车', 'success')
    }

    let currentId = ''

    async function load() {
        const result = (await getOrderInfoAPI(String(order.value?.id ?? currentId))) as any
        order.value = result.result
        if (order.value?.orderState === 1 && Number(order.value.countdown) > 0) {
            startCountdown(Number(order.value.countdown))
        } else {
            stop()
        }
    }

    onLoad((query) => {
        currentId = String(query?.id ?? '')
        load()
    })

    onUnload(() => {
        stop()
    })
</script>

<style scoped lang="scss">
    .head {
        margin: $gapMd $pagePadding 0;
        padding: $gapLg $gapMd;
        border-radius: $radiusMd;
        background: $brandGradient;
        color: #fff;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
    }

    .head__state {
        font-size: $fsXl;
        font-weight: 600;
    }

    .head__tip {
        font-size: $fsSm;
        color: rgba(255, 255, 255, 0.86);
    }

    .head__countdown {
        margin-top: $gapSm;
        align-self: flex-start;
        padding: 6rpx 16rpx;
        border-radius: 4rpx;
        background: rgba(255, 255, 255, 0.22);
        font-size: $fsXs;
    }

    .block,
    .timeline {
        padding: $gapMd;
    }

    .block-title {
        display: block;
        margin-bottom: $gapMd;
        font-size: $fsMd;
        font-weight: 600;
        color: $inkColor;
    }

    /* ---------- 时间轴 ---------- */
    .tl {
        display: flex;
        gap: $gapMd;
    }

    .tl__left {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 24rpx;
    }

    .tl__dot {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: #d6d9e0;
        margin-top: 8rpx;

        &--done {
            background: $brandColor;
        }
    }

    .tl__line {
        flex: 1;
        width: 2rpx;
        background: $lineColor;
        margin: 6rpx 0;

        &--done {
            background: rgba(239, 95, 42, 0.35);
        }
    }

    .tl__body {
        flex: 1;
        min-width: 0;
        padding-bottom: $gapMd;
        display: flex;
        flex-direction: column;
        gap: 4rpx;
    }

    .tl__label {
        font-size: $fsBase;
        color: $inkColor3;

        &--done {
            color: $inkColor;
            font-weight: 500;
        }
    }

    .tl__time {
        font-size: $fsXs;
        color: $inkColor3;
    }

    /* ---------- 通用行 ---------- */
    .row {
        display: flex;
        align-items: flex-start;
        gap: $gapMd;
        padding: $gapSm 0;
        font-size: $fsSm;

        &--total {
            margin-top: $gapSm;
            padding-top: $gapMd;
            border-top: 1px solid $lineColor;
        }
    }

    .row__label {
        width: 150rpx;
        flex-shrink: 0;
        color: $inkColor3;
    }

    .row__value {
        flex: 1;
        min-width: 0;
        color: $inkColor2;
        text-align: right;

        &--price {
            color: $priceColor;
            font-size: $fsLg;
            font-weight: 600;
        }
    }

    /* ---------- 商品 ---------- */
    .goods {
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

    /* ---------- 底部 ---------- */
    .bar {
        justify-content: flex-end;
    }

    .bar__btn {
        padding: 0 $gapLg;
    }
</style>
