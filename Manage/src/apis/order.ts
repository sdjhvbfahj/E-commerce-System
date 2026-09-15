import httpInstance from '@/mock'

/**
 * @description: 订单列表（分页 + 关键词 + 订单状态）
 */
export function getAdminOrderListAPI(params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    state?: number;
}) {
    return httpInstance({ url: '/admin/orders', method: 'GET', params });
}

/**
 * @description: 订单详情
 */
export function getAdminOrderDetailAPI(id: string) {
    return httpInstance({ url: `/admin/orders/${id}`, method: 'GET' });
}

/**
 * @description: 订单发货
 */
export function shipOrderAPI(id: string, data: { company: string; trackingNo: string }) {
    return httpInstance({ url: `/admin/orders/${id}/ship`, method: 'PUT', data });
}

/**
 * @description: 取消订单
 */
export function cancelOrderAPI(id: string) {
    return httpInstance({ url: `/admin/orders/${id}/cancel`, method: 'PUT' });
}

/**
 * @description: 退款单列表
 */
export function getRefundListAPI(params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    status?: number;
}) {
    return httpInstance({ url: '/admin/refunds', method: 'GET', params });
}

/**
 * @description: 退款审核（通过 / 拒绝）
 */
export function auditRefundAPI(id: string, data: { approve: boolean; remark?: string }) {
    return httpInstance({ url: `/admin/refunds/${id}/audit`, method: 'PUT', data });
}

/**
 * @description: 退款打款
 */
export function payRefundAPI(id: string) {
    return httpInstance({ url: `/admin/refunds/${id}/pay`, method: 'PUT' });
}
