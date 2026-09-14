import httpInstance from "@/mock"

// 获取订单数据
export interface ParamsItem {
    orderState: number,
    page: number,
    pageSize: number
}
export const getUserOrderAPI = (params:ParamsItem) => {
    return httpInstance({
        url:'/member/order',
        method:'GET',
        params
    });
}
export interface OrderListItem {
    countdown: number,
    createTime: string,
    id: string,
    orderState: number,
    payChannel: number,
    payLatestTime: string,
    payMoney: number,
    payType: number,
    postFee: number,
    totalMoney: number,
    totalNum: number
    skus: [{
        attrsText: string,
        curPrice: number,
        id: string,
        image: string,
        name: string,
        quantity: number,
        realPay: number,
        spuId: string,
    }]
}
export interface OrderItem {
    items: OrderListItem[],
    counts: number,
    page: number,
    pages: number,
    pageSize: number
}