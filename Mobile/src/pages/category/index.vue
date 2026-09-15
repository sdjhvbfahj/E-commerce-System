<template>
    <view class="cat">
        <!-- 左侧一级分类（吸顶，页面本身滚动） -->
        <view class="cat__side">
            <view
                v-for="item in navList"
                :key="item.id"
                class="cat__item"
                :class="{ 'cat__item--active': item.id === activeId }"
                hover-class="cat__item--press"
                @click="selectCategory(item)"
            >
                <text>{{ item.name }}</text>
            </view>
        </view>

        <!-- 右侧：二级分类宫格 + 热门商品 -->
        <view class="cat__main">
            <view v-if="detail" class="cat__banner">
                <text class="cat__banner-name">{{ detail.name }}</text>
                <text class="cat__banner-tip">{{ subs.length }} 个细分品类 · {{ goods.length }} 件在售</text>
            </view>

            <view class="subs">
                <view v-for="sub in subs" :key="sub.id" class="subs__item" hover-class="subs__item--press" @click="goSub(sub.id, sub.name)">
                    <image class="subs__pic" :src="sub.picture" mode="aspectFill" />
                    <text class="subs__name m-ellipsis">{{ sub.name }}</text>
                </view>
            </view>

            <MSectionHead title="热门商品" :sub="detail ? detail.name : ''" />
            <view class="grid">
                <view v-for="item in goods" :key="item.id" class="grid__cell">
                    <MGoodsCard :item="item" />
                </view>
            </view>
            <view class="cat__bottom"></view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { onLoad } from '@dcloudio/uni-app'
    import { useCategoryStore } from '@/stores/categoryStore.ts'

    interface SubCategory {
        id: string
        name: string
        picture: string
        goods?: any[]
    }

    const categoryStore = useCategoryStore()
    const activeId = ref('')
    const detail = ref<{ id: string; name: string; children?: SubCategory[] } | null>(null)

    const navList = computed(() => categoryStore.navList)
    const subs = computed<SubCategory[]>(() => detail.value?.children ?? [])
    /** 把各二级分类的商品汇总去重，作为「热门商品」 */
    const goods = computed(() => {
        const seen = new Set<string>()
        const list: any[] = []
        subs.value.forEach((sub) => {
            ;(sub.goods ?? []).forEach((item) => {
                if (seen.has(item.id)) return
                seen.add(item.id)
                list.push(item)
            })
        })
        return list.slice(0, 8)
    })

    async function selectCategory(item: { id: string; name: string }) {
        if (item.id === activeId.value) return
        await categoryStore.getCategoryDetail(item.id)
        detail.value = categoryStore.detail
        uni.pageScrollTo({ scrollTop: 0, duration: 0 })
    }

    function goSub(subId: string, name: string) {
        uni.navigateTo({ url: `/pages/goods/list?subId=${subId}&name=${encodeURIComponent(name)}` })
    }

    onLoad(async () => {
        await categoryStore.getNavList()
        const first = navList.value[0]
        const targetId = categoryStore.activeId || first?.id || ''
        if (first) await selectCategory({ id: targetId, name: first.name })
    })
</script>

<style scoped lang="scss">
    .cat {
        display: flex;
        align-items: flex-start;
        min-height: 100vh;
        background: $bgColor;
    }

    /* ---------- 左侧 ---------- */
    .cat__side {
        position: sticky;
        top: 0;
        width: 184rpx;
        flex-shrink: 0;
        height: 100vh;
        background: #fff;
        padding: $gapSm 0;
    }

    .cat__item {
        position: relative;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 96rpx;
        font-size: $fsSm;
        color: $inkColor2;

        &--active {
            color: $brandColor;
            font-weight: 600;
            background: $brandColorSoft;
        }

        &--press {
            background: #f6f7f9;
        }
    }

    /* ---------- 右侧 ---------- */
    .cat__main {
        flex: 1;
        min-width: 0;
        padding-bottom: 40rpx;
    }

    .cat__banner {
        padding: $gapLg $pagePadding $gapMd;
        background: #fff;
        display: flex;
        flex-direction: column;
        gap: 6rpx;
    }

    .cat__banner-name {
        font-size: $fsXl;
        font-weight: 600;
        color: $inkColor;
    }

    .cat__banner-tip {
        color: $inkColor3;
        font-size: $fsXs;
    }

    .subs {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        padding: $gapMd $pagePadding $gapSm;
        background: #fff;
    }

    .subs__item {
        width: calc((100% - 40rpx) / 3);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10rpx;

        &--press {
            opacity: 0.75;
        }
    }

    .subs__pic {
        width: 140rpx;
        height: 140rpx;
        border-radius: $radiusSm;
        background: #f2f3f6;
    }

    .subs__name {
        width: 100%;
        text-align: center;
        font-size: $fsXs;
        color: $inkColor2;
    }

    .grid {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        padding: 0 $pagePadding;
    }

    .grid__cell {
        width: calc((100% - 20rpx) / 2);
    }

    .cat__bottom {
        height: 40rpx;
    }
</style>
