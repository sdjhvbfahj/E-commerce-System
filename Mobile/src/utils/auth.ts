import { useUserStore } from '@/stores/userStore.ts'

/** 登录页路径（多处跳转统一从这里取，避免字符串散落） */
export const LOGIN_PAGE = '/pages/login/index'

/**
 * 需要登录的操作统一走这里
 * 未登录时跳登录页并带上回跳地址，返回 false 让调用方直接 return
 */
export function ensureLogin(): boolean {
    const userStore = useUserStore()
    if (userStore.isLogin) return true
    uni.navigateTo({ url: LOGIN_PAGE })
    return false
}

/** 当前页面地址（登录回跳用） */
export function currentPageUrl(): string {
    const pages = getCurrentPages()
    const current = pages[pages.length - 1] as any
    if (!current) return ''
    const query = current.options || current.$page?.options || {}
    const queryString = Object.keys(query)
        .map((key) => `${key}=${encodeURIComponent(query[key])}`)
        .join('&')
    return `/${current.route}${queryString ? `?${queryString}` : ''}`
}

/** 轻提示（统一封装，避免每页都写 uni.showToast 的 icon 参数） */
export function toast(title: string, icon: 'none' | 'success' = 'none') {
    uni.showToast({ title, icon, duration: 1800 })
}
