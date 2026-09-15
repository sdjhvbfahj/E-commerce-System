/**
 * 「服务器端」的初始数据：用户信息、收货地址、历史订单
 */
import dayjs from 'dayjs';
import { image } from '../utils/image';
import { money, price } from '../utils/helper';
import { products, type Product } from './products';

export interface UserInfoRecord {
    account: string;
    avatar: string;
    birthday: string;
    cityCode: string;
    gender: string;
    id: string;
    mobile: string;
    nickname: string;
    profession: string;
    provinceCode: string;
    token: string;
}

export interface AddressRecord {
    id: string;
    receiver: string;
    contact: string;
    provinceCode: string;
    cityCode: string;
    countyCode: string;
    address: string;
    isDefault: number;
    fullLocation: string;
    addressTags: string;
    postalCode: string;
}

export interface OrderSkuRecord {
    id: string;
    spuId: string;
    name: string;
    quantity: number;
    image: string;
    realPay: number;
    curPrice: number;
    totalMoney: number;
    attrsText: string;
    properties: Array<{ propertyMainName: string; propertyValueName: string }>;
}

export interface OrderRecord {
    id: string;
    createTime: string;
    payLatestTime: string;
    orderState: number;
    payState: number;
    payType: number;
    payChannel: number;
    payMoney: number;
    postFee: number;
    totalMoney: number;
    totalNum: number;
    countdown: number;
    deliveryTimeType: number;
    skus: OrderSkuRecord[];
    // 收货信息快照
    receiverContact: string;
    receiverMobile: string;
    provinceCode: string;
    cityCode: string;
    countyCode: string;
    receiverAddress: string;
    // 各节点时间
    payTime: string;
    consignTime: string;
    endTime: string;
    closeTime: string;
    evaluationTime: string;
    arrivalEstimatedTime: string;
}

/** 登录后返回的用户信息（任意账号都能登录，方便演示） */
export function buildUserInfo(account: string): UserInfoRecord {
    const name = account || '621电商用户';
    return {
        account: name,
        avatar: image(name, { width: 120, height: 120, seed: 66, label: name.slice(0, 2) }),
        birthday: '2002-06-18',
        cityCode: '330100',
        gender: '女',
        id: '10000001',
        mobile: '138****8899',
        nickname: name,
        profession: '学生',
        provinceCode: '330000',
        token: `mock-token-${Date.now()}`,
    };
}

/** 收货地址（isDefault === 0 表示默认地址，与页面逻辑保持一致） */
export function buildAddresses(): AddressRecord[] {
    return [
        {
            id: 'addr-1',
            receiver: '赵小燕',
            contact: '138****8899',
            provinceCode: '330000',
            cityCode: '330100',
            countyCode: '330106',
            address: '文三路 199 号 3 幢 502 室',
            isDefault: 0,
            fullLocation: '浙江省 杭州市 西湖区',
            addressTags: '家',
            postalCode: '310012',
        },
        {
            id: 'addr-2',
            receiver: '赵小燕',
            contact: '139****6677',
            provinceCode: '330000',
            cityCode: '330100',
            countyCode: '330110',
            address: '未来科技城海创园 5 号楼 8 层',
            isDefault: 1,
            fullLocation: '浙江省 杭州市 余杭区',
            addressTags: '公司',
            postalCode: '311121',
        },
        {
            id: 'addr-3',
            receiver: '李小明',
            contact: '137****1234',
            provinceCode: '320000',
            cityCode: '320100',
            countyCode: '320102',
            address: '中山路 100 号 12 栋 301',
            isDefault: 1,
            fullLocation: '江苏省 南京市 玄武区',
            addressTags: '学校',
            postalCode: '210018',
        },
    ];
}

/** 把商品转成订单里的商品行 */
export function toOrderSku(product: Product, quantity: number, skuIndex = 0): OrderSkuRecord {
    const sku = product.skus[skuIndex] ?? product.skus[0];
    const unitPrice = Number(product.price) || 0;
    const attrsText = sku?.specs.map((spec) => `${spec.name}：${spec.valueName}`).join(' ') ?? '';
    return {
        id: sku?.id ?? product.id,
        spuId: product.id,
        name: product.name,
        quantity,
        image: product.picture,
        realPay: money(unitPrice * quantity),
        curPrice: money(unitPrice),
        totalMoney: money(unitPrice * quantity),
        attrsText,
        properties:
            sku?.specs.map((spec) => ({
                propertyMainName: spec.name,
                propertyValueName: spec.valueName,
            })) ?? [],
    };
}

/** 历史订单号的前缀（2026-08-01 10:00 的时间戳，纯字符串拼接，不用大整数） */
const SEED_ORDER_BASE = String(Date.parse('2026-08-01T10:00:00+08:00'));

function buildOrder(
    index: number,
    orderState: number,
    picked: Array<{ product: Product; quantity: number }>,
    address: AddressRecord
): OrderRecord {
    const skus = picked.map((item) => toOrderSku(item.product, item.quantity));
    const totalMoney = money(skus.reduce((prev, item) => prev + item.realPay, 0));
    const postFee = totalMoney >= 99 ? 0 : 8;
    const payMoney = money(totalMoney + postFee);
    const totalNum = skus.reduce((prev, item) => prev + item.quantity, 0);

    const createAt = dayjs().subtract(index * 2 + 1, 'day').hour(10 + (index % 8)).minute(20 + index);
    const createTime = createAt.format('YYYY-MM-DD HH:mm:ss');
    const payLatestTime = createAt.add(30, 'minute').format('YYYY-MM-DD HH:mm:ss');
    const paid = orderState !== 1 && orderState !== 6;

    return {
        // 用字符串拼接生成订单号，避免大整数在 JS 里丢失精度
        id: `${SEED_ORDER_BASE}${String(1001 + index).padStart(4, '0')}`,
        createTime,
        payLatestTime,
        orderState,
        payState: paid ? 2 : 1,
        payType: 1,
        payChannel: 1,
        payMoney,
        postFee,
        totalMoney,
        totalNum,
        // 仅「待付款」显示倒计时，其余给 -1（PayInfo 用 -1 表示订单已超时/不可支付）
        countdown: orderState === 1 ? 1800 : -1,
        deliveryTimeType: (index % 3) + 1,
        skus,
        receiverContact: address.receiver,
        receiverMobile: address.contact,
        provinceCode: address.provinceCode,
        cityCode: address.cityCode,
        countyCode: address.countyCode,
        receiverAddress: address.address,
        payTime: paid ? createAt.add(3, 'minute').format('YYYY-MM-DD HH:mm:ss') : '',
        consignTime: orderState >= 3 && orderState !== 6 ? createAt.add(1, 'day').format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: orderState >= 4 && orderState !== 6 ? createAt.add(3, 'day').format('YYYY-MM-DD HH:mm:ss') : '',
        closeTime: orderState === 6 ? createAt.add(2, 'hour').format('YYYY-MM-DD HH:mm:ss') : '',
        evaluationTime: orderState === 5 ? createAt.add(4, 'day').format('YYYY-MM-DD HH:mm:ss') : '',
        arrivalEstimatedTime: createAt.add(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
    };
}

/** 10 笔历史订单，覆盖全部订单状态，方便看订单列表的分页与 tab 切换 */
export function buildOrders(addresses: AddressRecord[]): OrderRecord[] {
    const states = [1, 2, 3, 4, 5, 6, 2, 3, 5, 1];
    const indexes = [
        [18, 36],
        [0, 6],
        [24, 48],
        [12, 42],
        [30, 54],
        [3, 9],
        [19, 25],
        [37, 49],
        [1, 13],
        [43, 31],
    ];

    return states.map((state, orderIndex) => {
        const pickIndexes = indexes[orderIndex] ?? [0];
        const picked = pickIndexes
            .map((productIndex, i) => {
                const product = products[productIndex];
                return product ? { product, quantity: (i % 2) + 1 } : undefined;
            })
            .filter((item): item is { product: Product; quantity: number } => Boolean(item));
        const address = addresses[orderIndex % addresses.length] ?? addresses[0]!;
        return buildOrder(orderIndex, state, picked, address);
    });
}

/** 购物车初始数据（新用户登录后也能看到几件商品，方便演示下单流程） */
export function buildSeedCart() {
    return [0, 18, 36, 48]
        .map((productIndex, i) => {
            const product = products[productIndex];
            const sku = product?.skus[0];
            if (!product || !sku) return undefined;
            return {
                id: String(i + 1),
                name: product.name,
                picture: product.picture,
                price: price(Number(product.price) || 0),
                count: (i % 2) + 1,
                skuId: sku.id,
                attrsText: sku.specs.map((spec) => `${spec.name}：${spec.valueName}`).join(' '),
                selected: true,
            };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));
}
