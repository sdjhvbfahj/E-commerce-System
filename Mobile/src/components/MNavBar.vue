<template>
    <view class="m-nav">
        <!-- 固定层 -->
        <view class="m-nav__fixed" :class="{ 'm-nav__fixed--solid': solid }" :style="fixedStyle">
            <view :style="{ height: statusBarHeight + 'px' }"></view>
            <view class="m-nav__bar" :style="barStyle">
                <view v-if="showBack" class="m-nav__back" hover-class="m-nav__back--press" @click="goBack">
                    <view class="chevron chevron--left"></view>
                </view>
                <view class="m-nav__center">
                    <slot>
                        <text class="m-nav__title">{{ title }}</text>
                    </slot>
                </view>
                <view class="m-nav__right">
                    <slot name="right"></slot>
                </view>
            </view>
        </view>
        <!-- 占位层：让页面内容从导航栏下方开始（先按计算值，渲染后按实测值修正） -->
        <view :style="{ height: placeholderHeight + 'px' }"></view>
    </view>
</template>

<script setup lang="ts">
    /**
     * 自定义导航栏（uni 自带导航栏在 App 上样式不可控，需要贴边内容的页面用这个）
     * - solid：白底 + 细分割线；不传则透明，页面自己铺背景
     */
    import { computed, getCurrentInstance, nextTick, onMounted, ref } from 'vue'
    import { useNavBar } from '@/utils/nav.ts'

    const props = withDefaults(
        defineProps<{
            title?: string
            showBack?: boolean
            solid?: boolean
        }>(),
        { title: '', showBack: false, solid: false }
    )

    const { statusBarHeight, barHeight, rightInset, navTotalHeight } = useNavBar()

    const fixedStyle = computed(() => ({ paddingTop: `${statusBarHeight.value}px` }))

    /**
     * 小程序端右上角是原生胶囊按钮，内容区要给它让位，
     * 否则搜索框 / 标题会钻到胶囊底下（看起来像被挡住）
     */
    const barStyle = computed(() => {
        const style: Record<string, string> = { height: `${barHeight.value}px` }
        if (rightInset.value > 0) {
            style.paddingRight = `${rightInset.value}px`
        }
        return style
    })

    /**
     * 占位高度先用「状态栏 + 导航栏」算出来的值，
     * 组件挂载后再量一次真实高度：不同平台（尤其小程序）状态栏/胶囊差异大，
     * 量一次可以彻底避免「固定导航栏压住下面内容」。
     */
    const placeholderHeight = ref(navTotalHeight.value)

    function measure() {
        const instance = getCurrentInstance()
        const query = instance
            ? uni.createSelectorQuery().in(instance.proxy as any)
            : uni.createSelectorQuery()
        query
            .select('.m-nav__fixed')
            .boundingClientRect((rect: any) => {
                const height = Number(rect?.height ?? 0)
                if (height > 0) placeholderHeight.value = Math.ceil(height)
            })
            .exec()
    }

    onMounted(() => {
        nextTick(() => {
            // 等首屏布局稳定再量（小程序里同步量可能拿到 0）
            setTimeout(measure, 60)
        })
    })

    function goBack() {
        const pages = getCurrentPages()
        if (pages.length > 1) {
            uni.navigateBack()
        } else {
            uni.switchTab({ url: '/pages/home/index' })
        }
    }
</script>

<style scoped lang="scss">
    .m-nav__fixed {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        background: transparent;

        &--solid {
            background: #fff;
            /* 用内阴影画分割线：不占高度，占位层实测值就不会差 1px */
            box-shadow: inset 0 -1px 0 $lineColor;
        }
    }

    .m-nav__bar {
        display: flex;
        align-items: center;
        padding: 0 $pagePadding;
    }

    .m-nav__back {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56rpx;
        height: 56rpx;
        margin-left: -12rpx;

        &--press {
            opacity: 0.5;
        }
    }

    /* 纯 CSS 箭头，不依赖图标字体（App / H5 都能画） */
    .chevron {
        width: 20rpx;
        height: 20rpx;
        border-top: 4rpx solid $inkColor;
        border-left: 4rpx solid $inkColor;

        &--left {
            transform: rotate(-45deg);
            margin-left: 6rpx;
        }

        &--right {
            transform: rotate(135deg);
        }
    }

    .m-nav__center {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .m-nav__title {
        font-size: $fsMd;
        font-weight: 600;
        color: $inkColor;
    }

    .m-nav__right {
        min-width: 56rpx;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
</style>
