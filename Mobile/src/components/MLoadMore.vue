<template>
    <view class="m-loadmore">
        <view v-if="status === 'loading'" class="m-loadmore__loading">
            <view class="spinner"></view>
            <text>正在加载</text>
        </view>
        <text v-else-if="status === 'nomore'">没有更多了</text>
        <view v-else class="m-loadmore__more" hover-class="m-loadmore__more--press" @click="$emit('load')">
            <text>{{ text }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
    /** 触底/加载更多：H5 与 App 通用（页面用 onReachBottom 驱动，点一下也能加载） */
    withDefaults(
        defineProps<{
            status: 'more' | 'loading' | 'nomore'
            text?: string
        }>(),
        { text: '点击加载更多' }
    )

    defineEmits<{ (e: 'load'): void }>()
</script>

<style scoped lang="scss">
    .m-loadmore {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: $gapLg 0 $gapMd;
        color: $inkColor3;
        font-size: $fsSm;
    }

    .m-loadmore__loading {
        display: flex;
        align-items: center;
        gap: $gapSm;
    }

    .spinner {
        width: 24rpx;
        height: 24rpx;
        border: 3rpx solid $lineColor;
        border-top-color: $brandColor;
        border-radius: 50%;
        animation: m-spin 0.7s linear infinite;
    }

    .m-loadmore__more {
        padding: 8rpx 28rpx;
        border: 1px solid $lineColor;
        border-radius: 4rpx;

        &--press {
            background: #f4f5f8;
        }
    }

    @keyframes m-spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
