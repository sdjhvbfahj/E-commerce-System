import httpInstance from '@/mock'

/**
 * @description: 管理端登录
 * @param {string} username 账号
 * @param {string} password 密码（演示环境 6 位以上即可）
 */
export function loginAPI(data: { username: string; password: string }) {
    return httpInstance({ url: '/admin/login', method: 'POST', data });
}

/**
 * @description: 当前登录管理员信息
 */
export function getProfileAPI(username: string) {
    return httpInstance({ url: '/admin/profile', method: 'GET', params: { username } });
}

/**
 * @description: 全量权限分组（角色配置用）
 */
export function getPermissionListAPI() {
    return httpInstance({ url: '/admin/permissions', method: 'GET' });
}
