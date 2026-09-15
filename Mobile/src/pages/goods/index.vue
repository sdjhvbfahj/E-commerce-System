<template>
    <view class="goods m-page m-page--with-bar">
        <MNavBar :title="detail?.name || '商品详情'" show-back solid />

        <!-- 图集 -->
        <swiper
            v-if="pictures.length"
            class="gallery"
            circular
            :indicator-dots="pictures.length > 1"
            indicator-color="rgba(35,40,56,.2)"
            indicator-active-color="#ef5f2a"
        >
            <swiper-item v-for="(pic, index) in pictures" :key="index">
                <image class="gallery__img" :src="pic" mode="aspectFill" />
            </swiper-item>
        </swiper>

        <!-- 价格与标题 -->
        <view class="m-block info">
            <view class="info__price">
                <text class="m-price">
                    <text class="m-price__symbol">¥</text>
                    <text class="m-price__num">{{ detail?.price }}</text>
                </text>
                <text v-if="detail?.oldPrice" class="m-price--old">¥{{ detail.oldPrice }}</text>
                <text v-if="discount" class="m-tag info__discount">{{ discount }}</text>
            </view>
            <text class="info__name">{{ detail?.name }}</text>
            <text v-if="detail?.desc" class="info__desc">{{ detail.desc }}</text>
            <view class="info__meta">
                <text>销量 {{ salesText(detail?.salesCount) }}</text>
                <text>评价 {{ salesText(detail?.commentCount) }}</text>
                <text>收藏 {{ salesText(detail?.collectCount) }}</text>
            </view>
        </view>

        <!-- 服务保障 -->
        <view class="m-block services">
            <view v-for="tag in SERVICES" :key="tag" class="services__item">
                <view class="services__dot"></view>
                <text>{{ tag }}</text>
            </view>
        </view>

        <!-- 规格入口 -->
        <view class="m-block picker" hover-class="picker--press" @click="openSku('cart')">
            <text class="picker__label">选择</text>
            <text class="picker__value m-ellipsis">{{ pickedText }}</text>
            <view class="chevron"></view>
        </view>

        <!-- 参数 -->
        <view v-if="properties.length" class="m-block params">
            <text class="params__title">商品参数</text>
            <view v-for="item in properties" :key="item.name" class="params__row">
                <text class="params__name">{{ item.name }}</text>
                <text class="params__value">{{ item.value }}</text>
            </view>
        </view>

        <!-- 图文详情 -->
        <view v-if="detailPictures.length" class="m-block detail">
            <text class="detail__title">图文详情</text>
            <image v-for="(pic, index) in detailPictures" :key="index" class="detail__img" :src="pic" mode="widthFix" />
        </view>

        <!-- 24 小时热榜 -->
        <template v-if="hotList.length">
            <MSectionHead title="24 小时热榜" sub="同品类热销" />
            <scroll-view class="hots" scroll-x :show-scrollbar="false">
                <view class="hots__inner">
                    <view v-for="item in hotList" :key="item.id" class="hots__card" hover-class="hots__card--press" @click="goDetail(item.id)">
                        <image class="hots__pic" :src="item.picture" mode="aspectFill" />
                        <text class="hots__name m-ellipsis">{{ item.name }}</text>
                        <text class="hots__price">¥{{ item.price }}</text>
                    </view>
                </view>
            </scroll-view>
        </template>

        <!-- 底部操作栏 -->
        <view class="m-action-bar bar">
            <view class="bar__icon" hover-class="bar__icon--press" @click="contactService">
                <image class="bar__icon-img" src="/static/icons/service.png" mode="aspectFit" />
                <text>客服</text>
            </view>
            <view class="bar__icon" hover-class="bar__icon--press" @click="goCart">
                <view class="bar__cart-wrap">
                    <image class="bar__icon-img" src="/static/icons/cart.png" mode="aspectFit" />
                    <view v-if="cartStore.cartCount > 0" class="bar__badge">
                        <text>{{ cartStore.cartCount > 99 ? '99+' : cartStore.cartCount }}</text>
                    </view>
                </view>
                <text>购物车</text>
            </view>
            <view class="m-btn m-btn--plain bar__btn" hover-class="m-btn--press" @click="openSku('cart')">
                <text>加入购物车</text>
            </view>
            <view class="m-btn bar__btn" hover-class="m-btn--press" @click="openSku('buy')">
                <text>立即购买</text>
            </view>
        </view>

        <!-- 规格弹层 -->
        <MSkuPopup :visible="skuVisible" :goods="detail" @close="skuVisible = false" @confirm="onSkuConfirm" />
    </view>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { onLoad } from '@dcloudio/uni-app'
    import { fetchHotGoodsAPI, getDetailAPI } from '@/apis/detail.ts'
    import { useCartStore } from '@/stores/cartStore.ts'
    import { ensureLogin, toast } from '@/utils/auth.ts'
    import { salesText } from '@/utils/format.ts'

    const SERVICES = ['正品保障', '极速发货', '七天无理由']

    interface Detail {
        id: string
        name: string
        desc: string
        price: string
        oldPrice: string
        mainPictures: string[]
        specs: any[]
        skus: any[]
        details: { picture: string[]; properties: { name: string; value: string }[] }
        salesCount: number
        commentCount: number
        collectCount: number
        hotByDay: any[]
    }

    const cartStore = useCartStore()

    const detail = ref<Detail | null>(null)
    const hotList = ref<any[]>([])
    const skuVisible = ref(false)
    const skuMode = ref<'cart' | 'buy'>('cart')
    const picked = ref<Record<string, string>>({})

    const pictures = computed(() => detail.value?.mainPictures ?? [])
    const properties = computed(() => detail.value?.details?.properties ?? [])
    const detailPictures = computed(() => detail.value?.details?.picture ?? [])
    const discount = computed(() => {
        const current = Number(detail.value?.price ?? 0)
        const old = Number(detail.value?.oldPrice ?? 0)
        if (!old || old <= current) return ''
        return `${(current / old * 10).toFixed(1)} 折`
    })
    const pickedText = computed(() => {
        const text = Object.values(picked.value).filter(Boolean).join(' / ')
        return text ? `已选 ${text}` : '请选择 规格'
    })

    function openSku(mode: 'cart' | 'buy' = 'cart') {
        if (!detail.value) return
        skuMode.value = mode
        skuVisible.value = true
    }

    async function onSkuConfirm(payload: { sku: any; count: number; mode: 'cart' | 'buy' }) {
        const goods = detail.value
        if (!goods) return
        skuVisible.value = false
        picked.value = Object.fromEntries(payload.sku.specs.map((item: any) => [item.name, item.valueName]))

        const cartItem = {
            id: goods.id,
            name: goods.name,
            picture: goods.mainPictures[0] ?? '',
            price: payload.sku.price,
            count: payload.count,
            skuId: payload.sku.id,
            attrsText: payload.sku.specs.map((item: any) => `${item.name}：${item.valueName}`).join(' '),
            selected: true,
        }

        // 演示环境：加入购物车需要登录（未登录时的本地车和「服务端车」会不一致）
        if (!ensureLogin()) return

        await cartStore.addCart(cartItem)

        if (payload.mode === 'buy') {
            // 立即购买：只勾选这一件，然后直接进结算页
            await cartStore.cartAllSelectedChange(false)
            const target = cartStore.cartList.find((item) => item.skuId === payload.sku.id)
            if (target) await cartStore.cartSelectedChange(target, true)
            uni.navigateTo({ url: '/pages/checkout/index' })
            return
        }

        toast('已加入购物车', 'success')
        syncBadge()
    }

    /** 同步 tabBar 购物车角标 */
    function syncBadge() {
        const count = cartStore.cartCount
        if (count > 0) {
            uni.setTabBarBadge({ index: 2, text: count > 99 ? '99+' : String(count) })
        } else {
            uni.removeTabBarBadge({ index: 2 })
        }
    }

    function contactService() {
        uni.showModal({
            title: '联系客服',
            content: '演示环境暂未接入在线客服，可在帮助中心查看常见问题。',
            showCancel: false,
        })
    }

    function goCart() {
        uni.switchTab({ url: '/pages/cart/index' })
    }

    function goDetail(id: string) {
        uni.navigateTo({ url: `/pages/goods/index?id=${id}` })
    }

    onLoad(async (query) => {
        const id = String(query?.id ?? '')
        const [result, hot] = await Promise.all([getDetailAPI(id) as any, fetchHotGoodsAPI({ id, type: 1, limit: 6 }) as any])
        detail.value = result.result
        hotList.value = hot.result ?? []
        await cartStore.getCartList()
        syncBadge()
    })
</script>

<style scoped lang="scss">
    .gallery {
        height: 750rpx;
        background: #f2f3f6;
    }

    .gallery__img {
        width: 100%;
        height: 100%;
    }

    /* ---------- 价格与标题 ---------- */
    .info {
        padding: $gapMd;
        display: flex;
        flex-direction: column;
        gap: $gapSm;
    }

    .info__price {
        display: flex;
        align-items: baseline;
        gap: $gapSm;
    }

    .info__discount {
        height: 34rpx;
        font-size: $fsXs;
    }

    .info__name {
        font-size: $fsLg;
        font-weight: 600;
        color: $inkColor;
        line-height: 1.4;
    }

    .info__desc {
        color: $inkColor3;
        font-size: $fsSm;
    }

    .info__meta {
        display: flex;
        gap: $gapLg;
        color: $inkColor3;
        font-size: $fsXs;
    }

    /* ---------- 服务 ---------- */
    .services {
        display: flex;
        align-items: center;
        padding: $gapMd;
        gap: $gapLg;
    }

    .services__item {
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: $fsSm;
        color: $inkColor2;
    }

    .services__dot {
        width: 10rpx;
        height: 10rpx;
        border-radius: 50%;
        background: $brandColor;
    }

    /* ---------- 规格入口 ---------- */
    .picker {
        display: flex;
        align-items: center;
        gap: $gapMd;
        padding: $gapMd;

        &--press {
            background: #fafbfc;
        }
    }

    .picker__label {
        color: $inkColor3;
        font-size: $fsSm;
        flex-shrink: 0;
    }

    .picker__value {
        flex: 1;
        min-width: 0;
        font-size: $fsBase;
        color: $inkColor;
    }

    .chevron {
        width: 16rpx;
        height: 16rpx;
        border-top: 3rpx solid $inkColor3;
        border-left: 3rpx solid $inkColor3;
        transform: rotate(135deg);
        flex-shrink: 0;
    }

    /* ---------- 参数 ---------- */
    .params {
        padding: $gapMd;
    }

    .params__title,
    .detail__title {
        display: block;
        margin-bottom: $gapMd;
        font-size: $fsMd;
        font-weight: 600;
        color: $inkColor;
    }

    .params__row {
        display: flex;
        padding: $gapSm 0;
        border-bottom: 1px solid $lineColor;
        font-size: $fsSm;

        &:last-child {
            border-bottom: none;
        }
    }

    .params__name {
        width: 180rpx;
        color: $inkColor3;
        flex-shrink: 0;
    }

    .params__value {
        flex: 1;
        color: $inkColor2;
    }

    /* ---------- 图文详情 ---------- */
    .detail {
        padding: $gapMd;
    }

    .detail__img {
        width: 100%;
        display: block;
        border-radius: $radiusSm;
        margin-bottom: $gapSm;
    }

    /* ---------- 热榜 ---------- */
    .hots {
        white-space: nowrap;
    }

    .hots__inner {
        display: inline-flex;
        gap: 20rpx;
        padding: 0 $pagePadding $gapMd;
    }

    .hots__card {
        flex-shrink: 0;
        width: 240rpx;
        background: #fff;
        border-radius: $radiusMd;
        padding-bottom: $gapSm;

        &--press {
            opacity: 0.9;
        }
    }

    .hots__pic {
        width: 240rpx;
        height: 240rpx;
        background: #f2f3f6;
        border-radius: $radiusMd $radiusMd 0 0;
    }

    .hots__name {
        display: block;
        padding: $gapXs $gapSm 0;
        font-size: $fsSm;
        color: $inkColor;
    }

    .hots__price {
        display: block;
        padding: 4rpx $gapSm 0;
        color: $priceColor;
        font-size: $fsSm;
        font-weight: 600;
    }

    /* ---------- 底部栏 ---------- */
    .bar {
        gap: $gapSm;
    }

    .bar__icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rpx;
        width: 96rpx;
        font-size: 20rpx;
        color: $inkColor3;

        &--press {
            opacity: 0.6;
        }
    }

    .bar__icon-img {
        width: 40rpx;
        height: 40rpx;
    }

    .bar__cart-wrap {
        position: relative;
    }

    .bar__badge {
        position: absolute;
        right: -18rpx;
        top: -10rpx;
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

    .bar__btn {
        flex: 1;
        height: 76rpx;
        font-size: $fsBase;
        border-radius: 38rpx;
    }
</style>
