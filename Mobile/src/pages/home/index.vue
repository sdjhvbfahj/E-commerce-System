<template>
    <view class="home m-page">
        <!-- 顶部：logo + 搜索框（跟着页面滚，不做固定，避免遮住内容） -->
        <view class="topbar">
            <view :style="{ height: statusBarHeight + 'px' }"></view>
            <view class="topbar__row" :style="topbarStyle">
                <view class="logo" hover-class="logo--press" @click="goSearch">
                    <view class="logo__mark">
                        <text>621</text>
                    </view>
                    <text class="logo__brand">621电商</text>
                </view>
                <view class="search" hover-class="search--press" @click="goSearch">
                    <view class="search__icon">
                        <view class="search__circle"></view>
                        <view class="search__handle"></view>
                    </view>
                    <text class="search__ph">搜索商品、分类</text>
                </view>
            </view>
        </view>

        <!-- 金刚区：一级分类 -->
        <view v-if="navList.length" class="m-block kk m-card">
            <view v-for="cat in navList" :key="cat.id" class="kk__item" hover-class="kk__item--press" @click="goCategory(cat.id)">
                <view class="kk__tile">
                    <text>{{ cat.name }}</text>
                </view>
            </view>
        </view>

        <!-- 轮播 -->
        <view v-if="banners.length" class="m-block">
            <swiper
                class="banner"
                circular
                autoplay
                :interval="4000"
                :duration="420"
                indicator-dots
                indicator-color="rgba(255,255,255,.45)"
                indicator-active-color="#ffffff"
            >
                <swiper-item v-for="item in banners" :key="item.id">
                    <image class="banner__img" :src="item.imgUrl" mode="aspectFill" @click="openBanner(item.hrefUrl)" />
                </swiper-item>
            </swiper>
        </view>

        <!-- 新鲜好物 -->
        <template v-if="newGoods.length">
            <MSectionHead title="新鲜好物" sub="当季上新" more @more="goCategoryGoods()" />
            <view class="grid">
                <view v-for="item in newGoods" :key="item.id" class="grid__cell">
                    <MGoodsCard :item="item" />
                </view>
            </view>
        </template>

        <!-- 人气推荐 -->
        <template v-if="hotGoods.length">
            <MSectionHead title="人气推荐" sub="大家都在买" more @more="goCategoryGoods()" />
            <scroll-view class="hots" scroll-x :show-scrollbar="false">
                <view class="hots__inner">
                    <view v-for="item in hotGoods" :key="item.id" class="hots__card" hover-class="hots__card--press" @click="goDetail(item.id)">
                        <image class="hots__pic" :src="item.picture" mode="aspectFill" />
                        <text class="hots__name m-ellipsis-2">{{ item.title }}</text>
                        <text class="hots__alt m-ellipsis">{{ item.alt }}</text>
                    </view>
                </view>
            </scroll-view>
        </template>

        <!-- 分类楼层 -->
        <view v-for="block in floors" :key="block.id" class="floor">
            <MSectionHead :title="block.name" :sub="`${block.goods.length} 件精选`" more @more="goCategoryGoods(block.id)" />
            <view class="grid">
                <view v-for="item in block.goods.slice(0, 4)" :key="item.id" class="grid__cell">
                    <MGoodsCard :item="item" />
                </view>
            </view>
        </view>

        <!-- 猜你喜欢 -->
        <MSectionHead title="猜你喜欢" sub="慢慢逛，都是好物" />
        <view v-if="likeList.length" class="grid">
            <view v-for="item in likeList" :key="`like-${item.id}`" class="grid__cell">
                <MGoodsCard :item="item" />
            </view>
        </view>
        <MLoadMore :status="likeStatus" @load="loadMoreLike" />
    </view>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
    import { getBannerAPI, getGoodsAPI, getHotAPI, getNewAPI } from '@/apis/home.ts'
    import { getLikeListAPI } from '@/apis/user.ts'
    import { useCategoryStore } from '@/stores/categoryStore.ts'
    import { useNavBar } from '@/utils/nav.ts'

    interface GoodsLike {
        id: string
        name: string
        picture: string
        price?: string
        desc?: string
        orderNum?: number
    }
    interface BannerItem {
        id: string
        imgUrl: string
        hrefUrl: string
    }
    interface HotItem {
        id: string
        title: string
        alt: string
        picture: string
    }
    interface FloorItem {
        id: string
        name: string
        goods: GoodsLike[]
    }

    const categoryStore = useCategoryStore()
    const { statusBarHeight, barHeight, rightInset } = useNavBar()

    /** 头部行高取「导航栏高度」与 44px 的较大值，保证小程序里能容下原生胶囊按钮 */
    const topbarStyle = computed(() => {
        const style: Record<string, string> = { height: `${Math.max(barHeight.value, 44)}px` }
        if (rightInset.value > 0) style.paddingRight = `${rightInset.value}px`
        return style
    })

    const navList = ref<{ id: string; name: string }[]>([])
    const banners = ref<BannerItem[]>([])
    const newGoods = ref<GoodsLike[]>([])
    const hotGoods = ref<HotItem[]>([])
    const floors = ref<FloorItem[]>([])
    const likeList = ref<GoodsLike[]>([])
    const likeStatus = ref<'more' | 'loading' | 'nomore'>('more')
    const likePage = ref(0)

    /** 首屏数据一次性并发拉取（都是本地假数据，够快） */
    async function loadAll() {
        const [nav, banner, fresh, hot, blocks] = await Promise.all([
            categoryStore.getNavList(),
            getBannerAPI('1') as any,
            getNewAPI() as any,
            getHotAPI() as any,
            getGoodsAPI() as any,
        ])
        navList.value = (nav ?? []).map((item: any) => ({ id: item.id, name: item.name }))
        banners.value = banner.result ?? []
        newGoods.value = fresh.result ?? []
        hotGoods.value = hot.result ?? []
        floors.value = blocks.result ?? []

        likePage.value = 0
        likeList.value = []
        await loadMoreLike()
    }

    /** 猜你喜欢：假接口按 limit 稳定截取，这里用「页数 × 10」当参数做无限滚动 */
    async function loadMoreLike() {
        if (likeStatus.value === 'loading' || likeStatus.value === 'nomore') return
        likeStatus.value = 'loading'
        likePage.value += 1
        const result = (await getLikeListAPI(likePage.value * 10)) as any
        const list: GoodsLike[] = result.result ?? []
        likeList.value = list
        likeStatus.value = list.length >= likePage.value * 10 ? 'more' : 'nomore'
    }

    function goSearch() {
        uni.navigateTo({ url: '/pages/search/index' })
    }

    function goDetail(id: string) {
        uni.navigateTo({ url: `/pages/goods/index?id=${id}` })
    }

    function goCategory(id: string) {
        categoryStore.activeId = id
        uni.switchTab({ url: '/pages/category/index' })
    }

    function goCategoryGoods(catId?: string) {
        if (!catId) {
            uni.switchTab({ url: '/pages/category/index' })
            return
        }
        uni.navigateTo({ url: `/pages/goods/list?catId=${catId}` })
    }

    /** 轮播跳转：假数据里的 hrefUrl 是 PC 端路由，这里映射到移动端页面 */
    function openBanner(hrefUrl: string) {
        const sub = hrefUrl.match(/\/category\/sub\/(\w+)/)
        if (sub?.[1]) {
            uni.navigateTo({ url: `/pages/goods/list?subId=${sub[1]}` })
            return
        }
        const cat = hrefUrl.match(/\/category\/(\w+)/)
        if (cat?.[1]) {
            goCategory(cat[1])
            return
        }
        if (hrefUrl.includes('/topic') || hrefUrl.includes('/brand')) {
            uni.navigateTo({ url: '/pages/category/index' })
        }
    }

    onLoad(() => {
        loadAll()
    })

    onPullDownRefresh(async () => {
        await loadAll()
        uni.stopPullDownRefresh()
    })

    onReachBottom(() => {
        loadMoreLike()
    })
</script>

<style scoped lang="scss">
    /* ---------- 顶部头部（非固定） ---------- */
    .topbar {
        background: #fff;
        border-radius: 0 0 $radiusMd $radiusMd;
        padding-bottom: $gapSm;
    }

    .topbar__row {
        display: flex;
        align-items: center;
        gap: $gapMd;
        padding: 0 $pagePadding;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 10rpx;
        flex-shrink: 0;

        &--press {
            opacity: 0.7;
        }
    }

    .logo__mark {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64rpx;
        height: 64rpx;
        border-radius: 18rpx;
        background: $brandGradient;
        box-shadow: 0 6rpx 14rpx rgba(239, 95, 42, 0.24);

        text {
            color: #fff;
            font-size: 24rpx;
            font-weight: 700;
            letter-spacing: 1rpx;
            line-height: 1;
        }
    }

    .logo__brand {
        font-size: $fsBase;
        font-weight: 600;
        color: $inkColor;
        letter-spacing: 1rpx;
    }

    /* ---------- 搜索框 ---------- */
    .search {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: $gapSm;
        height: 66rpx;
        padding: 0 $gapMd;
        border-radius: 34rpx;
        background: #f2f3f6;

        &--press {
            background: #e9ebf0;
        }
    }

    .search__icon {
        position: relative;
        width: 30rpx;
        height: 30rpx;
        flex-shrink: 0;
    }

    .search__circle {
        width: 22rpx;
        height: 22rpx;
        border: 3rpx solid $inkColor3;
        border-radius: 50%;
    }

    .search__handle {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 12rpx;
        height: 3rpx;
        background: $inkColor3;
        transform: rotate(45deg);
    }

    .search__ph {
        color: $inkColor3;
        font-size: $fsSm;
    }

    /* ---------- 金刚区 ---------- */
    .kk {
        display: flex;
        flex-wrap: wrap;
        padding: $gapMd $gapSm $gapSm;
    }

    .kk__item {
        width: 20%;
        padding: 0 6rpx $gapSm;

        &--press {
            opacity: 0.65;
        }
    }

    /* 分类名直接做底纹方块，比「单字圆 + 文字」更清楚，也不会出现视觉偏心 */
    .kk__tile {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 84rpx;
        border-radius: $radiusSm;
        background: $brandColorSoft;
        color: $brandColor;
        font-size: $fsBase;
        font-weight: 500;
        letter-spacing: 1rpx;
    }

    /* ---------- 轮播 ---------- */
    .banner {
        height: 276rpx;
        background: #f2f3f6;
        border-radius: $radiusMd;
        overflow: hidden;
    }

    .banner__img {
        width: 100%;
        height: 100%;
    }

    /* ---------- 商品网格 ---------- */
    .grid {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        padding: 0 $pagePadding;
    }

    .grid__cell {
        width: calc((100% - 20rpx) / 2);
    }

    /* ---------- 人气推荐（横向滑动） ---------- */
    .hots {
        white-space: nowrap;
    }

    .hots__inner {
        display: inline-flex;
        gap: 20rpx;
        padding: 0 $pagePadding;
    }

    .hots__card {
        flex-shrink: 0;
        width: 300rpx;
        background: #fff;
        border-radius: $radiusMd;
        padding-bottom: $gapSm;

        &--press {
            opacity: 0.9;
        }
    }

    .hots__pic {
        width: 300rpx;
        height: 300rpx;
        background: #f2f3f6;
        border-radius: $radiusMd $radiusMd 0 0;
    }

    .hots__name {
        display: block;
        padding: $gapSm $gapSm 0;
        font-size: $fsBase;
        color: $inkColor;
        white-space: normal;
        line-height: 1.35;
        height: 70rpx;
    }

    .hots__alt {
        display: block;
        padding: 4rpx $gapSm 0;
        color: $inkColor3;
        font-size: $fsXs;
    }

    /* ---------- 楼层 ---------- */
    .floor {
        margin-top: $gapSm;
    }
</style>
