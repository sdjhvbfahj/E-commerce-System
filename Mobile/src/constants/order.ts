/**
 * 订单状态常量
 * ---------------------------------------------------------------------------
 * 状态码与用户端假数据一致：1 待付款 / 2 待发货 / 3 待收货 / 4 待评价 / 5 已完成 / 6 已取消
 * 页面里不要写 `orderState === 1` 这种魔法数字，统一从这里取（文档 7.3 MB-P08 要求）。
 */

export interface OrderStateMeta {
    /** 状态码（0 仅用于「全部」页签，不落库） */
    value: number;
    /** 状态文案 */
    label: string;
    /** 状态说明（订单卡片副文案） */
    tip: string;
    /** 该状态下可执行的操作 */
    actions: OrderAction[];
}

export type OrderAction = 'pay' | 'cancel' | 'confirm' | 'comment' | 'rebuy' | 'detail';

export const ORDER_STATES: OrderStateMeta[] = [
    { value: 1, label: '待付款', tip: '请在 30 分钟内完成支付', actions: ['pay', 'cancel'] },
    { value: 2, label: '待发货', tip: '商家正在备货，请耐心等待', actions: ['detail'] },
    { value: 3, label: '待收货', tip: '商品已发出，注意查收', actions: ['confirm', 'detail'] },
    { value: 4, label: '待评价', tip: '晒出你的使用感受吧', actions: ['comment', 'rebuy'] },
    { value: 5, label: '已完成', tip: '交易已完成，感谢支持', actions: ['rebuy'] },
    { value: 6, label: '已取消', tip: '订单已取消', actions: ['rebuy'] },
];

/** 全部页签 + 各状态页签（订单列表页直接循环用） */
export const ORDER_TABS = [{ value: 0, label: '全部' }, ...ORDER_STATES.map((item) => ({ value: item.value, label: item.label }))];

export function orderStateMeta(state: number): OrderStateMeta {
    return ORDER_STATES.find((item) => item.value === state) ?? ORDER_STATES[0]!;
}

/** 我的页面「订单九宫格」，只放四个高频入口 */
export const MINE_ORDER_ENTRIES = [
    { state: 1, label: '待付款' },
    { state: 2, label: '待发货' },
    { state: 3, label: '待收货' },
    { state: 4, label: '待评价' },
];
