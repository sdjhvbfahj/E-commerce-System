import { defineStore } from 'pinia'

export interface MenuItem {
    /** 路由地址（子菜单也是完整地址） */
    path: string;
    title: string;
    /** Element Plus 图标名（main.ts 里已全局注册） */
    icon: string;
    /** 需要的权限码，不填表示登录即可见 */
    permission?: string;
    children?: MenuItem[];
}

/**
 * 管理端全量菜单（对齐架构文档 AD-P01~P15 的页面清单）
 * 按当前登录角色的权限码过滤后，才是左侧真正显示的菜单。
 */
export const ADMIN_MENUS: MenuItem[] = [
    { path: '/dashboard', title: '数据概览', icon: 'Odometer', permission: 'dashboard:view' },
    {
        path: '/goods',
        title: '商品管理',
        icon: 'GoodsFilled',
        children: [
            { path: '/goods/list', title: '商品列表', icon: 'Goods', permission: 'goods:list' },
            { path: '/goods/category', title: '分类与品牌', icon: 'Grid', permission: 'category:update' },
        ],
    },
    {
        path: '/stock',
        title: '库存管理',
        icon: 'Box',
        children: [
            { path: '/stock/index', title: '库存管理', icon: 'Box', permission: 'stock:list' },
            { path: '/stock/flow', title: '库存流水', icon: 'Notebook', permission: 'stock:flow' },
        ],
    },
    {
        path: '/order',
        title: '订单中心',
        icon: 'Tickets',
        children: [
            { path: '/order/list', title: '订单列表', icon: 'List', permission: 'order:list' },
            { path: '/order/refund', title: '退款管理', icon: 'RefreshLeft', permission: 'refund:list' },
        ],
    },
    {
        path: '/cms',
        title: '内容运营',
        icon: 'PictureFilled',
        children: [
            { path: '/cms/banner', title: '轮播图管理', icon: 'Picture', permission: 'cms:list' },
            { path: '/cms/recommend', title: '推荐位与热榜', icon: 'Star', permission: 'cms:list' },
        ],
    },
    { path: '/member/list', title: '会员中心', icon: 'User', permission: 'member:list' },
    {
        path: '/rbac',
        title: '权限中心',
        icon: 'Lock',
        children: [
            { path: '/rbac/user', title: '账号管理', icon: 'UserFilled', permission: 'admin:list' },
            { path: '/rbac/role', title: '角色权限', icon: 'Key', permission: 'role:list' },
            { path: '/rbac/log', title: '操作日志', icon: 'Document', permission: 'log:list' },
        ],
    },
];

/**
 * 菜单权限
 * ---------------------------------------------------------------------------
 * 登录 / 角色权限变化时调用 buildMenus(permissions) 重新生成左侧菜单，
 * 角色管理页里改完权限，菜单立刻跟着变。
 */
export const usePermissionStore = defineStore('adminPermission', {
    state: () => ({
        menus: [] as MenuItem[],
        /** 当前菜单对应的「账号 + 权限码」签名，签名变化时重建菜单（换账号登录 / 权限变更） */
        menusKey: '',
        /** 折叠侧边栏 */
        collapsed: false,
    }),
    actions: {
        buildMenus(permissions: string[]) {
            const filter = (items: MenuItem[]): MenuItem[] =>
                items
                    .filter((item) => !item.permission || permissions.includes(item.permission))
                    .map((item) => (item.children ? { ...item, children: filter(item.children) } : item))
                    .filter((item) => !item.children || item.children.length > 0);
            this.menus = filter(ADMIN_MENUS);
        },
        /** 退出登录时清空菜单，避免下一个账号看到上一个账号的菜单 */
        clearMenus() {
            this.menus = [];
            this.menusKey = '';
        },
        toggleCollapsed() {
            this.collapsed = !this.collapsed;
        },
    },
});
