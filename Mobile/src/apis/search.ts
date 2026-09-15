import httpInstance from "@/mock"

/**
 * @description: 关键词搜索（匹配商品名 / 分类 / 卖点 / 品牌）
 * @param {string} keyword -关键词
 * @param {number} page -页码
 * @param {number} pageSize -每页条数
 * @return {*}
 */
export interface SearchParamsItem {
    keyword: string,
    page?: number,
    pageSize?: number
}
export function getSearchAPI(params: SearchParamsItem) {
    return httpInstance({
        url: '/search',
        method: 'GET',
        params
    });
}
