import httpInstance from '@/mock'

/** ---------------------------------------------------------------- 商品管理 */

/**
 * @description: 商品列表（分页 + 关键词 + 分类 + 上下架状态）
 */
export function getAdminGoodsAPI(params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    catId?: string;
    status?: number;
}) {
    return httpInstance({ url: '/admin/goods', method: 'GET', params });
}

/**
 * @description: 商品详情（编辑页回显）
 */
export function getAdminGoodsByIdAPI(id: string) {
    return httpInstance({ url: `/admin/goods/${id}`, method: 'GET' });
}

/**
 * @description: 新增商品
 */
export function createAdminGoodsAPI(data: {
    name: string;
    desc: string;
    catId: string;
    catName: string;
    subId: string;
    subName: string;
    brandId: string;
    price: string;
    oldPrice: string;
}) {
    return httpInstance({ url: '/admin/goods', method: 'POST', data });
}

/**
 * @description: 保存商品编辑（基础信息 + 价格）
 */
export function updateAdminGoodsAPI(id: string, data: { name: string; desc: string; price: string; oldPrice: string }) {
    return httpInstance({ url: `/admin/goods/${id}`, method: 'PUT', data });
}

/**
 * @description: 商品上下架
 */
export function toggleGoodsShelfAPI(id: string) {
    return httpInstance({ url: `/admin/goods/${id}/shelf`, method: 'PUT' });
}

/**
 * @description: 商品批量上下架
 */
export function batchGoodsShelfAPI(ids: string[], status: 0 | 1) {
    return httpInstance({ url: '/admin/goods/shelf/batch', method: 'PUT', data: { ids, status } });
}

/**
 * @description: 删除商品（需先下架）
 */
export function deleteGoodsAPI(id: string) {
    return httpInstance({ url: `/admin/goods/${id}`, method: 'DELETE' });
}

/** ---------------------------------------------------------------- 分类与品牌 */

/**
 * @description: 分类树（一级 + 二级 + 商品数）
 */
export function getCategoryTreeAPI() {
    return httpInstance({ url: '/admin/goods/categories', method: 'GET' });
}

/**
 * @description: 品牌列表（从商品数据聚合）
 */
export function getBrandListAPI() {
    return httpInstance({ url: '/admin/goods/brands', method: 'GET' });
}

/**
 * @description: 编辑品牌（名称 / 介绍）
 */
export function updateBrandAPI(id: string, data: { name: string; desc: string }) {
    return httpInstance({ url: `/admin/goods/brands/${id}`, method: 'PUT', data });
}

/** ---------------------------------------------------------------- 库存管理 */

/**
 * @description: 库存列表（分页 + 关键词 + 分类 + 仅看预警）
 */
export function getStockListAPI(params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    catName?: string;
    onlyWarn?: number;
}) {
    return httpInstance({ url: '/admin/stock', method: 'GET', params });
}

/**
 * @description: 调整库存（increase 入库 / decrease 出库 / set 校准）
 */
export function updateStockAPI(skuId: string, data: { action: 'increase' | 'decrease' | 'set'; quantity: number }) {
    return httpInstance({ url: `/admin/stock/${skuId}`, method: 'PUT', data });
}

/**
 * @description: 库存流水（分页 + 关键词 + 类型）
 */
export function getStockFlowAPI(params: { page?: number; pageSize?: number; keyword?: string; type?: string }) {
    return httpInstance({ url: '/admin/stock/flow', method: 'GET', params });
}
