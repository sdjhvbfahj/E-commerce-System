import { computed, ref } from 'vue'

/**
 * 自定义导航栏尺寸
 * ---------------------------------------------------------------------------
 * 高度单位是 px（状态栏高度本身就是 px）。
 * 小程序端右上角有原生「胶囊按钮」，间距和高度都比 44px 大，如果按 44px 写死，
 * 会出现「导航栏压住下面内容 / 搜索框钻到胶囊底下」的问题，所以优先用
 * uni.getMenuButtonBoundingClientRect() 反推导航栏高度与右侧需要避让的宽度。
 */
export function useNavBar() {
    const systemInfo = uni.getSystemInfoSync()
    const statusBarHeight = ref(Number(systemInfo.statusBarHeight ?? 0))

    let barHeightValue = 44
    let rightInsetValue = 0

    // #ifdef MP-WEIXIN
    // 微信小程序右上角有原生胶囊按钮，导航栏高度和右侧避让宽度都要按它来算，
    // 否则会出现「导航栏压住下面内容」「搜索框钻到胶囊底下」的问题
    try {
        const rect = uni.getMenuButtonBoundingClientRect()
        if (rect && rect.height > 0) {
            barHeightValue = (rect.top - statusBarHeight.value) * 2 + rect.height
            const windowWidth = Number(systemInfo.windowWidth ?? systemInfo.screenWidth ?? 0)
            if (windowWidth > 0) {
                rightInsetValue = Math.max(0, windowWidth - rect.left + 8)
            }
        }
    } catch {
        /* 拿不到胶囊信息时就用默认的 44px */
    }
    // #endif

    const barHeight = ref(barHeightValue)
    /** 内容区需要避让的右侧宽度（px），H5 上是 0 */
    const rightInset = ref(rightInsetValue)
    /** 导航栏占位总高度（状态栏 + 内容栏） */
    const navTotalHeight = computed(() => statusBarHeight.value + barHeight.value)

    return { statusBarHeight, barHeight, rightInset, navTotalHeight }
}
