<template>
    <view class="orders m-page">
        <!-- 状态页签 -->
        <scroll-view class="tabs" scroll-x :show-scrollbar="false">
            <view class="tabs__inner">
                <view
                    v-for="tab in ORDER_TABS"
                    :key="tab.value"
                    class="tabs__item"
                    :class="{ 'tabs__item--active': tab.value === orderState }"
                    @click="changeTab(tab.value)"
                >
                    <text>{{ tab.label }}</text>
                </view>
            </view>
        </scroll-view>

        <template v-if="list.length">
            <view class="list">
                <view v-for="order in list" :key="order.id" class="order m-card">
                    <view class="order__head" @click="goDetail(order.id)">
                        <text class="order__no">{{ order.id }}</text>
                        <text class="order__state" :class="{ 'order__state--warn': order.orderState === 1 }">
                            {{ orderMeta(order.orderState).label }}
                        </text>
                    </view>

                    <view class="order__goods" @click="goDetail(order.id)">
                        <view v-for="sku in order.skus" :key="sku.id" class="sku">
                            <image class="sku__pic" :src="sku.image" mode="aspectFill" />
                            <view class="sku__body">
                                <text class="sku__name m-ellipsis-2">{{ sku.name }}</text>
                                <text class="sku__attrs m-ellipsis">{{ sku.attrsText }}</text>
                                <view class="sku__foot">
                                    <text class="sku__price">¥{{ Number(sku.curPrice).toFixed(2) }}</text>
                                    <text class="sku__count">x{{ sku.quantity }}</text>
                                </view>
                            </view>
                        </view>
                    </view>

                    <view class="order__tip">
                        <text v-if="order.orderState === 1">{{ orderMeta(1).tip }}</text>
                        <text v-else>{{ orderMeta(order.orderState).tip }}</text>
                    </view>

                    <view class="order__foot">
                        <view class="order__sum">
                            <text class="order__count">共 {{ order.totalNum }} 件</text>
                            <text class="order__amount">实付 ¥{{ Number(order.payMoney).toFixed(2) }}</text>
                        </view>
                        <view class="order__actions">
                            <view v-if="has(order, 'cancel')" class="m-btn m-btn--ghost m-btn--sm" hover-class="m-btn--press" @click="cancel(order)">
                                <text>取消订单</text>
                            </view>
                            <view v-if="has(order, 'pay')" class="m-btn m-btn--sm" hover-class="m-btn--press" @click="pay(order)">
                                <text>立即付款</text>
                            </view>
                            <view v-if="has(order, 'confirm')" class="m-btn m-btn--sm" hover-class="m-btn--press" @click="confirm(order)">
                                <text>确认收货</text>
                            </view>
                            <view v-if="has(order, 'comment')" class="m-btn m-btn--sm" hover-class="m-btn--press" @click="comment(order)">
                                <text>去评价</text>
                            </view>
                            <view v-if="has(order, 'rebuy')" class="m-btn m-btn--ghost m-btn--sm" hover-class="m-btn--press" @click="rebuy(order)">
                                <text>再次购买</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <MLoadMore :status="status" @load="loadMore" />
        </template>

        <MEmpty v-else-if="status !== 'loading'" text="这里还没有订单" tip="去首页挑几件喜欢的商品" action-text="去逛逛" @action="goHome" />
        <MLoadMore v-else status="loading" />
    </view>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
    import { getUserOrderAPI } from '@/apis/order.ts'
    import { mockPay } from '@/mock'
    import { ORDER_TABS, orderStateMeta, type OrderAction } from '@/constants/order.ts'
    import { useCartStore } from '@/stores/cartStore.ts'
    import { toast } from '@/utils/auth.ts'

    const cartStore = useCartStore()

    const orderState = ref(0)
    const list = ref<any[]>([])
    const page = ref(0)
    const status = ref<'more' | 'loading' | 'nomore'>('more')

    const orderMeta = orderStateMeta

    function has(order: any, action: OrderAction) {
        return orderMeta(order.orderState).actions.includes(action)
    }

    async function loadMore(reset = false) {
        if (status.value === 'loading') return
        if (!reset && status.value === 'nomore') return
        if (reset) {
            page.value = 0
            list.value = []
            status.value = 'more'
        }
        status.value = 'loading'
        page.value += 1
        const result = (await getUserOrderAPI({ orderState: orderState.value, page: page.value, pageSize: 5 })) as any
        const data = result.result
        const items: any[] = data?.items ?? []
        list.value = page.value === 1 ? items : [...list.value, ...items]
        const total = Number(data?.counts ?? list.value.length)
        status.value = list.value.length >= total || items.length === 0 ? 'nomore' : 'more'
    }

    function changeTab(state: number) {
        if (orderState.value === state) return
        orderState.value = state
        loadMore(true)
        uni.pageScrollTo({ scrollTop: 0, duration: 0 })
    }

    function goDetail(id: string) {
        uni.navigateTo({ url: `/pages/order/detail?id=${id}` })
    }

    function goHome() {
        uni.switchTab({ url: '/pages/home/index' })
    }

    async function pay(order: any) {
        await mockPay(order.id)
        toast('支付成功', 'success')
        loadMore(true)
    }

    function cancel(order: any) {
        uni.showModal({
            title: '取消订单',
            content: '演示环境未接入取消接口，可理解为「待付款超时自动关闭」。',
            showCancel: false,
        })
    }

    function confirm(order: any) {
        uni.showModal({
            title: '确认收货',
            content: '演示环境未接入收货接口，订单状态由假数据固定。',
            showCancel: false,
        })
    }

    function comment(order: any) {
        uni.showModal({
            title: '去评价',
            content: '演示环境未接入评价功能。',
            showCancel: false,
        })
    }

    async function rebuy(order: any) {
        const sku = order.skus?.[0]
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

    onLoad((query) => {
        orderState.value = Number(query?.state ?? 0)
        loadMore(true)
    })

    onPullDownRefresh(async () => {
        await loadMore(true)
        uni.stopPullDownRefresh()
    })

    onReachBottom(() => {
        loadMore()
    })
</script>

<style scoped lang="scss">
    .tabs {
        position: sticky;
        top: 0;
        z-index: 10;
        background: #fff;
        border-bottom: 1px solid $lineColor;
        white-space: nowrap;
    }

    .tabs__inner {
        display: inline-flex;
        padding: 0 $pagePadding;
    }

    .tabs__item {
        flex-shrink: 0;
        white-space: nowrap;
        padding: 0 $gapMd;
        height: 88rpx;
        display: flex;
        align-items: center;
        font-size: $fsBase;
        color: $inkColor2;

        &--active {
            color: $brandColor;
            font-weight: 600;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                left: 50%;
                bottom: 12rpx;
                width: 40rpx;
                height: 4rpx;
                margin-left: -20rpx;
                border-radius: 2rpx;
                background: $brandColor;
            }
        }
    }

    .list {
        padding: $gapMd $pagePadding 0;
        display: flex;
        flex-direction: column;
        gap: $gapMd;
    }

    .order {
        padding: $gapMd;
    }

    .order__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: $gapMd;
        border-bottom: 1px solid $lineColor;
    }

    .order__no {
        color: $inkColor3;
        font-size: $fsXs;
    }

    .order__state {
        font-size: $fsSm;
        font-weight: 600;
        color: $sucColor;

        &--warn {
            color: $warnColor;
        }
    }

    .order__goods {
        padding: $gapMd 0;
        display: flex;
        flex-direction: column;
        gap: $gapMd;
    }

    .sku {
        display: flex;
        gap: $gapMd;
    }

    .sku__pic {
        width: 160rpx;
        height: 160rpx;
        border-radius: $radiusSm;
        background: #f4f5f8;
        flex-shrink: 0;
    }

    .sku__body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6rpx;
    }

    .sku__name {
        font-size: $fsBase;
        line-height: 1.4;
    }

    .sku__attrs {
        font-size: $fsXs;
        color: $inkColor3;
    }

    .sku__foot {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .sku__price {
        color: $priceColor;
        font-weight: 600;
    }

    .sku__count {
        color: $inkColor3;
        font-size: $fsSm;
    }

    .order__tip {
        color: $inkColor3;
        font-size: $fsXs;
    }

    .order__foot {
        margin-top: $gapMd;
        padding-top: $gapMd;
        border-top: 1px solid $lineColor;
        display: flex;
        flex-direction: column;
        gap: $gapMd;
    }

    .order__sum {
        display: flex;
        align-items: baseline;
        justify-content: flex-end;
        gap: $gapSm;
    }

    .order__count {
        color: $inkColor3;
        font-size: $fsXs;
    }

    .order__amount {
        color: $inkColor;
        font-size: $fsBase;
        font-weight: 600;
    }

    .order__actions {
        display: flex;
        justify-content: flex-end;
        gap: $gapSm;
    }
</style>
