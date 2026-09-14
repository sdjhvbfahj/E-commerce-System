import httpInstance from "@/mock"

/**
 * @description: 判断是否登录成功
 * @param {string} account -账号
 * @param {string} password -密码
 * @return {*}
 */
export interface loginDataItem {
    account: string,
    password: string
}
export function getLoginAPI(loginData:loginDataItem) {
    return httpInstance({
        url: '/login',
        method: 'POST',
        data: loginData
    });
}
// 定义接口返回的数据类型
export interface userInfoItem {
    account: string,
    avatar: string,
    birthday: string,
    cityCode: string,
    gender: string,
    id: string,
    mobile: string,
    nickname: string,
    profession: string,
    provinceCode: string,
    token: string
}

/**
 * @description: 获取猜你喜欢数据
 * @param {*}
 * @return {*}
 */
export function getLikeListAPI(limit = 4) {
    return httpInstance({
        url:'/goods/relevant',
        params: {
            limit 
        }
    });
}