<template>
    <view class="m-sec">
        <view class="m-sec__left">
            <text class="m-sec__title">{{ title }}</text>
            <text v-if="sub" class="m-sec__sub">{{ sub }}</text>
        </view>
        <view v-if="more" class="m-sec__more" hover-class="m-sec__more--press" @click="$emit('more')">
            <text>{{ moreText }}</text>
            <view class="chevron chevron--right"></view>
        </view>
    </view>
</template>

<script setup lang="ts">
    /** 区块标题：左侧主色竖条标题 + 右侧「更多」 */
    withDefaults(
        defineProps<{
            title: string
            sub?: string
            more?: boolean
            moreText?: string
        }>(),
        { sub: '', more: false, moreText: '更多' }
    )

    defineEmits<{ (e: 'more'): void }>()
</script>

<style scoped lang="scss">
    .m-sec {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: $gapLg $pagePadding $gapMd;
    }

    .m-sec__left {
        display: flex;
        align-items: baseline;
        gap: $gapSm;
        min-width: 0;
    }

    .m-sec__title {
        /* 先写自身声明再引入 mixin，避免 sass 的 mixed-decls 提示 */
        line-height: 1.2;
        @include section-title;
    }

    .m-sec__sub {
        @include ellipsis;
        color: $inkColor3;
        font-size: $fsSm;
    }

    .m-sec__more {
        display: flex;
        align-items: center;
        gap: 8rpx;
        color: $inkColor3;
        font-size: $fsSm;

        &--press {
            opacity: 0.6;
        }
    }

    .chevron {
        width: 14rpx;
        height: 14rpx;
        border-top: 3rpx solid $inkColor3;
        border-left: 3rpx solid $inkColor3;

        &--right {
            transform: rotate(135deg);
        }
    }
</style>
