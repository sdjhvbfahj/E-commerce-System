import httpInstance from "@/mock"

/**
 * @description: 帮助中心数据（栏目 + 问答 + 友情链接）
 * @param {*}
 * @return {*}
 */
export function getHelpAPI() {
    return httpInstance({
        url: '/help',
        method: 'GET',
    });
}

/**
 * @description: 关于我们数据（品牌故事 / 数据 / 价值观 / 发展历程）
 * @param {*}
 * @return {*}
 */
export function getAboutAPI() {
    return httpInstance({
        url: '/about',
        method: 'GET',
    });
}

/**
 * @description: 品牌专区列表
 * @param {*}
 * @return {*}
 */
export function getBrandAPI() {
    return httpInstance({
        url: '/brand',
        method: 'GET',
    });
}

/**
 * @description: 专题活动列表
 * @param {*}
 * @return {*}
 */
export function getTopicAPI() {
    return httpInstance({
        url: '/topic',
        method: 'GET',
    });
}
