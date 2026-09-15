<template>
    <view class="cart m-page m-page--with-bar">
        <!-- 未登录提示 -->
        <view v-if="!userStore.isLogin" class="notice" hover-class="notice--press" @click="goLogin">
            <text>登录后可同步购物车，换设备也不丢</text>
            <text class="notice__action">去登录</text>
        </view>

        <template v-if="cartStore.cartList.length">
            <view class="list">
                <view
                    v-for="(item, index) in cartStore.cartList"
                    :key="item.skuId"
                    class="swipe"
                    @touchstart="onTouchStart($event, index)"
                    @touchmove="onTouchMove($event, index)"
                    @touchend="onTouchEnd(index)"
                >
                    <view class="swipe__content" :style="{ transform: `translateX(${offsets[index] || 0}px)` }">
                        <view class="row">
                            <view class="check" :class="{ 'check--on': item.selected }" @click="toggle(item)">
                                <view v-if="item.selected" class="check__tick"></view>
                            </view>
                            <image class="row__pic" :src="item.picture" mode="aspectFill" @click="goDetail(item.id)" />
                            <view class="row__body">
                                <text class="row__name m-ellipsis-2" @click="goDetail(item.id)">{{ item.name }}</text>
                                <text class="row__attrs m-ellipsis">{{ item.attrsText }}</text>
                                <view class="row__foot">
                                    <text class="row__price">¥{{ item.price }}</text>
                                    <MCounter
                                        :model-value="item.count"
                                        size="sm"
                                        @update:model-value="(count: number) => changeCount(item, count)"
                                    />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="swipe__delete" @click="remove(item)">
                        <text>删除</text>
                    </view>
                </view>
            </view>
            <view class="tip">左滑商品可删除</view>
        </template>

        <MEmpty
            v-else
            text="购物车还是空的"
            tip="挑几件喜欢的商品放进来吧"
            action-text="去逛逛"
            @action="goHome"
        />

        <!-- 底部结算条 -->
        <view v-if="cartStore.cartList.length" class="m-action-bar settle">
            <view class="settle__all" @click="toggleAll">
                <view class="check" :class="{ 'check--on': cartStore.allSelected }">
                    <view v-if="cartStore.allSelected" class="check__tick"></view>
                </view>
                <text>全选</text>
            </view>
            <view class="settle__sum">
                <text class="settle__label">合计</text>
                <text class="settle__price">¥{{ cartStore.selectedPrice.toFixed(2) }}</text>
            </view>
            <view
                class="m-btn settle__btn"
                :class="{ 'm-btn--disabled': cartStore.selectedCount === 0 }"
                hover-class="m-btn--press"
                @click="goCheckout"
            >
                <text>去结算{{ cartStore.selectedCount ? `(${cartStore.selectedCount})` : '' }}</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { onShow } from '@dcloudio/uni-app'
    import { useCartStore, type CartItem } from '@/stores/cartStore.ts'
    import { useUserStore } from '@/stores/userStore.ts'
    import { ensureLogin, toast } from '@/utils/auth.ts'

    const cartStore = useCartStore()
    const userStore = useUserStore()

    /** 左滑删除：记录每一项的位移（px）。删除按钮宽 140rpx，按当前屏幕换算成 px */
    const DELETE_WIDTH = typeof uni.upx2px === 'function' ? uni.upx2px(140) : 70
    const offsets = ref<Record<number, number>>({})
    const startX = ref(0)
    const startOffset = ref(0)
    const draggingIndex = ref(-1)

    function onTouchStart(event: any, index: number) {
        const touch = event.touches?.[0]
        if (!touch) return
        draggingIndex.value = index
        startX.value = touch.clientX
        startOffset.value = offsets.value[index] ?? 0
    }

    function onTouchMove(event: any, index: number) {
        if (draggingIndex.value !== index) return
        const touch = event.touches?.[0]
        if (!touch) return
        const delta = touch.clientX - startX.value
        const next = Math.min(0, Math.max(-DELETE_WIDTH, startOffset.value + delta))
        offsets.value = { ...offsets.value, [index]: next }
    }

    function onTouchEnd(index: number) {
        if (draggingIndex.value !== index) return
        draggingIndex.value = -1
        const current = offsets.value[index] ?? 0
        offsets.value = { ...offsets.value, [index]: current < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0 }
    }

    async function toggle(item: CartItem) {
        await cartStore.cartSelectedChange(item, !item.selected)
    }

    async function toggleAll() {
        await cartStore.cartAllSelectedChange(!cartStore.allSelected)
    }

    async function changeCount(item: CartItem, count: number) {
        if (count === item.count) return
        await cartStore.cartCountChange(item, count)
    }

    function remove(item: CartItem) {
        uni.showModal({
            title: '删除商品',
            content: `确定把「${item.name}」从购物车移除吗？`,
            success: async (res) => {
                if (!res.confirm) return
                await cartStore.deleteCart([item.skuId])
                toast('已删除')
            },
        })
    }

    function goDetail(id: string) {
        uni.navigateTo({ url: `/pages/goods/index?id=${id}` })
    }

    function goHome() {
        uni.switchTab({ url: '/pages/home/index' })
    }

    function goLogin() {
        uni.navigateTo({ url: '/pages/login/index' })
    }

    function goCheckout() {
        if (cartStore.selectedCount === 0) {
            toast('请先选择要结算的商品')
            return
        }
        if (!ensureLogin()) return
        uni.navigateTo({ url: '/pages/checkout/index' })
    }

    onShow(() => {
        cartStore.getCartList()
        offsets.value = {}
    })
</script>

<style scoped lang="scss">
    .notice {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: $gapMd $pagePadding 0;
        padding: $gapMd;
        border-radius: $radiusMd;
        background: $brandColorSoft;
        color: $brandColorDark;
        font-size: $fsSm;

        &--press {
            opacity: 0.85;
        }
    }

    .notice__action {
        font-weight: 600;
    }

    .list {
        padding: $gapMd $pagePadding 0;
        display: flex;
        flex-direction: column;
        gap: $gapMd;
    }

    /* ---------- 左滑容器 ---------- */
    .swipe {
        position: relative;
        border-radius: $radiusMd;
        overflow: hidden;
        background: $helpColor;
    }

    .swipe__content {
        position: relative;
        z-index: 2;
        transition: transform 0.2s ease;
        background: #fff;
        border-radius: $radiusMd;
        padding: $gapMd;
    }

    .swipe__delete {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 140rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: $fsBase;
    }

    /* ---------- 行 ---------- */
    .row {
        display: flex;
        gap: $gapMd;
        align-items: flex-start;
    }

    .row__pic {
        width: 180rpx;
        height: 180rpx;
        border-radius: $radiusSm;
        background: #f4f5f8;
        flex-shrink: 0;
    }

    .row__body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        min-height: 180rpx;
    }

    .row__name {
        font-size: $fsBase;
        color: $inkColor;
        line-height: 1.4;
    }

    .row__attrs {
        font-size: $fsXs;
        color: $inkColor3;
        background: #f6f7f9;
        border-radius: $radiusXs;
        padding: 4rpx 10rpx;
        align-self: flex-start;
    }

    .row__foot {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .row__price {
        color: $priceColor;
        font-size: $fsMd;
        font-weight: 600;
    }

    /* ---------- 自绘勾选框 ---------- */
    .check {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        border: 2rpx solid #ccd0d9;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 70rpx;

        &--on {
            border-color: $brandColor;
            background: $brandColor;
        }
    }

    .check__tick {
        width: 18rpx;
        height: 10rpx;
        border-left: 3rpx solid #fff;
        border-bottom: 3rpx solid #fff;
        transform: rotate(-45deg) translate(2rpx, -2rpx);
    }

    .tip {
        padding: $gapMd $pagePadding 0;
        text-align: center;
        color: $inkColor3;
        font-size: $fsXs;
    }

    /* ---------- 结算条 ---------- */
    .settle {
        gap: $gapMd;
    }

    .settle__all {
        display: flex;
        align-items: center;
        gap: $gapSm;

        .check {
            margin-top: 0;
        }
    }

    .settle__sum {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: baseline;
        justify-content: flex-end;
        gap: 8rpx;
    }

    .settle__label {
        font-size: $fsSm;
        color: $inkColor3;
    }

    .settle__price {
        color: $priceColor;
        font-size: $fsLg;
        font-weight: 600;
    }

    .settle__btn {
        width: 240rpx;
        flex-shrink: 0;
    }
</style>
