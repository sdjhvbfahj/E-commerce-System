import httpInstance from "@/mock"

/**
 * @description: 获取详情信息
 * @param {*}
 * @return {*}
 */
export function getDetailAPI(id:string) {
    return httpInstance({
        url: '/goods',
        params: {
            id: id
        }
    });
}
interface DetailBrandItem {
    id: string,
    desc: string,
    logo: string,
    name: string,
    nameEn: string,
    picture: string,
}
interface DetailCategoriesItem {
    id: string,
    name: string
}
interface DetailHotByDayItem {
    desc: string,
    id: string,
    name: string,
    picture: string,
    price: string
}
interface DetailDetailsPropertiesItem {
    name: string,
    value: string
}
interface DetailDetailsItem {
    picture: string[],
    properties: DetailDetailsPropertiesItem[]
}
export interface DetailItem {
    id: string,
    name: string,
    price: string,
    oldPrice: string,
    brand: DetailBrandItem,
    categories: DetailCategoriesItem[],
    hotByDay:DetailHotByDayItem[],
    details: DetailDetailsItem,
    salesCount: number,
    commentCount: number,
    collectCount: number,
    mainPictures: string[]
}

/**
 * @description: 获取热榜商品
 * @param {Number} id - 商品id
 * @param {Number} type - 1代表24小时热销榜 2代表周热销榜
 * @param {Number} limit - 获取个数
 */
interface HotParamsItem {
    id: string,
    type: number,
    limit: number
}
export function fetchHotGoodsAPI(paramsData: HotParamsItem) {
    return httpInstance({
        url: '/goods/hot',
        method: 'GET',
        params: paramsData
    });
}
export interface HotGoodsItem {
    id: string,
    name: string,
    desc: string,
    price: string,
    picture: string
}