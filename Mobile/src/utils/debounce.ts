/**
 * 简易防抖（不引第三方库，H5 / 小程序 / App 通用）
 * 典型用法：搜索框输入停下 300ms 后再去请求
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
    let timer: ReturnType<typeof setTimeout> | null = null

    const wrapped = (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            timer = null
            fn(...args)
        }, wait)
    }

    /** 立刻执行（比如用户按下回车时） */
    wrapped.flush = (...args: Parameters<T>) => {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
        fn(...args)
    }

    /** 取消待执行的一次 */
    wrapped.cancel = () => {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
    }

    return wrapped
}
