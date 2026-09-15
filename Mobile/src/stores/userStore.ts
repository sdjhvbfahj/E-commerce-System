import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getLoginAPI, getLikeListAPI } from '@/apis/user.ts'
import type { loginDataItem, userInfoItem } from '@/apis/user.ts'
import { storage } from '@/utils/storage.ts'
import { useCartStore } from '@/stores/cartStore.ts'

const STORAGE_KEY = 'eshop621-mobile-user'

function readCache(): userInfoItem {
    try {
        const raw = storage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as userInfoItem) : ({} as userInfoItem)
    } catch {
        return {} as userInfoItem
    }
}

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<userInfoItem>(readCache())
    const likeList = ref<unknown>([])

    /** 登录态：以 token 为准（与用户端判断方式一致） */
    const isLogin = computed(() => Boolean(userInfo.value?.token))

    function persist() {
        try {
            storage.setItem(STORAGE_KEY, JSON.stringify(userInfo.value))
        } catch {
            /* 存储不可用时忽略，本次会话仍然可用 */
        }
    }

    /** 账号密码登录（演示环境：密码 6 位以上即可） */
    const getLogin = async (logindata: loginDataItem) => {
        const result = (await getLoginAPI(logindata)) as any
        userInfo.value = result.result
        persist()
        // 登录后把未登录期间加的购物车合并到「服务端」购物车，再拉一次列表
        const cartStore = useCartStore()
        await cartStore.mergeCart()
        await cartStore.getCartList()
    }

    /** 退出登录：清空用户信息 + 本地购物车 */
    const deleteLoginInfo = () => {
        userInfo.value = {} as userInfoItem
        storage.removeItem(STORAGE_KEY)
        const cartStore = useCartStore()
        cartStore.clearCart()
    }

    /** 我的页面猜你喜欢 */
    const getLikeList = async () => {
        const result = (await getLikeListAPI(6)) as any
        likeList.value = result.result ?? []
    }

    return { userInfo, likeList, isLogin, getLogin, deleteLoginInfo, getLikeList }
})
