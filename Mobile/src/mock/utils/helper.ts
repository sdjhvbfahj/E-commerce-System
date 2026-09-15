/**
 * mock 层通用小工具
 */

/** 模拟网络延迟，让 loading 效果看起来更真实（默认 60~200ms） */
export function delay(ms?: number): Promise<void> {
    const time = ms ?? 60 + Math.floor(Math.random() * 140);
    return new Promise((resolve) => setTimeout(resolve, time));
}

/** 只保留可 JSON 序列化的数据，避免把响应式对象/引用透传给页面 */
export function clone<T>(value: T): T {
    if (value === null || value === undefined) return value;
    return JSON.parse(JSON.stringify(value)) as T;
}

export interface PagedResult<T> {
    page: number;
    pageSize: number;
    pages: number;
    counts: number;
    items: T[];
}

/** 通用分页 */
export function paginate<T>(list: T[], page: number, pageSize: number): PagedResult<T> {
    const safePageSize = pageSize > 0 ? pageSize : 20;
    const safePage = page > 0 ? page : 1;
    const counts = list.length;
    const pages = Math.max(1, Math.ceil(counts / safePageSize));
    const start = (safePage - 1) * safePageSize;
    return {
        page: safePage,
        pageSize: safePageSize,
        pages,
        counts,
        items: list.slice(start, start + safePageSize),
    };
}

/** 价格统一保留两位小数（接口里价格都是字符串） */
export function price(value: number): string {
    return value.toFixed(2);
}

/** 数字金额保留两位小数（金额类字段接口里是 number） */
export function money(value: number): number {
    return Math.round(value * 100) / 100;
}

/** 数组洗牌（用固定种子，保证每次刷新顺序一致） */
export function shuffle<T>(list: T[], seed = 2024): T[] {
    const result = [...list];
    let random = seed;
    const next = () => {
        random = (random * 9301 + 49297) % 233280;
        return random / 233280;
    };
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        const a = result[i];
        const b = result[j];
        if (a !== undefined && b !== undefined) {
            result[i] = b;
            result[j] = a;
        }
    }
    return result;
}
