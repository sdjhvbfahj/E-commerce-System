import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/userStore.ts'
import {
    getAddCartAPI,
    getChangeAllSelectedAPI,
    getChangeCartItemAPI,
    getDeleteCartAPI,
    getGetCartAPI,
    getMergeCartAPI,
} from '@/apis/cart.ts'
import { storage } from '@/utils/storage.ts'

export interface CartItem {
    id: string
    name: string
    picture: string
    price: string
    count: number
    skuId: string
    attrsText: string
    selected: boolean
}

const STORAGE_KEY = 'eshop621-mobile-cart'

function readCache(): CartItem[] {
    try {
        const raw = storage.getItem(STORAGE_KEY)
        const list = raw ? (JSON.parse(raw) as CartItem[]) : []
        return Array.isArray(list) ? list : []
    } catch {
        return []
    }
}

/**
 * 购物车
 * ---------------------------------------------------------------------------
 * 逻辑与用户端保持一致：登录后走「服务端」接口，未登录时用本地数据，
 * 登录时把本地的合并上去。差别只在持久化用跨端 storage。
 */
export const useCartStore = defineStore('cart', () => {
    const userStore = useUserStore()
    const cartList = ref<CartItem[]>(readCache())

    function persist() {
        try {
            storage.setItem(STORAGE_KEY, JSON.stringify(cartList.value))
        } catch {
            /* ignore */
        }
    }

    /** 拉取购物车（登录后是「服务端」数据） */
    const getCartList = async () => {
        if (!userStore.isLogin) {
            cartList.value = readCache()
            return
        }
        const result = (await getGetCartAPI()) as any
        cartList.value = result.result || []
        persist()
    }

    /** 把未登录期间的本地购物车合并到服务端 */
    async function mergeCart() {
        const local = readCache()
        if (!local.length) return
        await getMergeCartAPI(
            local.map((item) => ({
                skuId: item.skuId,
                selected: item.selected,
                count: item.count,
            }))
        )
        storage.removeItem(STORAGE_KEY)
    }

    /** 加入购物车（未登录先存本地） */
    async function addCart(goods: CartItem) {
        if (userStore.isLogin) {
            await getAddCartAPI(goods.skuId, goods.count)
            await getCartList()
            return
        }
        const same = cartList.value.find((item) => item.skuId === goods.skuId)
        if (same) {
            same.count += goods.count
        } else {
            cartList.value.push({ ...goods })
        }
        persist()
    }

    /** 删除（支持一次删多个 skuId） */
    async function deleteCart(skuIds: string[]) {
        if (userStore.isLogin) {
            await getDeleteCartAPI(skuIds)
            await getCartList()
            return
        }
        cartList.value = cartList.value.filter((item) => !skuIds.includes(item.skuId))
        persist()
    }

    /** 单选 */
    async function cartSelectedChange(item: CartItem, selected: boolean) {
        if (userStore.isLogin) {
            await getChangeCartItemAPI(item.skuId, selected, item.count)
            await getCartList()
            return
        }
        const target = cartList.value.find((row) => row.skuId === item.skuId)
        if (target) target.selected = selected
        persist()
    }

    /** 改数量（未登录时本地也改，保证页面能操作） */
    async function cartCountChange(item: CartItem, count: number) {
        const safe = Math.max(1, count)
        if (userStore.isLogin) {
            await getChangeCartItemAPI(item.skuId, item.selected, safe)
            await getCartList()
            return
        }
        const target = cartList.value.find((row) => row.skuId === item.skuId)
        if (target) target.count = safe
        persist()
    }

    /** 全选 / 全不选 */
    async function cartAllSelectedChange(selected: boolean) {
        if (userStore.isLogin) {
            await getChangeAllSelectedAPI(
                selected,
                cartList.value.map((item) => item.skuId)
            )
            await getCartList()
            return
        }
        cartList.value.forEach((item) => (item.selected = selected))
        persist()
    }

    function clearCart() {
        cartList.value = []
        storage.removeItem(STORAGE_KEY)
    }

    /** 购物车角标数量（自定义 tabBar 角标 / 我的页面用） */
    const cartCount = computed(() => cartList.value.reduce((sum, item) => sum + item.count, 0))
    const allSelected = computed(() => cartList.value.length > 0 && cartList.value.every((item) => item.selected))
    const selectedCount = computed(() =>
        cartList.value.filter((item) => item.selected).reduce((sum, item) => sum + item.count, 0)
    )
    const selectedPrice = computed(() =>
        cartList.value.filter((item) => item.selected).reduce((sum, item) => sum + item.count * Number(item.price), 0)
    )

    return {
        cartList,
        isLogin: userStore.isLogin,
        getCartList,
        mergeCart,
        addCart,
        deleteCart,
        cartSelectedChange,
        cartCountChange,
        cartAllSelectedChange,
        clearCart,
        cartCount,
        allSelected,
        selectedCount,
        selectedPrice,
    }
})
