import httpInstance from '@/mock'

/** ---------------------------------------------------------------- 数据概览 */

/**
 * @description: 数据概览（指标卡 / 近 7 日趋势 / 热销榜 / 类目占比 / 库存预警）
 */
export function getDashboardAPI() {
    return httpInstance({ url: '/admin/dashboard', method: 'GET' });
}

/** ---------------------------------------------------------------- 内容运营 */

/**
 * @description: 轮播图列表
 */
export function getBannerListAPI() {
    return httpInstance({ url: '/admin/cms/banners', method: 'GET' });
}

/**
 * @description: 新增 / 编辑轮播图
 */
export function saveBannerAPI(
    id: string | undefined,
    data: { title: string; slogan: string; hrefUrl: string; distributionSite: number; sort: number; status: number },
) {
    return httpInstance({ url: id ? `/admin/cms/banners/${id}` : '/admin/cms/banners', method: id ? 'PUT' : 'POST', data });
}

/**
 * @description: 启用 / 停用轮播图
 */
export function toggleBannerAPI(id: string) {
    return httpInstance({ url: `/admin/cms/banners/${id}/status`, method: 'PUT' });
}

/**
 * @description: 删除轮播图
 */
export function deleteBannerAPI(id: string) {
    return httpInstance({ url: `/admin/cms/banners/${id}`, method: 'DELETE' });
}

/**
 * @description: 推荐位列表（含商品）
 */
export function getSlotListAPI() {
    return httpInstance({ url: '/admin/cms/slots', method: 'GET' });
}

/**
 * @description: 保存推荐位商品
 */
export function updateSlotAPI(id: string, data: { goodsIds: string[]; status: number }) {
    return httpInstance({ url: `/admin/cms/slots/${id}`, method: 'PUT', data });
}

/**
 * @description: 热榜列表（含商品）
 */
export function getHotListAPI() {
    return httpInstance({ url: '/admin/cms/hot', method: 'GET' });
}

/**
 * @description: 保存热榜商品
 */
export function updateHotAPI(id: string, data: { goodsIds: string[]; status: number }) {
    return httpInstance({ url: `/admin/cms/hot/${id}`, method: 'PUT', data });
}

/** ---------------------------------------------------------------- 会员中心 */

/**
 * @description: 会员列表（分页 + 关键词 + 等级 + 状态）
 */
export function getMemberListAPI(params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    level?: number;
    status?: number;
}) {
    return httpInstance({ url: '/admin/members', method: 'GET', params });
}

/**
 * @description: 启用 / 禁用会员
 */
export function toggleMemberStatusAPI(id: string) {
    return httpInstance({ url: `/admin/members/${id}/status`, method: 'PUT' });
}

/** ---------------------------------------------------------------- 权限中心 */

/**
 * @description: 管理员账号列表（分页 + 关键词 + 角色 + 状态）
 */
export function getAdminUserListAPI(params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    roleCode?: string;
    status?: number;
}) {
    return httpInstance({ url: '/admin/users', method: 'GET', params });
}

/**
 * @description: 新增管理员账号
 */
export function createAdminUserAPI(data: {
    username: string;
    password: string;
    realName: string;
    roleCode: string;
    phone: string;
    email: string;
    remark: string;
}) {
    return httpInstance({ url: '/admin/users', method: 'POST', data });
}

/**
 * @description: 编辑管理员账号
 */
export function updateAdminUserAPI(id: string, data: {
    username: string;
    realName: string;
    roleCode: string;
    phone: string;
    email: string;
    remark: string;
}) {
    return httpInstance({ url: `/admin/users/${id}`, method: 'PUT', data });
}

/**
 * @description: 启用 / 停用账号
 */
export function toggleAdminUserStatusAPI(id: string) {
    return httpInstance({ url: `/admin/users/${id}/status`, method: 'PUT' });
}

/**
 * @description: 重置密码
 */
export function resetAdminUserPasswordAPI(id: string, password: string) {
    return httpInstance({ url: `/admin/users/${id}/password`, method: 'PUT', data: { password } });
}

/**
 * @description: 删除账号
 */
export function deleteAdminUserAPI(id: string) {
    return httpInstance({ url: `/admin/users/${id}`, method: 'DELETE' });
}

/**
 * @description: 角色列表（含权限码）
 */
export function getRoleListAPI() {
    return httpInstance({ url: '/admin/roles', method: 'GET' });
}

/**
 * @description: 新增角色
 */
export function createRoleAPI(data: { name: string; code: string; desc: string }) {
    return httpInstance({ url: '/admin/roles', method: 'POST', data });
}

/**
 * @description: 编辑角色基本信息
 */
export function updateRoleAPI(id: string, data: { name: string; desc: string }) {
    return httpInstance({ url: `/admin/roles/${id}`, method: 'PUT', data });
}

/**
 * @description: 保存角色权限
 */
export function updateRolePermissionsAPI(id: string, permissions: string[]) {
    return httpInstance({ url: `/admin/roles/${id}/permissions`, method: 'PUT', data: { permissions } });
}

/** ---------------------------------------------------------------- 操作日志 */

/**
 * @description: 操作日志（分页 + 关键词 + 模块 + 结果）
 */
export function getLogListAPI(params: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    module?: string;
    result?: string;
}) {
    return httpInstance({ url: '/admin/logs', method: 'GET', params });
}
