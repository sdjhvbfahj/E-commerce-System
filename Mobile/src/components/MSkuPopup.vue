<template>
    <view v-if="visible" class="sku">
        <view class="sku__mask" @click="close"></view>
        <view class="sku__panel" @touchmove.stop.prevent="noop">
            <!-- 头部：图 + 价格 -->
            <view class="sku__head">
                <image class="sku__pic" :src="currentPicture" mode="aspectFill" />
                <view class="sku__head-info">
                    <text class="m-price">
                        <text class="m-price__symbol">¥</text>
                        <text class="m-price__num">{{ priceText }}</text>
                        <text v-if="showOldPrice" class="m-price--old">¥{{ oldPriceText }}</text>
                    </text>
                    <text class="sku__stock">库存 {{ stock }} 件</text>
                    <text class="sku__picked">{{ selectedText }}</text>
                </view>
                <view class="sku__close" hover-class="sku__close--press" @click="close">
                    <view class="cross cross--a"></view>
                    <view class="cross cross--b"></view>
                </view>
            </view>

            <!-- 规格 -->
            <scroll-view class="sku__body" scroll-y>
                <view v-for="spec in specs" :key="spec.id" class="sku__spec">
                    <text class="sku__spec-name">{{ spec.name }}</text>
                    <view class="sku__values">
                        <view
                            v-for="value in spec.values"
                            :key="value.name"
                            class="sku__value"
                            :class="{
                                'sku__value--active': selected[spec.name] === value.name,
                                'sku__value--disabled': isDisabled(spec.name, value.name),
                            }"
                            @click="choose(spec.name, value.name)"
                        >
                            <image v-if="value.picture" class="sku__value-pic" :src="value.picture" mode="aspectFill" />
                            <text>{{ value.name }}</text>
                        </view>
                    </view>
                </view>

                <view class="sku__spec sku__spec--count">
                    <text class="sku__spec-name">数量</text>
                    <MCounter v-model="count" :max="stock" size="sm" />
                </view>
            </scroll-view>

            <!-- 底部操作 -->
            <view class="sku__actions">
                <view class="m-btn m-btn--plain sku__btn" hover-class="m-btn--press" @click="onAddCart">加入购物车</view>
                <view class="m-btn sku__btn" hover-class="m-btn--press" @click="onBuy">立即购买</view>
            </view>
            <view class="sku__safe"></view>
        </view>
    </view>
</template>

<script setup lang="ts">
    /**
     * 规格选择弹层（移动端特有：PC 是页面内联面板，这里改成底部弹出）
     * 不可达组合会置灰，逻辑与用户端的 XtxSku 一致：把「其它已选规格」固定住，
     * 再看有没有 SKU 同时满足「其它已选 + 当前这个值」。
     */
    import { computed, reactive, ref, watch } from 'vue'
    import { toast } from '@/utils/auth.ts'

    interface SpecValue {
        name: string
        picture?: string
    }
    interface Spec {
        id: string
        name: string
        values: SpecValue[]
    }
    interface SkuSpec {
        name: string
        valueName: string
    }
    interface Sku {
        id: string
        inventory: number
        price: string
        oldPrice: string
        specs: SkuSpec[]
    }
    interface GoodsLike {
        id: string
        name: string
        price: string
        oldPrice: string
        mainPictures: string[]
        specs: Spec[]
        skus: Sku[]
    }

    const props = withDefaults(
        defineProps<{
            visible: boolean
            goods: GoodsLike | null
            mode?: 'cart' | 'buy'
        }>(),
        { mode: 'cart' }
    )

    const emit = defineEmits<{
        (e: 'close'): void
        (e: 'confirm', payload: { sku: Sku; count: number; mode: 'cart' | 'buy' }): void
    }>()

    const selected = reactive<Record<string, string>>({})
    const count = ref(1)

    const specs = computed<Spec[]>(() => props.goods?.specs ?? [])
    const skus = computed<Sku[]>(() => props.goods?.skus ?? [])

    /** 打开弹层时清空选择，避免上次的残留 */
    watch(
        () => props.visible,
        (open) => {
            if (!open) return
            Object.keys(selected).forEach((key) => delete selected[key])
            count.value = 1
            // 只有一个规格时默认选上，少一次点击
            const only = specs.value.length === 1 ? specs.value[0] : undefined
            const first = only?.values?.[0]
            if (only && first) selected[only.name] = first.name
        },
        { immediate: true }
    )

    const currentSku = computed<Sku | undefined>(() => {
        if (!props.goods || specs.value.length === 0) return undefined
        const complete = specs.value.every((spec) => selected[spec.name])
        if (!complete) return undefined
        return skus.value.find((sku) =>
            specs.value.every((spec) => sku.specs.some((item) => item.name === spec.name && item.valueName === selected[spec.name]))
        )
    })

    const priceText = computed(() => {
        if (currentSku.value) return currentSku.value.price
        const list = skus.value.map((sku) => Number(sku.price))
        if (!list.length) return props.goods?.price ?? '0.00'
        const min = Math.min(...list)
        const max = Math.max(...list)
        return min === max ? min.toFixed(2) : `${min.toFixed(2)} ~ ${max.toFixed(2)}`
    })

    const oldPriceText = computed(() => currentSku.value?.oldPrice ?? props.goods?.oldPrice ?? '')
    const showOldPrice = computed(() => Number(oldPriceText.value) > Number(currentSku.value?.price ?? props.goods?.price ?? 0))

    /** 头部主图：优先用已选规格值的图片（如颜色款），否则用商品主图 */
    const currentPicture = computed(() => {
        for (const spec of specs.value) {
            const valueName = selected[spec.name]
            if (!valueName) continue
            const value = spec.values.find((item) => item.name === valueName)
            if (value?.picture) return value.picture
        }
        return props.goods?.mainPictures?.[0] ?? ''
    })

    const stock = computed(() => {
        if (currentSku.value) return Math.max(0, currentSku.value.inventory)
        const list = skus.value.map((sku) => sku.inventory)
        return list.length ? Math.max(...list) : 0
    })

    const selectedText = computed(() => {
        const picked = specs.value.filter((spec) => selected[spec.name]).map((spec) => selected[spec.name])
        const missing = specs.value.filter((spec) => !selected[spec.name]).map((spec) => spec.name)
        if (!specs.value.length) return '默认规格'
        if (missing.length) {
            const text = picked.length ? `已选 ${picked.join(' / ')}；` : ''
            return `${text}请选择 ${missing.join('、')}`
        }
        return `已选 ${picked.join(' / ')}`
    })

    function isDisabled(specName: string, valueName: string): boolean {
        const others = Object.entries(selected).filter(([key, value]) => key !== specName && Boolean(value))
        return !skus.value.some((sku) => {
            const hitCurrent = sku.specs.some((item) => item.name === specName && item.valueName === valueName)
            if (!hitCurrent) return false
            return others.every(([key, value]) => sku.specs.some((item) => item.name === key && item.valueName === value))
        })
    }

    function choose(specName: string, valueName: string) {
        if (isDisabled(specName, valueName)) return
        if (selected[specName] === valueName) {
            delete selected[specName]
        } else {
            selected[specName] = valueName
        }
        count.value = 1
    }

    function close() {
        emit('close')
    }

    function noop() {
        /* 阻止弹层滚动穿透 */
    }

    function confirm(mode: 'cart' | 'buy') {
        if (specs.value.some((spec) => !selected[spec.name])) {
            const missing = specs.value.filter((spec) => !selected[spec.name]).map((spec) => spec.name)
            toast(`请选择 ${missing.join('、')}`)
            return
        }
        if (!currentSku.value) {
            toast('该规格暂时无货')
            return
        }
        if (stock.value <= 0) {
            toast('该规格已售罄')
            return
        }
        emit('confirm', { sku: currentSku.value, count: count.value, mode })
    }

    function onAddCart() {
        confirm('cart')
    }

    function onBuy() {
        confirm('buy')
    }
</script>

<style scoped lang="scss">
    .sku {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100;
    }

    .sku__mask {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(20, 24, 34, 0.45);
        animation: fade-in 0.2s ease;
    }

    .sku__panel {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        border-radius: $radiusLg $radiusLg 0 0;
        animation: slide-up 0.24s ease;
        max-height: 82vh;
        display: flex;
        flex-direction: column;
    }

    .sku__head {
        position: relative;
        display: flex;
        gap: $gapMd;
        padding: $gapLg $pagePadding $gapMd;
        border-bottom: 1px solid $lineColor;
    }

    .sku__pic {
        width: 180rpx;
        height: 180rpx;
        border-radius: $radiusSm;
        background: #f4f5f8;
        margin-top: -48rpx;
        border: 4rpx solid #fff;
        box-shadow: $shadowSm;
    }

    .sku__head-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 6rpx;
    }

    .sku__stock {
        color: $inkColor3;
        font-size: $fsXs;
    }

    .sku__picked {
        color: $inkColor2;
        font-size: $fsSm;
    }

    .sku__close {
        position: absolute;
        right: $pagePadding;
        top: $gapMd;
        width: 48rpx;
        height: 48rpx;

        &--press {
            opacity: 0.5;
        }
    }

    .cross {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 28rpx;
        height: 3rpx;
        margin-left: -14rpx;
        background: $inkColor3;

        &--a {
            transform: rotate(45deg);
        }

        &--b {
            transform: rotate(-45deg);
        }
    }

    .sku__body {
        flex: 1;
        max-height: 56vh;
        padding: $gapMd $pagePadding 0;
    }

    .sku__spec {
        margin-bottom: $gapLg;

        &--count {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: $gapMd;
        }
    }

    .sku__spec-name {
        display: block;
        margin-bottom: $gapSm;
        font-size: $fsSm;
        color: $inkColor2;
    }

    .sku__values {
        display: flex;
        flex-wrap: wrap;
        gap: $gapSm;
    }

    .sku__value {
        display: flex;
        align-items: center;
        gap: 8rpx;
        height: 64rpx;
        padding: 0 $gapMd;
        border-radius: 32rpx;
        background: #f4f5f8;
        color: $inkColor;
        font-size: $fsSm;
        border: 2rpx solid transparent;

        &--active {
            color: $brandColor;
            background: $brandColorSoft;
            border-color: $brandColor;
            font-weight: 500;
        }

        &--disabled {
            color: #c3c7d1;
            text-decoration: line-through;
        }
    }

    .sku__value-pic {
        width: 40rpx;
        height: 40rpx;
        border-radius: 6rpx;
    }

    .sku__actions {
        display: flex;
        gap: $gapMd;
        padding: $gapSm $pagePadding 0;
    }

    .sku__btn {
        flex: 1;
    }

    .sku__safe {
        height: 24rpx;
        @include safe-bottom(24rpx);
    }

    @keyframes slide-up {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
