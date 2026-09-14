import httpInstance from "@/mock"
/**
 * @description: 提交订单
 * @param {*}
 * @return {*}
 */
export interface GoodsItem {
    skuId: string,
    count: number
}
interface OrderItem {
    deliveryTimeType: number,
    payType: number,
    payChannel: number,
    buyerMessage: string,
    goods: GoodsItem[],
    addressId: string
}
export function submitOrderAPI(data:OrderItem) {
    return httpInstance({
        url: '/member/order',
        method: 'POST',
        data: data
    });
}
// 接收的订单数据
export interface OrderInfoItem {
    id: string,
    createTime: string,
    payType: number,
    orderState: number,
    payLatestTime: string,
    postFee: number,
    payMoney: number,
    totalMoney: number,
    totalNum: number,
    skus: null,
    payChannel: number,
    countdown: number
}

/**
 * @description: 获取订单详细数据
 * @param {*}
 * @return {*}
 */
export function getOrderInfoAPI(id:string) {
    return httpInstance({
        url: `/member/order/${id}`,
        method: 'GET',
    });
}
interface skusItem {
    id: string,
    spuId: string,
    name: string,
    quantity: number,
    image: string,
    realPay: number,
    curPrice: number,
    totalMoney: number,
    attrsText: string,
    properties: [
        propertyMainName: string,
        propertyValueName: string
    ]
}
export interface OrderDetails {
    id: string,
    createTime: string,
    payType: number,
    orderState: number,
    payLatestTime: string,
    countdown: number,
    postFee: number,
    payMoney: number,
    payChannel: number,
    payState: number,
    totalMoney: number,
    totalNum: number,
    deliveryTimeType: number,
    receiverContact: string,
    receiverMobile: string,
    provinceCode: string,
    cityCode: string,
    countyCode: string,
    receiverAddress: string,
    payTime: string,
    consignTime: string,
    endTime: string,
    closeTime: string,
    evaluationTime: string,
    arrivalEstimatedTime: string,
    skus: skusItem[]
}