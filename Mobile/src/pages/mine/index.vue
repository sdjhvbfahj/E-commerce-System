<template>
    <view class="mine m-page">
        <!-- 顶部渐变头（跟着页面滚，不用固定定位，避免遮住下面的内容） -->
        <view class="hero" :class="{ 'hero--guest': !userStore.isLogin }">
            <view :style="{ height: statusBarHeight + 'px' }"></view>
            <view class="hero__bar" :style="heroBarStyle">
                <text class="hero__title">我的</text>
            </view>

            <view class="profile__row" @click="onProfileTap">
                <image class="profile__avatar" :src="avatar" mode="aspectFill" />
                <view class="profile__info">
                    <text class="profile__name">{{ userStore.isLogin ? userStore.userInfo.nickname : '点击登录' }}</text>
                    <text class="profile__tip">{{ userStore.isLogin ? accountText : '登录后同步订单与购物车' }}</text>
                </view>
                <view v-if="userStore.isLogin" class="m-tag profile__tag">621 会员</view>
            </view>

            <!-- 订单入口 -->
            <view class="orders">
                <view class="orders__head">
                    <text class="orders__title">我的订单</text>
                    <view class="orders__more" hover-class="orders__more--press" @click="goOrder(0)">
                        <text>全部订单</text>
                        <view class="chevron"></view>
                    </view>
                </view>
                <view class="orders__grid">
                    <view v-for="item in MINE_ORDER_ENTRIES" :key="item.state" class="orders__item" hover-class="orders__item--press" @click="goOrder(item.state)">
                        <view class="orders__badge-wrap">
                            <text class="orders__label">{{ item.label }}</text>
                            <view v-if="counts[item.state]" class="orders__badge">
                                <text>{{ counts[item.state] }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 常用功能 -->
        <view class="m-block menu m-card">
            <view class="menu__row" hover-class="menu__row--press" @click="goAddress">
                <image class="menu__icon" src="/static/icons/location.png" mode="aspectFit" />
                <text class="menu__label">收货地址</text>
                <view class="chevron"></view>
            </view>
            <view class="menu__row" hover-class="menu__row--press" @click="contactService">
                <image class="menu__icon" src="/static/icons/service.png" mode="aspectFit" />
                <text class="menu__label">联系客服</text>
                <view class="chevron"></view>
            </view>
            <view class="menu__row" hover-class="menu__row--press" @click="resetDemo">
                <view class="menu__icon menu__icon--reset"></view>
                <text class="menu__label">重置演示数据</text>
                <view class="chevron"></view>
            </view>
        </view>

        <view v-if="userStore.isLogin" class="m-block">
            <view class="m-btn m-btn--ghost logout" hover-class="m-btn--press" @click="logout">
                <text>退出登录</text>
            </view>
        </view>

        <!-- 猜你喜欢 -->
        <MSectionHead title="猜你喜欢" sub="根据你的浏览推荐" />
        <view class="grid">
            <view v-for="item in likeList" :key="item.id" class="grid__cell">
                <MGoodsCard :item="item" />
            </view>
        </view>
        <view class="mine__bottom"></view>
    </view>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { onShow } from '@dcloudio/uni-app'
    import { useUserStore } from '@/stores/userStore.ts'
    import { useNavBar } from '@/utils/nav.ts'
    import { useCartStore } from '@/stores/cartStore.ts'
    import { getUserOrderAPI } from '@/apis/order.ts'
    import { resetMockStorage } from '@/mock'
    import { MINE_ORDER_ENTRIES } from '@/constants/order.ts'
    import { toast } from '@/utils/auth.ts'

    const userStore = useUserStore()
    const cartStore = useCartStore()
    const { statusBarHeight, barHeight, rightInset } = useNavBar()

    /** 小程序里要给右上角原生胶囊留位置，同时保证行高够放提示信息 */
    const heroBarStyle = computed(() => {
        const style: Record<string, string> = { height: `${Math.max(barHeight.value, 44)}px` }
        if (rightInset.value > 0) style.paddingRight = `${rightInset.value}px`
        return style
    })

    const counts = ref<Record<number, number>>({})

    const avatar = computed(() => userStore.userInfo.avatar || '/static/icons/empty.png')
    const accountText = computed(() => userStore.userInfo.account || '')
    const likeList = computed<any[]>(() => (userStore.likeList as any[]) ?? [])

    async function loadCounts() {
        if (!userStore.isLogin) {
            counts.value = {}
            return
        }
        const result = (await getUserOrderAPI({ orderState: 0, page: 1, pageSize: 50 })) as any
        const items: any[] = result.result?.items ?? []
        counts.value = items.reduce<Record<number, number>>((map, order) => {
            map[order.orderState] = (map[order.orderState] ?? 0) + 1
            return map
        }, {})
    }

    function onProfileTap() {
        if (!userStore.isLogin) {
            uni.navigateTo({ url: '/pages/login/index' })
        }
    }

    function goOrder(state: number) {
        if (!userStore.isLogin) {
            uni.navigateTo({ url: '/pages/login/index' })
            return
        }
        uni.navigateTo({ url: `/pages/order/list?state=${state}` })
    }

    function goAddress() {
        uni.navigateTo({ url: '/pages/address/list' })
    }

    function contactService() {
        uni.showModal({
            title: '联系客服',
            content: '演示环境未接入在线客服。可先看看订单页的物流信息。',
            showCancel: false,
        })
    }

    function resetDemo() {
        uni.showModal({
            title: '重置演示数据',
            content: '会清空本地的购物车、订单与登录态，恢复到初始状态。',
            success: (res) => {
                if (!res.confirm) return
                resetMockStorage()
                userStore.deleteLoginInfo()
                cartStore.clearCart()
                counts.value = {}
                toast('已恢复初始数据', 'success')
            },
        })
    }

    function logout() {
        uni.showModal({
            title: '退出登录',
            content: '退出后本地购物车也会被清空。',
            success: (res) => {
                if (!res.confirm) return
                userStore.deleteLoginInfo()
                cartStore.clearCart()
                counts.value = {}
                toast('已退出登录')
            },
        })
    }

    onShow(() => {
        loadCounts()
        userStore.getLikeList()
        if (userStore.isLogin) cartStore.getCartList()
    })
</script>

<style scoped lang="scss">
    /* ---------- 顶部渐变头 ---------- */
    .hero {
        padding: 0 $pagePadding $gapMd;
        background: $brandGradient;
        border-radius: 0 0 $radiusLg $radiusLg;

        &--guest {
            background: linear-gradient(120deg, #4a5164 0%, #232838 100%);
        }
    }

    .hero__bar {
        display: flex;
        align-items: center;
    }

    .hero__title {
        font-size: $fsLg;
        font-weight: 600;
        color: #fff;
        letter-spacing: 1rpx;
    }

    .profile__row {
        display: flex;
        align-items: center;
        gap: $gapMd;
        padding: $gapMd 0 $gapLg;
    }

    .profile__avatar {
        width: 112rpx;
        height: 112rpx;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.35);
        border: 4rpx solid rgba(255, 255, 255, 0.6);
    }

    .profile__info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6rpx;
    }

    .profile__name {
        font-size: $fsXl;
        font-weight: 600;
        color: #fff;
    }

    .profile__tip {
        font-size: $fsSm;
        color: rgba(255, 255, 255, 0.85);
    }

    .profile__tag {
        color: #fff;
        background: rgba(255, 255, 255, 0.24);
    }

    /* ---------- 订单卡片 ---------- */
    .orders {
        background: #fff;
        border-radius: $radiusMd;
        padding: $gapMd;
        box-shadow: $shadowSm;
    }

    .orders__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: $gapMd;
        border-bottom: 1px solid $lineColor;
    }

    .orders__title {
        font-size: $fsMd;
        font-weight: 600;
        color: $inkColor;
    }

    .orders__more {
        display: flex;
        align-items: center;
        gap: 8rpx;
        color: $inkColor3;
        font-size: $fsSm;

        &--press {
            opacity: 0.6;
        }
    }

    .orders__grid {
        display: flex;
        padding-top: $gapMd;
    }

    .orders__item {
        flex: 1;
        display: flex;
        justify-content: center;

        &--press {
            opacity: 0.6;
        }
    }

    .orders__badge-wrap {
        position: relative;
    }

    .orders__label {
        font-size: $fsSm;
        color: $inkColor2;
    }

    .orders__badge {
        position: absolute;
        right: -28rpx;
        top: -14rpx;
        min-width: 30rpx;
        height: 30rpx;
        padding: 0 6rpx;
        border-radius: 15rpx;
        background: $brandColor;
        color: #fff;
        font-size: 18rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* ---------- 功能列表 ---------- */
    .menu {
        padding: 0 $gapMd;
    }

    .menu__row {
        display: flex;
        align-items: center;
        gap: $gapMd;
        height: 104rpx;
        border-bottom: 1px solid $lineColor;

        &:last-child {
            border-bottom: none;
        }

        &--press {
            background: #fafbfc;
        }
    }

    .menu__icon {
        width: 40rpx;
        height: 40rpx;
    }

    .menu__icon--reset {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        border: 3rpx solid $inkColor3;
        position: relative;
    }

    .menu__label {
        flex: 1;
        font-size: $fsBase;
        color: $inkColor;
    }

    .chevron {
        width: 16rpx;
        height: 16rpx;
        border-top: 3rpx solid $inkColor3;
        border-left: 3rpx solid $inkColor3;
        transform: rotate(135deg);
    }

    .logout {
        width: 100%;
    }

    /* ---------- 猜你喜欢 ---------- */
    .grid {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        padding: 0 $pagePadding;
    }

    .grid__cell {
        width: calc((100% - 20rpx) / 2);
    }

    .mine__bottom {
        height: 60rpx;
    }
</style>
