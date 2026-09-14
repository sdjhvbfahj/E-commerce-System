/**
 * 假数据请求客户端
 * ---------------------------------------------------------------------------
 * 它和原来的 axios 实例保持完全一样的用法：
 *     httpInstance({ url, method, params, data })  =>  Promise<{ result }>
 * 所以页面、store、composables 一行都不用改。
 *
 * 内部做的事：匹配路由 -> 模拟网络延迟 -> 执行假数据处理器 -> 统一返回 { result }
 */
import { routes } from './routes';
import { clone, delay } from './utils/helper';
import { isMockError, type MockContext, type MockRequestConfig, type MockRoute } from './types';

export interface MockHttpError {
    message: string;
    response: {
        status: number;
        data: { message: string };
    };
}

function createError(status: number, message: string): MockHttpError {
    return { message, response: { status, data: { message } } };
}

/** 解析 url 里的 query（正常项目里参数都放在 config.params 里，这里只是兜底） */
function parseQuery(query = ''): Record<string, string> {
    const result: Record<string, string> = {};
    if (!query) return result;
    new URLSearchParams(query).forEach((value, key) => {
        result[key] = value;
    });
    return result;
}

/** 路径匹配（动态参数按段对齐） */
function matchRoute(method: string, segments: string[]): MockRoute | undefined {
    return routes.find((route) => {
        if (route.method !== method || route.segments.length !== segments.length) return false;
        return route.segments.every((segment, index) => {
            if (segment.startsWith(':')) return true;
            return segment === segments[index];
        });
    });
}

/** 核心请求方法 */
export async function mockRequest<T = any>(config: MockRequestConfig): Promise<{ result: T }> {
    const method = (config.method ?? 'GET').toUpperCase();
    const url = config.url ?? '';
    const [pathPart = '', queryPart = ''] = url.split('?');
    const segments = pathPart.split('/').filter(Boolean);
    const params: Record<string, any> = { ...parseQuery(queryPart), ...(config.params ?? {}) };

    const route = matchRoute(method, segments);

    // 模拟网络耗时，让 loading / 骨架屏效果看起来是真的在请求
    await delay();

    if (!route) {
        const message = `[mock] 未找到接口：${method} ${pathPart}`;
        console.warn(message);
        return Promise.reject(createError(404, message));
    }

    try {
        const ctx: MockContext = {
            url: pathPart,
            method,
            params,
            data: config.data ?? null,
            segments,
        };
        const result = route.handler(ctx) as T;
        return { result: clone(result) };
    } catch (error) {
        if (isMockError(error)) {
            return Promise.reject(createError(error.status, error.message));
        }
        console.error('[mock] 处理接口时出错：', error);
        return Promise.reject(createError(500, '假数据服务处理失败'));
    }
}

export default mockRequest;
