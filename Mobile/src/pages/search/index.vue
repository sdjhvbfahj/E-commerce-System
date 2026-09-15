<template>
    <view class="search-page m-page">
        <!-- 顶部搜索条 -->
        <view class="bar">
            <view class="bar__status" :style="{ height: statusBarHeight + 'px' }"></view>
            <view class="bar__row">
                <view class="bar__input">
                    <view class="bar__icon">
                        <view class="bar__circle"></view>
                        <view class="bar__handle"></view>
                    </view>
                    <input
                        class="bar__field"
                        v-model="keyword"
                        type="text"
                        :focus="autoFocus"
                        confirm-type="search"
                        placeholder="搜索商品、分类"
                        placeholder-class="bar__ph"
                        @input="onKeywordInput"
                        @confirm="searchNow"
                    />
                    <view v-if="keyword" class="bar__clear" @click="clearKeyword">
                        <view class="cross cross--a"></view>
                        <view class="cross cross--b"></view>
                    </view>
                </view>
                <text class="bar__cancel" @click="goBack">取消</text>
            </view>
        </view>

        <!-- 搜索前：历史 + 热门 -->
        <template v-if="!searched">
            <view v-if="history.length" class="m-block hist">
                <view class="hist__head">
                    <text class="hist__title">搜索历史</text>
                    <text class="hist__clear" @click="clearHistory">清空</text>
                </view>
                <view class="tags">
                    <view v-for="word in history" :key="word" class="tags__item" @click="doSearch(word)">
                        <text>{{ word }}</text>
                    </view>
                </view>
            </view>

            <view class="m-block hist">
                <view class="hist__head">
                    <text class="hist__title">大家都在搜</text>
                </view>
                <view class="tags">
                    <view
                        v-for="(word, index) in HOT_WORDS"
                        :key="word"
                        class="tags__item"
                        :class="{ 'tags__item--hot': index < 3 }"
                        @click="doSearch(word)"
                    >
                        <text>{{ word }}</text>
                    </view>
                </view>
            </view>
        </template>

        <!-- 搜索后 -->
        <template v-else>
            <scroll-view v-if="categories.length" class="cats" scroll-x :show-scrollbar="false">
                <view class="cats__inner">
                    <view v-for="cat in categories" :key="cat.id + cat.type" class="cats__item" @click="goCategory(cat)">
                        <text class="cats__tag">{{ cat.type === 'cat' ? '分类' : '品类' }}</text>
                        <text>{{ cat.name }}</text>
                    </view>
                </view>
            </scroll-view>

            <view v-if="items.length" class="result">
                <text class="result__count">共 {{ counts }} 件相关商品</text>
            </view>

            <view v-if="items.length" class="grid">
                <view v-for="item in items" :key="item.id" class="grid__cell">
                    <MGoodsCard :item="item" />
                </view>
            </view>

            <template v-else-if="status !== 'loading'">
                <MEmpty text="没有找到相关商品" :tip="`试试「${suggests.join('、')}」`" action-text="重新搜索" @action="resetSearch" />
            </template>

            <MLoadMore v-if="items.length" :status="status" @load="loadMore" />
        </template>
    </view>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { onLoad, onReachBottom } from '@dcloudio/uni-app'
    import { getSearchAPI } from '@/apis/search.ts'
    import { debounce } from '@/utils/debounce.ts'
    import { storage } from '@/utils/storage.ts'
    import { useNavBar } from '@/utils/nav.ts'
    import { useCategoryStore } from '@/stores/categoryStore.ts'

    const HOT_WORDS = ['车厘子', '蓝牙耳机', '收纳箱', '瑜伽垫', '婴儿推车', '扫地机器人']
    const HISTORY_KEY = 'eshop621-search-history'
    const MAX_HISTORY = 8

    const { statusBarHeight } = useNavBar()
    const categoryStore = useCategoryStore()

    const keyword = ref('')
    const searched = ref(false)
    const autoFocus = ref(true)
    const history = ref<string[]>([])
    const items = ref<any[]>([])
    const categories = ref<any[]>([])
    const suggests = ref<string[]>([])
    const counts = ref(0)
    const page = ref(0)
    const status = ref<'more' | 'loading' | 'nomore'>('more')

    function readHistory() {
        try {
            const raw = storage.getItem(HISTORY_KEY)
            history.value = raw ? (JSON.parse(raw) as string[]) : []
        } catch {
            history.value = []
        }
    }

    function writeHistory(word: string) {
        const next = [word, ...history.value.filter((item) => item !== word)].slice(0, MAX_HISTORY)
        history.value = next
        storage.setItem(HISTORY_KEY, JSON.stringify(next))
    }

    function clearHistory() {
        history.value = []
        storage.removeItem(HISTORY_KEY)
    }

    /**
     * 执行搜索
     * record = true 时写入搜索历史（只有「回车 / 点热词 / 点历史」才算用户明确的搜索行为），
     * 输入过程中的自动搜索不记历史，否则历史里会堆一堆「车」「车厘」这种半截词
     */
    async function doSearch(word: string, record = true) {
        const value = word.trim()
        if (!value) return
        keyword.value = value
        autoFocus.value = false
        searched.value = true
        page.value = 0
        items.value = []
        if (record) writeHistory(value)
        await loadMore(true)
    }

    /** 输入即搜（防抖 320ms）：停下来就自动查，不用非按回车 */
    const searchAfterInput = debounce((value: string) => {
        const text = value.trim()
        if (!text) {
            // 清空了就回到「历史 + 热词」视图，并取消这次搜索
            searched.value = false
            items.value = []
            categories.value = []
            return
        }
        doSearch(text, false)
    }, 320)

    function onKeywordInput(event: any) {
        const value = String(event?.detail?.value ?? '')
        keyword.value = value
        searchAfterInput(value)
    }

    /** 回车：立刻搜，并记入历史 */
    function searchNow() {
        searchAfterInput.cancel()
        doSearch(keyword.value, true)
    }

    function clearKeyword() {
        keyword.value = ''
        searchAfterInput.cancel()
        searched.value = false
        items.value = []
        categories.value = []
    }

    async function loadMore(reset = false) {
        if (status.value === 'loading') return
        if (!reset && status.value === 'nomore') return
        if (reset) {
            page.value = 0
            status.value = 'more'
        }
        status.value = 'loading'
        page.value += 1
        const result = (await getSearchAPI({ keyword: keyword.value, page: page.value, pageSize: 10 })) as any
        const data = result.result
        const list: any[] = data?.items ?? []
        items.value = page.value === 1 ? list : [...items.value, ...list]
        categories.value = data?.categories ?? []
        suggests.value = data?.suggests ?? []
        counts.value = Number(data?.counts ?? 0)
        status.value = items.value.length >= counts.value || list.length === 0 ? 'nomore' : 'more'
    }

    function resetSearch() {
        searched.value = false
        keyword.value = ''
        autoFocus.value = true
        items.value = []
    }

    function goCategory(cat: { id: string; name: string; type: string }) {
        if (cat.type === 'cat') {
            categoryStore.activeId = cat.id
            uni.switchTab({ url: '/pages/category/index' })
            return
        }
        uni.navigateTo({ url: `/pages/goods/list?subId=${cat.id}&name=${encodeURIComponent(cat.name)}` })
    }

    function goBack() {
        uni.navigateBack()
    }

    onLoad((query) => {
        readHistory()
        const initial = query?.keyword ? decodeURIComponent(String(query.keyword)) : ''
        if (initial) doSearch(initial)
    })

    onReachBottom(() => {
        if (searched.value) loadMore()
    })
</script>

<style scoped lang="scss">
    .search-page {
        background: $bgColor;
    }

    .bar {
        position: sticky;
        top: 0;
        z-index: 20;
        background: #fff;
        padding-bottom: $gapSm;
    }

    .bar__row {
        display: flex;
        align-items: center;
        gap: $gapMd;
        height: 88rpx;
        padding: 0 $pagePadding;
    }

    .bar__input {
        flex: 1;
        display: flex;
        align-items: center;
        gap: $gapSm;
        height: 66rpx;
        padding: 0 $gapMd;
        border-radius: 6rpx;
        background: #f2f3f6;
    }

    .bar__icon {
        position: relative;
        width: 30rpx;
        height: 30rpx;
        flex-shrink: 0;
    }

    .bar__circle {
        width: 22rpx;
        height: 22rpx;
        border: 3rpx solid $inkColor3;
        border-radius: 50%;
    }

    .bar__handle {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 12rpx;
        height: 3rpx;
        background: $inkColor3;
        transform: rotate(45deg);
    }

    .bar__field {
        flex: 1;
        min-width: 0;
        font-size: $fsSm;
        color: $inkColor;
    }

    .bar__ph {
        color: $inkColor3;
    }

    .bar__clear {
        position: relative;
        width: 36rpx;
        height: 36rpx;
        flex-shrink: 0;
    }

    .cross {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 22rpx;
        height: 3rpx;
        margin-left: -11rpx;
        background: $inkColor3;

        &--a {
            transform: rotate(45deg);
        }

        &--b {
            transform: rotate(-45deg);
        }
    }

    .bar__cancel {
        font-size: $fsBase;
        color: $inkColor2;
        flex-shrink: 0;
    }

    /* ---------- 历史 / 热词 ---------- */
    .hist {
        padding: $gapLg $pagePadding;
    }

    .hist__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: $gapMd;
    }

    .hist__title {
        font-size: $fsMd;
        font-weight: 600;
        color: $inkColor;
    }

    .hist__clear {
        font-size: $fsSm;
        color: $inkColor3;
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: $gapSm;
    }

    .tags__item {
        padding: 0 $gapMd;
        height: 60rpx;
        display: flex;
        align-items: center;
        border-radius: 4rpx;
        background: #fff;
        color: $inkColor2;
        font-size: $fsSm;

        &--hot {
            color: $brandColor;
            background: $brandColorSoft;
        }
    }

    /* ---------- 结果 ---------- */
    .cats {
        white-space: nowrap;
        background: #fff;
        border-bottom: 1px solid $lineColor;
    }

    .cats__inner {
        display: inline-flex;
        gap: $gapSm;
        padding: $gapSm $pagePadding;
    }

    .cats__item {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 8rpx;
        height: 60rpx;
        padding: 0 $gapMd;
        border-radius: 4rpx;
        background: #f4f5f8;
        font-size: $fsSm;
        color: $inkColor;
    }

    .cats__tag {
        font-size: $fsXs;
        color: $inkColor3;
    }

    .result {
        padding: $gapMd $pagePadding 0;
    }

    .result__count {
        font-size: $fsSm;
        color: $inkColor3;
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
