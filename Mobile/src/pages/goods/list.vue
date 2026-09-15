<template>
    <view class="list m-page">
        <!-- 吸顶区：兄弟二级分类 + 排序 -->
        <view class="head">
            <scroll-view v-if="siblings.length > 1" class="chips" scroll-x :show-scrollbar="false">
                <view class="chips__inner">
                    <view
                        v-for="item in siblings"
                        :key="item.id"
                        class="chips__item"
                        :class="{ 'chips__item--active': item.id === currentId }"
                        @click="switchSub(item.id, item.name)"
                    >
                        <text>{{ item.name }}</text>
                    </view>
                </view>
            </scroll-view>

            <view class="sort">
                <view
                    v-for="item in SORTS"
                    :key="item.field"
                    class="sort__item"
                    :class="{ 'sort__item--active': item.field === sortField }"
                    @click="changeSort(item.field)"
                >
                    <text>{{ item.label }}</text>
                </view>
            </view>
        </view>

        <view v-if="list.length" class="grid">
            <view v-for="item in list" :key="item.id" class="grid__cell">
                <MGoodsCard :item="item" />
            </view>
        </view>

        <MEmpty v-else-if="!loading" text="这个分类下还没有商品" tip="换个分类看看吧" />

        <MLoadMore :status="status" @load="loadMore" />
    </view>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
    import { getSubCategoryAPI, getSubCategoryFilterAPI } from '@/apis/subCategory.ts'
    import { useCategoryStore } from '@/stores/categoryStore.ts'

    const SORTS = [
        { label: '综合', field: 'publishTime' },
        { label: '销量', field: 'orderNum' },
        { label: '人气', field: 'evaluateNum' },
    ]

    const categoryStore = useCategoryStore()

    const currentId = ref('')
    const currentName = ref('')
    const siblings = ref<{ id: string; name: string }[]>([])
    const sortField = ref('publishTime')
    const list = ref<any[]>([])
    const page = ref(0)
    const status = ref<'more' | 'loading' | 'nomore'>('more')
    const loading = ref(false)

    async function loadMore(reset = false) {
        if (status.value === 'loading') return
        if (!reset && status.value === 'nomore') return
        if (reset) {
            page.value = 0
            list.value = []
            status.value = 'more'
        }
        status.value = 'loading'
        loading.value = true
        page.value += 1
        try {
            const result = (await getSubCategoryAPI({
                categoryId: currentId.value,
                page: page.value,
                pageSize: 10,
                sortField: sortField.value,
            })) as any
            const data = result.result
            const items: any[] = data?.items ?? []
            list.value = page.value === 1 ? items : [...list.value, ...items]
            const total = Number(data?.counts ?? list.value.length)
            status.value = list.value.length >= total || items.length === 0 ? 'nomore' : 'more'
        } finally {
            loading.value = false
        }
    }

    function changeSort(field: string) {
        if (sortField.value === field) return
        sortField.value = field
        loadMore(true)
    }

    async function switchSub(id: string, name: string) {
        currentId.value = id
        currentName.value = name
        uni.setNavigationBarTitle({ title: name })
        await loadMore(true)
    }

    async function loadFilter() {
        if (!currentId.value) return
        try {
            const result = (await getSubCategoryFilterAPI(currentId.value)) as any
            siblings.value = result.result?.categories ?? []
        } catch {
            siblings.value = []
        }
    }

    onLoad(async (query) => {
        const subId = String(query?.subId ?? '')
        const catId = String(query?.catId ?? '')
        const name = query?.name ? decodeURIComponent(String(query.name)) : ''

        if (subId) {
            currentId.value = subId
            currentName.value = name || '商品列表'
            await loadFilter()
        } else {
            currentId.value = catId
            await categoryStore.getNavList()
            const hit = categoryStore.navList.find((item) => item.id === catId)
            currentName.value = name || hit?.name || '商品列表'
            siblings.value = []
        }
        uni.setNavigationBarTitle({ title: currentName.value })
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
    .head {
        position: sticky;
        top: 0;
        z-index: 10;
        background: #fff;
    }

    .chips {
        white-space: nowrap;
    }

    .chips__inner {
        display: inline-flex;
        gap: $gapSm;
        padding: $gapSm $pagePadding;
    }

    .chips__item {
        flex-shrink: 0;
        padding: 0 $gapMd;
        height: 56rpx;
        display: flex;
        align-items: center;
        border-radius: 28rpx;
        background: #f4f5f8;
        color: $inkColor2;
        font-size: $fsSm;

        &--active {
            background: $brandColorSoft;
            color: $brandColor;
            font-weight: 500;
        }
    }

    .sort {
        display: flex;
        align-items: center;
        height: 84rpx;
        padding: 0 $pagePadding;
        background: #fff;
        border-bottom: 1px solid $lineColor;
        gap: $gapLg;
    }

    .sort__item {
        position: relative;
        font-size: $fsBase;
        color: $inkColor2;

        &--active {
            color: $brandColor;
            font-weight: 600;

            &::after {
                content: '';
                position: absolute;
                left: 50%;
                bottom: -12rpx;
                width: 32rpx;
                height: 4rpx;
                margin-left: -16rpx;
                border-radius: 2rpx;
                background: $brandColor;
            }
        }
    }

    .grid {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        padding: $gapMd $pagePadding 0;
    }

    .grid__cell {
        width: calc((100% - 20rpx) / 2);
    }
</style>
