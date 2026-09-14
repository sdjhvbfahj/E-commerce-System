import {defineStore} from 'pinia'
import {ref} from 'vue'
import {getLoginAPI, getLikeListAPI} from '@/apis/user.ts'
import type {loginDataItem, userInfoItem} from '@/apis/user.ts'
import {useCartStore} from '@/stores/cartStore.ts'

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<userInfoItem>({} as userInfoItem);
    const likeList = ref();
    const getLogin = async (logindata:loginDataItem) => {
        const result = await getLoginAPI(logindata) as any;
        userInfo.value = result.result;
        const cartStore = useCartStore();
        // 首次登录时渲染服务器购物车商品
        // 合并购物车
        await cartStore.mergeCart();
        // 获取购物车列表
        await cartStore.getCartList();
    }
    // 删除用户数据
    const deleteLoginInfo = () => {
        userInfo.value = {} as userInfoItem;
    }
    // 获取会员中心猜你喜欢数据
    const getLikeList = async () => {
        const result = await getLikeListAPI() as any;
        likeList.value = result.result;
    }
    return {userInfo, likeList, getLogin, deleteLoginInfo, getLikeList};
},{
    persist: {
        storage: localStorage,
        pick: ['userInfo']
    }
});