/** mock 层的公共类型与错误工具 */

export interface MockRequestConfig {
    url: string;
    method?: string;
    /** query 参数（对齐 axios 的宽松类型，允许传 interface 定义的对象） */
    params?: any;
    /** 请求体 */
    data?: any;
}

export interface MockContext {
    /** 完整请求地址，例如 /member/cart/150000101 */
    url: string;
    method: string;
    /** query 参数 */
    params: Record<string, any>;
    /** 请求体 */
    data: any;
    /** 路径分段，例如 ['member','cart','150000101'] */
    segments: string[];
}

export type MockHandler = (ctx: MockContext) => unknown;

export interface MockRoute {
    method: string;
    /** 路径分段，以 : 开头的段是动态参数 */
    segments: string[];
    handler: MockHandler;
}

/** mock 业务错误（会被客户端转换成类似 axios 的 error 结构） */
export interface MockError {
    __mockError: true;
    status: number;
    message: string;
}

/** 抛出业务错误，页面上的 catch / ElMessage 会拿到 message */
export function fail(status: number, message: string): never {
    const error: MockError = { __mockError: true, status, message };
    throw error;
}

/** 判断是不是 mock 业务错误 */
export function isMockError(value: unknown): value is MockError {
    return Boolean(value && typeof value === 'object' && (value as MockError).__mockError);
}

/** 把 query 里的值统一转成字符串 */
export function toText(value: unknown, fallback = ''): string {
    if (value === undefined || value === null) return fallback;
    return String(value);
}

/** 把 query 里的值统一转成数字 */
export function toNumber(value: unknown, fallback = 0): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}
