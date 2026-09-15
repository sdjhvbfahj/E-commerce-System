/**
 * 假数据层统一出口
 * ---------------------------------------------------------------------------
 * 用法与原来的 axios 实例完全一致（可直接替换 import 路径）：
 *
 *     import httpInstance from '@/mock'
 *     httpInstance({ url: '/home/banner', method: 'GET', params: { distributionSite: '1' } })
 *
 * 目录说明见同级的 README.md。
 */
import mockRequest, { type MockHttpError } from './client';
import { resetDb } from './db';
import { resetAdminDb } from './data/admin';

export type { MockHttpError };
export { mockRequest };
export { resetDb };
export { resetAdminDb };
export { products, productMap, skuMap, findProduct } from './data/products';

/**
 * 【假支付】模拟支付宝支付成功回调，把订单从「待付款」改成「待发货」
 * 支付页的「支付宝」按钮会调用它。
 */
export function mockPay(orderId: string) {
    return mockRequest({ url: `/member/order/${orderId}/pay`, method: 'POST' });
}

/** 方便在浏览器控制台里还原演示数据 */
if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).__resetMockDb = () => { resetDb(); resetAdminDb(); };
}

export default mockRequest;
