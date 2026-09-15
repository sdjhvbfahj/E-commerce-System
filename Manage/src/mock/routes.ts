/**
 * 路由表：把「请求」映射到「假数据处理器」
 * ---------------------------------------------------------------------------
 * 匹配规则：
 *   1. 先按 method + 路径段数匹配，段里以 : 开头的视为动态参数
 *   2. 静态路径优先（例如 /member/cart/selected 会先于 /member/cart/:skuId 命中）
 */
import { goodsRoutes } from './handlers/goods';
import { memberRoutes } from './handlers/member';
import { pageRoutes } from './handlers/page';
import { adminRoutes } from './handlers/admin';
import { userRoutes } from './handlers/user';
import type { MockHandler, MockRoute } from './types';

const staticRoutes: MockRoute[] = [];
const dynamicRoutes: MockRoute[] = [];

function push(method: string, path: string, handler: MockHandler) {
    const route: MockRoute = {
        method: method.toUpperCase(),
        segments: path.split('/').filter(Boolean),
        handler,
    };
    if (route.segments.some((segment) => segment.startsWith(':'))) {
        dynamicRoutes.push(route);
    } else {
        staticRoutes.push(route);
    }
}

/** 注册形如 { 'GET /home/banner': fn } 的路由表 */
function register(map: Record<string, MockHandler>) {
    Object.entries(map).forEach(([key, handler]) => {
        const spaceIndex = key.indexOf(' ');
        push(key.slice(0, spaceIndex), key.slice(spaceIndex + 1), handler);
    });
}

// 首页 / 分类 / 商品：除「二级分类商品列表」是 POST，其余都是 GET
Object.entries(goodsRoutes).forEach(([path, handler]) => {
    push(path === '/category/goods/temporary' ? 'POST' : 'GET', path, handler);
});

register(userRoutes);
register(memberRoutes);

// 内容型页面（帮助中心 / 关于我们 / 品牌专区 / 专题活动）都是 GET
Object.entries(pageRoutes).forEach(([path, handler]) => {
    push('GET', path, handler);
});

// 管理端接口（路径里自带 method 信息）
Object.entries(adminRoutes).forEach(([key, handler]) => {
    const spaceIndex = key.indexOf(' ');
    push(key.slice(0, spaceIndex), key.slice(spaceIndex + 1), handler);
});

/** 最终路由表：静态在前，动态在后 */
export const routes: MockRoute[] = [...staticRoutes, ...dynamicRoutes];
