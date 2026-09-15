/**
 * 本地存储封装
 * ---------------------------------------------------------------------------
 * 用户端是浏览器环境，直接用 localStorage；移动端要兼容 App / 小程序，
 * 优先使用 uni 的存储 API（App 端更可靠），没有 uni 的时候回退到 localStorage，
 * 两者都没有（纯 Node 环境跑单测）时退化为内存存储。
 */

const memoryStore = new Map<string, string>()

function getUni(): typeof uni | null {
    return typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function' ? uni : null
}

function getLocalStorage(): Storage | null {
    return typeof localStorage !== 'undefined' ? localStorage : null
}

export const storage = {
    getItem(key: string): string | null {
        const uniApi = getUni()
        if (uniApi) {
            try {
                const value = uniApi.getStorageSync(key)
                return typeof value === 'string' && value ? value : null
            } catch {
                return memoryStore.get(key) ?? null
            }
        }
        const ls = getLocalStorage()
        if (ls) return ls.getItem(key)
        return memoryStore.get(key) ?? null
    },

    setItem(key: string, value: string): void {
        const uniApi = getUni()
        if (uniApi) {
            try {
                uniApi.setStorageSync(key, value)
                return
            } catch {
                memoryStore.set(key, value)
                return
            }
        }
        const ls = getLocalStorage()
        if (ls) {
            ls.setItem(key, value)
            return
        }
        memoryStore.set(key, value)
    },

    removeItem(key: string): void {
        const uniApi = getUni()
        if (uniApi) {
            try {
                uniApi.removeStorageSync(key)
                return
            } catch {
                memoryStore.delete(key)
                return
            }
        }
        const ls = getLocalStorage()
        if (ls) {
            ls.removeItem(key)
            return
        }
        memoryStore.delete(key)
    },
}

/**
 * Pinia 持久化用的 storage 适配器（pinia-plugin-persistedstate 的 storage 接口）
 * App / H5 都能用，避免直接写 localStorage 在小程序端报错
 */
export const piniaStorage = {
    getItem: (key: string) => storage.getItem(key) ?? '',
    setItem: (key: string, value: string) => storage.setItem(key, value),
    removeItem: (key: string) => storage.removeItem(key),
}
