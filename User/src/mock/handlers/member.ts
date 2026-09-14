/**
 * 会员相关假接口：购物车 / 收货地址 / 订单
 * 对应的真实接口：
 *   GET/POST/DELETE /member/cart、PUT /member/cart/:skuId、PUT /member/cart/selected
 *   POST /member/cart/merge
 *   POST/PUT/DELETE /member/address
 *   GET /member/order/pre、GET/POST /member/order、GET /member/order/:id
 *
 * 额外补充了一个「假支付」接口 POST /member/order/:id/pay，
 * 用来模拟支付宝回调，让支付成功页能真的把订单状态改成「待发货」。
 */
import { buildOrderTimes, getDb, nextAddressId, nextOrderId, saveDb, type MockCartItem } from '../db';
import { toOrderSku } from '../data/seed';
import { skuMap } from '../data/products';
import { money, paginate } from '../utils/helper';
import { fail, toNumber, toText, type MockContext } from '../types';

/** 根据 skuId 生成一条购物车记录 */
function createCartItem(skuId: string, count: number, selected = true): MockCartItem {
    const record = skuMap.get(skuId);
    if (!record) fail(400, `商品规格 ${skuId} 不存在`);
    return {
        id: `${skuId}`,
        name: record.product.name,
        picture: record.product.picture,
        price: record.product.price,
        count: Math.max(1, count || 1),
        skuId,
        attrsText: record.attrsText,
        selected,
    };
}

/** 把 skuId 写进购物车（已存在则累加数量） */
function upsertCart(skuId: string, count: number, selected = true) {
    const db = getDb();
    const exist = db.cart.find((item) => item.skuId === skuId);
    if (exist) {
        exist.count += Math.max(1, count || 1);
        exist.selected = selected;
    } else {
        db.cart.push(createCartItem(skuId, count, selected));
    }
    saveDb();
}

/** 结合购物车算金额明细 */
function buildSummary(items: MockCartItem[]) {
    const goodsCount = items.reduce((prev, item) => prev + item.count, 0);
    const totalPrice = money(items.reduce((prev, item) => prev + Number(item.price || 0) * item.count, 0));
    const postFee = totalPrice >= 99 || totalPrice === 0 ? 0 : 8;
    const discountPrice = 0;
    return {
        goodsCount,
        totalPrice,
        postFee,
        discountPrice,
        totalPayPrice: money(totalPrice + postFee - discountPrice),
    };
}

export const memberRoutes = {
    /** 获取购物车列表（未登录也返回本地假购物车，避免首屏 401） */
    'GET /member/cart': () => getDb().cart,

    /** 加入购物车 */
    'POST /member/cart': (ctx: MockContext) => {
        const data = ctx.data ?? {};
        upsertCart(toText(data.skuId), toNumber(data.count, 1), true);
        return null;
    },

    /** 合并购物车（登录时把未登录的本地购物车合并进去） */
    'POST /member/cart/merge': (ctx: MockContext) => {
        const list = Array.isArray(ctx.data) ? ctx.data : [];
        list.forEach((item: any) => {
            if (!item?.skuId) return;
            upsertCart(toText(item.skuId), toNumber(item.count, 1), item.selected !== false);
        });
        return null;
    },

    /** 删除购物车（支持批量） */
    'DELETE /member/cart': (ctx: MockContext) => {
        const ids: string[] = Array.isArray(ctx.data?.ids) ? ctx.data.ids.map((id: unknown) => String(id)) : [];
        const db = getDb();
        db.cart = db.cart.filter((item) => !ids.includes(item.skuId));
        saveDb();
        return null;
    },

    /** 修改全选状态 */
    'PUT /member/cart/selected': (ctx: MockContext) => {
        const selected = Boolean(ctx.data?.selected);
        const ids: string[] = Array.isArray(ctx.data?.ids) ? ctx.data.ids.map((id: unknown) => String(id)) : [];
        const db = getDb();
        db.cart.forEach((item) => {
            if (ids.length === 0 || ids.includes(item.skuId)) item.selected = selected;
        });
        saveDb();
        return null;
    },

    /** 修改单个商品的选中状态 / 数量 */
    'PUT /member/cart/:skuId': (ctx: MockContext) => {
        const skuId = toText(ctx.segments[2]);
        const db = getDb();
        const item = db.cart.find((row) => row.skuId === skuId);
        if (!item) fail(404, '购物车中没有该商品');
        if (ctx.data?.selected !== undefined) item.selected = Boolean(ctx.data.selected);
        if (ctx.data?.count !== undefined) item.count = Math.max(1, toNumber(ctx.data.count, item.count));
        saveDb();
        return null;
    },

    /** 结算页数据：收货地址 + 已选商品 + 金额明细 */
    'GET /member/order/pre': () => {
        const db = getDb();
        const selectedList = db.cart.filter((item) => item.selected);
        return {
            userAddresses: db.addresses,
            goods: selectedList.map((item) => {
                const total = money(Number(item.price || 0) * item.count);
                return {
                    id: item.skuId,
                    name: item.name,
                    picture: item.picture,
                    count: item.count,
                    skuId: item.skuId,
                    attrsText: item.attrsText,
                    price: item.price,
                    payPrice: item.price,
                    totalPrice: total.toFixed(2),
                    totalPayPrice: total.toFixed(2),
                };
            }),
            summary: buildSummary(selectedList),
        };
    },

    /** 提交订单 */
    'POST /member/order': (ctx: MockContext) => {
        const db = getDb();
        const data = ctx.data ?? {};
        const goods: Array<{ skuId: string; count: number }> = Array.isArray(data.goods) ? data.goods : [];
        if (goods.length === 0) fail(400, '请先选择要购买的商品');

        const rows = goods.map((item) => {
            const record = skuMap.get(String(item.skuId));
            if (!record) fail(400, '商品规格不存在');
            const skuIndex = record.product.skus.findIndex((sku) => sku.id === record.sku.id);
            return toOrderSku(record.product, toNumber(item.count, 1), skuIndex < 0 ? 0 : skuIndex);
        });

        const address = db.addresses.find((item) => item.id === data.addressId) ?? db.addresses[0];
        if (!address) fail(400, '请先添加收货地址');

        const totalMoney = money(rows.reduce((prev, item) => prev + item.realPay, 0));
        const postFee = totalMoney >= 99 ? 0 : 8;
        const summary = buildSummary(
            db.cart.filter((item) => item.selected && goods.some((g) => String(g.skuId) === item.skuId))
        );
        const times = buildOrderTimes();
        const orderId = nextOrderId();

        const order = {
            id: orderId,
            createTime: times.createTime,
            payLatestTime: times.payLatestTime,
            orderState: 1,
            payState: 1,
            payType: toNumber(data.payType, 1),
            payChannel: toNumber(data.payChannel, 1),
            payMoney: money(totalMoney + postFee),
            postFee,
            totalMoney,
            totalNum: rows.reduce((prev, item) => prev + item.quantity, 0),
            countdown: 1800,
            deliveryTimeType: toNumber(data.deliveryTimeType, 1),
            skus: rows,
            receiverContact: address.receiver,
            receiverMobile: address.contact,
            provinceCode: address.provinceCode,
            cityCode: address.cityCode,
            countyCode: address.countyCode,
            receiverAddress: `${address.fullLocation} ${address.address}`,
            payTime: '',
            consignTime: '',
            endTime: '',
            closeTime: '',
            evaluationTime: '',
            arrivalEstimatedTime: times.arrivalEstimatedTime,
        };

        db.orders.unshift(order);
        // 下单成功后，把已下单的商品从购物车里移除（和真实后端行为一致）
        const orderedIds = goods.map((item) => String(item.skuId));
        db.cart = db.cart.filter((item) => !orderedIds.includes(item.skuId));
        saveDb();

        return { ...order, skus: null, _summary: summary };
    },

    /** 订单列表（orderState = 0 表示全部） */
    'GET /member/order': (ctx: MockContext) => {
        const db = getDb();
        const orderState = toNumber(ctx.params.orderState, 0);
        const list = db.orders
            .filter((order) => orderState === 0 || order.orderState === orderState)
            .slice()
            .sort((a, b) => (a.createTime < b.createTime ? 1 : -1));
        return paginate(list, toNumber(ctx.params.page, 1), toNumber(ctx.params.pageSize, 2));
    },

    /** 订单详情（支付页 / 支付结果页） */
    'GET /member/order/:id': (ctx: MockContext) => {
        const id = toText(ctx.segments[2]);
        const order = getDb().orders.find((item) => item.id === id);
        if (!order) fail(404, '订单不存在');
        return order;
    },

    /** 【假支付】模拟支付宝回调成功：待付款 -> 待发货 */
    'POST /member/order/:id/pay': (ctx: MockContext) => {
        const id = toText(ctx.segments[2]);
        const db = getDb();
        const order = db.orders.find((item) => item.id === id);
        if (!order) fail(404, '订单不存在');
        order.orderState = 2;
        order.payState = 2;
        order.countdown = -1;
        order.payTime = buildOrderTimes().createTime;
        saveDb();
        return order;
    },

    /** 新增收货地址 */
    'POST /member/address': (ctx: MockContext) => {
        const db = getDb();
        const data = ctx.data ?? {};
        const isDefault = toNumber(data.isDefault, 1);
        if (isDefault === 0) db.addresses.forEach((item) => (item.isDefault = 1));
        const address = {
            id: nextAddressId(),
            receiver: toText(data.receiver, '收货人'),
            contact: toText(data.contact),
            provinceCode: toText(data.provinceCode),
            cityCode: toText(data.cityCode),
            countyCode: toText(data.countyCode),
            address: toText(data.address),
            isDefault,
            fullLocation: toText(data.fullLocation) || '浙江省 杭州市 西湖区',
            addressTags: toText(data.addressTags, '家'),
            postalCode: toText(data.postalCode, '310000'),
        };
        db.addresses.push(address);
        saveDb();
        return address;
    },

    /** 修改收货地址 */
    'PUT /member/address/:id': (ctx: MockContext) => {
        const id = toText(ctx.segments[2]);
        const db = getDb();
        const address = db.addresses.find((item) => item.id === id);
        if (!address) fail(404, '地址不存在');
        const data = ctx.data ?? {};
        Object.assign(address, {
            receiver: toText(data.receiver, address.receiver),
            contact: toText(data.contact, address.contact),
            provinceCode: toText(data.provinceCode, address.provinceCode),
            cityCode: toText(data.cityCode, address.cityCode),
            countyCode: toText(data.countyCode, address.countyCode),
            address: toText(data.address, address.address),
            postalCode: toText(data.postalCode, address.postalCode),
            addressTags: toText(data.addressTags, address.addressTags),
            isDefault: toNumber(data.isDefault, address.isDefault),
        });
        if (address.isDefault === 0) {
            db.addresses.forEach((item) => {
                if (item.id !== address.id) item.isDefault = 1;
            });
        }
        saveDb();
        return address;
    },

    /** 删除收货地址 */
    'DELETE /member/address/:id': (ctx: MockContext) => {
        const id = toText(ctx.segments[2]);
        const db = getDb();
        db.addresses = db.addresses.filter((item) => item.id !== id);
        saveDb();
        return null;
    },
};
