/**
 * 可变的「服务端」数据（购物车 / 收货地址 / 订单）
 * ---------------------------------------------------------------------------
 * 真正的后端是有状态的，所以这里也用一份内存数据模拟，并同步到本地存储，
 * 这样刷新页面之后购物车、地址、订单不会丢，演示体验更接近真实项目。
 */
import dayjs from 'dayjs';
import { buildAddresses, buildOrders, buildSeedCart, type AddressRecord, type OrderRecord } from './data/seed';
import { storage } from '@/utils/storage';

export interface MockCartItem {
    id: string;
    name: string;
    picture: string;
    price: string;
    count: number;
    skuId: string;
    attrsText: string;
    selected: boolean;
}

export interface MockDb {
    cart: MockCartItem[];
    addresses: AddressRecord[];
    orders: OrderRecord[];
}

const STORAGE_KEY = 'eshop621-mock-db-v1';

function createDb(): MockDb {
    const addresses = buildAddresses();
    return {
        cart: buildSeedCart(),
        addresses,
        orders: buildOrders(addresses),
    };
}

function readStorage(): MockDb | undefined {
    try {
        const raw = storage.getItem(STORAGE_KEY);
        if (!raw) return undefined;
        const parsed = JSON.parse(raw) as Partial<MockDb>;
        if (!parsed || !Array.isArray(parsed.cart) || !Array.isArray(parsed.addresses) || !Array.isArray(parsed.orders)) {
            return undefined;
        }
        return parsed as MockDb;
    } catch {
        return undefined;
    }
}

let db: MockDb = readStorage() ?? createDb();

/** 取当前数据 */
export function getDb(): MockDb {
    return db;
}

/** 把内存数据写回 localStorage */
export function saveDb(): void {
    try {
        storage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
        /* 存储不可用（隐私模式 / 空间不足）时忽略即可 */
    }
}

/** 恢复出厂设置（控制台里执行 __resetMockDb() 可以一键还原演示数据） */
export function resetDb(): MockDb {
    db = createDb();
    saveDb();
    return db;
}

/** 生成一个「像订单号」的长整型字符串 */
let autoIncrement = 0;
export function nextOrderId(): string {
    autoIncrement += 1;
    // 13 位时间戳 + 4 位自增 = 17 位订单号，纯字符串拼接，不会丢精度
    return `${Date.now()}${String(autoIncrement).padStart(4, '0')}`;
}

/** 生成一个地址 id */
export function nextAddressId(): string {
    autoIncrement += 1;
    return `addr-${Date.now()}-${autoIncrement}`;
}

/** 生成订单的各个时间节点 */
export function buildOrderTimes(now = dayjs()) {
    return {
        createTime: now.format('YYYY-MM-DD HH:mm:ss'),
        payLatestTime: now.add(30, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        arrivalEstimatedTime: now.add(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
    };
}
