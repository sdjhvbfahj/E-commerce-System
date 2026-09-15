<template>
    <view class="m-counter" :class="{ 'm-counter--sm': size === 'sm' }">
        <view class="m-counter__btn" :class="{ 'm-counter__btn--off': value <= min }" @click="step(-1)">
            <view class="line line--h"></view>
        </view>
        <input class="m-counter__input" type="number" :value="String(value)" @input="onInput" />
        <view class="m-counter__btn" :class="{ 'm-counter__btn--off': max > 0 && value >= max }" @click="step(1)">
            <view class="line line--h"></view>
            <view class="line line--v"></view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    /**
     * 数量步进器
     * 加减号用 CSS 线拼，不依赖图标字体；输入框允许直接键入（失焦时校正）
     */
    const props = withDefaults(
        defineProps<{
            modelValue: number
            min?: number
            max?: number
            size?: 'md' | 'sm'
        }>(),
        { min: 1, max: 0, size: 'md' }
    )

    const emit = defineEmits<{ (e: 'update:modelValue', value: number): void }>()

    /** 模板里用 value 读写，内部还是标准的 modelValue */
    const value = computed(() => props.modelValue)

    function clamp(value: number) {
        let next = Math.max(props.min, Math.floor(Number(value) || props.min))
        if (props.max > 0) next = Math.min(props.max, next)
        return next
    }

    function step(delta: number) {
        const next = clamp(props.modelValue + delta)
        if (next !== props.modelValue) emit('update:modelValue', next)
    }

    function onInput(event: any) {
        const raw = event?.detail?.value
        if (raw === '' || raw === undefined) return
        emit('update:modelValue', clamp(raw))
    }
</script>

<style scoped lang="scss">
    .m-counter {
        display: flex;
        align-items: center;
        height: 56rpx;
        border-radius: $radiusXs;
        overflow: hidden;
        background: #f4f5f8;

        &--sm {
            height: 48rpx;
            transform: scale(0.96);
        }
    }

    .m-counter__btn {
        /* 必须定位：加号那一竖是绝对定位的，父级不定位就会跑到卡片中间，
           看起来就是「一个消不掉的数字 1」压在数量上 */
        position: relative;
        width: 60rpx;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        &--off {
            opacity: 0.28;
        }
    }

    .line {
        position: relative;
        background: $inkColor2;
        border-radius: 2rpx;

        &--h {
            width: 20rpx;
            height: 3rpx;
        }

        &--v {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 3rpx;
            height: 20rpx;
            margin-left: -1.5rpx;
            margin-top: -10rpx;
        }
    }

    .m-counter__input {
        width: 76rpx;
        height: 100%;
        text-align: center;
        font-size: $fsBase;
        color: $inkColor;
        background: #fff;
    }
</style>
