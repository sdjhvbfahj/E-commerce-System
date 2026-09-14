import httpInstance from "@/utils/http"

/**
 * @description: 合并购物车
 * @param {string} skuId -商品的skuId
 * @param {boolean} selected -商品选中状态
 * @param {number} count -商品数量
 * @return {*}
 */
interface MergeDataItem {
    skuId:string,
    selected:boolean,
    count:number
}
export function getMergeCartAPI(data:MergeDataItem[]) {
    return httpInstance({
        url: '/member/cart/merge',
        method: 'POST',
        data: data
    });
}

/**
 * @description: 加入购物车
 * @param {string} skuId -商品的skuId
 * @param {number} count -商品数量
 * @return {*}
 */
export function getAddCartAPI(skuId:string, count:number) {
    return httpInstance({
        url: '/member/cart',
        method: 'POST',
        data: {
            skuId,
            count
        }
    });
}

/**
 * @description: 获取购物车列表
 * @param {*}
 * @return {*}
 */
export function getGetCartAPI() {
    return httpInstance({
        url: '/member/cart',
        method: 'GET',
    });
}
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

/**
 * @description: 删除购物车列表
 * @param {string[]} ids -商品的skuId合集
 * @return {*}
 */
export function getDeleteCartAPI(ids:string[]) {
    return httpInstance({
        url: '/member/cart',
        method: 'DELETE',
        data: {
            ids
        }
    });
}

/**
 * @description: 修改购物车商品
 * @param {boolean} selected -商品选中状态
 * @param {number} count -商品数量
 * @return {*}
 */
export function getChangeCartItemAPI(skuId:string, selected:boolean, count:number) {
    return httpInstance({
        url: `/member/cart/${skuId}`,
        method: 'PUT',
        data: {
            selected,
            count
        }
    });
}

/**
 * @description: 修改全选状态
 * @param {boolean} selected -商品选中状态
 * @param {string[]} ids -商品的skuId数组
 * @return {*}
 */
export function getChangeAllSelectedAPI(selected:boolean, ids:string[]) {
    return httpInstance({
        url: '/member/cart/selected',
        method: 'PUT',
        data: {
            selected,
            ids
        }
    });
}