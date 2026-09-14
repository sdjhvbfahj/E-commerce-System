import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import {useUserStore} from '@/stores/userStore.ts'
import {getAddCartAPI, getMergeCartAPI, getGetCartAPI, getDeleteCartAPI, getChangeCartItemAPI, getChangeAllSelectedAPI} from '@/apis/cart.ts'

export interface CartItem {
    id: string,
    name: string,
    picture: string,
    price: string,
    count: number,
    skuId: string,
    attrsText: string,
    selected: boolean
}

export const useCartStore = defineStore('cart', () => {
    const userStore = useUserStore();
    // 购物车列表
    const cartList = ref<CartItem[]>([]);

    // 调用服务前渲染商品列表(统一封装使用)
    const getCartList = async () => {
        const result = await getGetCartAPI() as any;
        cartList.value = result.result || [];
    }

    // 合并未登录之前的购物车记录
    async function mergeCart() {
        // 判断未登录时购物车是否有商品, 有商品就将其加入登录后的购物车列表
        if(cartList.value) {
            await getMergeCartAPI(cartList.value.map((item) => {
                return {
                    skuId: item.skuId,
                    selected: item.selected,
                    count: item.count
                }
            }));
        }
    }

    // 添加购物车
    async function addCart(cartGoods:CartItem) {
        // 判断是否登录, 完成登录购物车走接口数据, 没有登陆购物车走pinia本地数据
        if(userStore.userInfo.token) {
            // 实现加入购物车
            await getAddCartAPI(cartGoods.skuId, cartGoods.count);
            getCartList();
        } else {
            // 判断是否已经有相同商品添加过购物车
            const sameCartGoods = cartList.value?.find((item) => {
                return item.skuId === cartGoods.skuId;
            });
            if(sameCartGoods) {
                // 购物车已有相同商品
                sameCartGoods.count += cartGoods.count;
            } else {
                // 购物车没有相同商品
                cartList.value.push(cartGoods);
            }
        }
    }

    // 删除购物车
    async function deleteCart(skuId:string) {
        // 判断是否进行登录, 执行不同的删除操作
        if(userStore.userInfo.token) {
            // 以数组的形式传入(支持多个skuId删除)
            await getDeleteCartAPI([skuId]);
            // 完成删除操作以后重新渲染
            getCartList();
        } else {
            // 使用findIndex得到要删除的商品数组下标
            const arrIndex = cartList.value.findIndex(item => {
                return skuId === item.skuId
            });
            // 删除商品
            cartList.value.splice(arrIndex, 1);
        }
    }

    // 退出登录清除本地购物车数据
    function clearCart() {
        cartList.value = [];
    }

    // 修改购物车商品的选中状态
    async function cartSelectedChange(chooseItem:CartItem, selected:boolean) {
        if(userStore.userInfo.token) {
            await getChangeCartItemAPI(chooseItem.skuId, selected, chooseItem.count);
            await getCartList();
        } else {
            // 使用数组的find方法找到符合skuId条件的第一个元素, 并返回
            const item = cartList.value?.find((item) => item.skuId === chooseItem.skuId) as CartItem;
            // 修改selected值
            item.selected = selected;
        }
    }

    // 修改购物车商品的count数量值
    async function cartCountChange(skuId:string, selected:boolean, countValue:number) {
        if(userStore.userInfo.token) {
            await getChangeCartItemAPI(skuId, selected, countValue);
            await getCartList();
        } else {
            return;
        }
    }

    // 全选决定所有单选
    async function cartAllSelectedChange(selected:boolean) {
        if(userStore.userInfo.token) {
            await getChangeAllSelectedAPI(selected, cartList.value?.map((item) => {
                return item.skuId;
            }));
            await getCartList();
        } else {
            cartList.value?.forEach((item) => item.selected = selected);
        }
    }

    // 购物车商品总数
    const cartCount = computed(() => {
        return cartList.value?.reduce((prev, item) => prev += item.count, 0) || 0;
    });

    // 购物车商品总价
    const cartTotalPrice = computed(() => {
        return cartList.value?.reduce((prev, item) => prev += (item.count * Number(item.price)), 0) || 0;
    });

    // 单选框决定全选框
    const allSelected = computed(() => {
        return cartList.value?.every((item) => item.selected === true) || false;
    });

    // 选中商品的数量
    const selectedCount = computed(() => {
        return cartList.value?.filter((item) => item.selected === true).reduce((prev, item) => prev += item.count, 0) || 0;
    });

    // 选中商品总价格
    const selectedPrice = computed(() => {
        return cartList.value?.filter((item) => item.selected === true).reduce((prev, item) => prev += item.count * Number(item.price), 0) || 0;
    });
    
    return {
        cartList,
        addCart,
        deleteCart,
        cartSelectedChange,
        cartAllSelectedChange,
        clearCart,
        getCartList,
        mergeCart,
        cartCountChange,
        cartCount,
        cartTotalPrice,
        allSelected,
        selectedCount,
        selectedPrice
    };
}, {
    // pinia数据持久化
    persist: {
        storage: localStorage,
        pick: ['cartList']
    }
});