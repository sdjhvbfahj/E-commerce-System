<template>
    <view class="m-empty">
        <image class="m-empty__pic" src="/static/icons/empty.png" mode="aspectFit" />
        <text class="m-empty__text">{{ text }}</text>
        <text v-if="tip" class="m-empty__tip">{{ tip }}</text>
        <view v-if="actionText" class="m-btn m-btn--plain m-empty__action" hover-class="m-btn--press" @click="$emit('action')">
            <text>{{ actionText }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
    /** 空态：图 + 文案 + 可选操作按钮 */
    withDefaults(
        defineProps<{
            text: string
            tip?: string
            actionText?: string
        }>(),
        { tip: '', actionText: '' }
    )

    defineEmits<{ (e: 'action'): void }>()
</script>

<style scoped lang="scss">
    .m-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 120rpx $pagePadding 80rpx;
    }

    .m-empty__pic {
        width: 240rpx;
        height: 240rpx;
        opacity: 0.9;
    }

    .m-empty__text {
        margin-top: $gapMd;
        font-size: $fsMd;
        color: $inkColor2;
    }

    .m-empty__tip {
        margin-top: $gapXs;
        font-size: $fsSm;
        color: $inkColor3;
    }

    .m-empty__action {
        margin-top: $gapLg;
        padding: 0 $gapLg;
    }
</style>
