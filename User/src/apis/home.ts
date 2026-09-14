import httpInstance from "@/utils/http"

// 向服务器请求banner图数据
// 将其封装成一个函数
export function getBannerAPI(distributionSite:string = '1') {
    return httpInstance({
        url: '/home/banner',
        method: 'GET',
        params: {
            distributionSite: distributionSite
        }
    });
}
// 定义接口，限制返回banner数据的类型
export interface BannerItem {
    id: string,
    imgUrl: string
}

/**
 * @description: 获取新鲜好物
 * @param {*}
 * @return {*}
 */
export function getNewAPI() {
    return httpInstance({
        url: '/home/new',
        method: 'GET'
    });
}
export interface NewItem {
    id: string,
    name: string,
    picture: string,
    price: string
}

/**
 * @description: 获取人气推荐
 * @param {*}
 * @return {*} 
*/
export function getHotAPI() {
    return httpInstance({
        url: '/home/hot',
        method: 'GET'
    })
}
export interface HotItem {
    id: string,
    title: string,
    picture: string,
    alt: string
}

/**
 * @description: 获取所有商品模块
 * @param {*}
 * @return {*}
 */
export function getGoodsAPI() {
    return httpInstance({
        url: '/home/goods',
        method: 'GET'
    });
}
interface GoodsChildrenItem {
    id: string,
    name: string
}
interface GoodsGoodsItem {
    id: string,
    name: string,
    desc: string,
    price: string,
    picture: string,
    orderNum: number
}
export interface GoodsCategoryItem {
    id: string,
    name: string,
    picture: string,
    children: GoodsChildrenItem[],
    goods: GoodsGoodsItem[]
}
