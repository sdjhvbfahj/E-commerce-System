import httpInstance from "@/mock"

/**
 * @description: 获取订单详情
 * @param {*}
 * @return {*}
 */
export function getOrderInfoAPI() {
    return httpInstance({
        url: '/member/order/pre',
        method: 'GET'
    });
}
// 地址数据
export interface UserAddressesItem {
    id: string,
    receiver: string,
    contact: string,
    provinceCode: string,
    cityCode: string,
    countyCode: string,
    address: string,
    isDefault: number,
    fullLocation: string,
    addressTags:string,
    postalCode: string
}
// 商品数据
export interface GoodsItem {
    id: string,
    name: string,
    picture: string,
    count: number,
    skuId: string,
    attrsText: string,
    price: string,
    payPrice: string,
    totalPrice: string,
    totalPayPrice: string
}
// 订单总计
export interface SummaryItem {
    goodsCount: number,
    totalPrice: number,
    totalPayPrice: number,
    postFee: number,
    discountPrice: number
}
export interface OrderInfoItem {
    userAddresses: UserAddressesItem[],
    goods: GoodsItem[],
    summary: SummaryItem
}

/**
 * @description: 新增收获地址
 * @param {string} receiver - 收货人姓名
 * @param {string} contact - 收货人联系方式
 * @param {string} provinceCode - 收货人省份编码
 * @param {string} cityCode - 收货人城市编码
 * @param {string} address - 收货人详细地址
 * @param {string} postalCode - 收货人邮政编码
 * @param {string} addressTags - 收货人地址标签
 * @param {number} isDefault - 是否设置为默认地址
 * @param {string} fullLocation - 收货人完整地址
 * @return {*}
 */
export interface AddNewAddress {
    receiver: string,
    contact: string,
    provinceCode: string,
    cityCode: string,
    countyCode: string,
    address: string,
    postalCode: string,
    addressTags: string,
    isDefault: number,
    fullLocation: string,
}
export function addNewAddressAPI(data:AddNewAddress) {
    return httpInstance({
        url: '/member/address',
        method: 'POST',
        data: data
    });
}

/**
 * @description: 删除地址信息详情
 * @param {*}
 * @return {*}
 */
export function deleteAddressAPI(id:string) {
    return httpInstance({
        url: `/member/address/${id}`,
        method: 'DELETE',
    });
}

/**
 * @description: 修改收获地址
 * @param {*}
 * @return {*}
 */
export function reviseAddressAPI(item:UserAddressesItem) {
    return httpInstance({
        url: `/member/address/${item.id}`,
        method: 'PUT',
        data: {
            receiver: item.receiver,
            contact: item.contact,
            provinceCode: item.provinceCode,
            cityCode: item.cityCode,
            countyCode: item.countyCode,
            address: item.address,
            postalCode: item.postalCode,
            addressTags: item.addressTags,
            isDefault: item.isDefault,
        }
    });
}