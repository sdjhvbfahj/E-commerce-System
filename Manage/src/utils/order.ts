/**
 * 订单状态常量（对齐用户端的 orderState 定义）
 * 1 待付款 2 待发货 3 待收货 4 待评价 5 已完成 6 已取消
 */
export const ORDER_STATE_TEXT: Record<number, string> = {
    1: '待付款',
    2: '待发货',
    3: '待收货',
    4: '待评价',
    5: '已完成',
    6: '已取消',
};

/** el-tag 的 type */
export const ORDER_STATE_TAG: Record<number, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    1: 'warning',
    2: 'primary',
    3: 'success',
    4: 'info',
    5: 'success',
    6: 'info',
};

/** 支付方式 */
export const PAY_TYPE_TEXT: Record<number, string> = {
    1: '支付宝',
    2: '微信支付',
};

export const ORDER_STATE_OPTIONS = Object.entries(ORDER_STATE_TEXT).map(([value, label]) => ({
    value: Number(value),
    label,
}));

/** 物流公司（发货弹窗下拉） */
export const EXPRESS_COMPANIES = ['顺丰速运', '京东物流', '中通快递', '圆通速递', '韵达快递', 'EMS'];
