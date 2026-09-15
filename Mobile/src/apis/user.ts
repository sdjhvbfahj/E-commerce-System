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

/**
 * @description: 注册（演示环境：任意账号 + 密码 >= 6 位即可注册成功）
 * @param {string} account -账号
 * @param {string} password -密码
 * @param {string} mobile -手机号（可选）
 * @return {*}
 */
export interface registerDataItem {
    account: string,
    password: string,
    mobile?: string
}
export function getRegisterAPI(registerData:registerDataItem) {
    return httpInstance({
        url: '/register',
        method: 'POST',
        data: registerData
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