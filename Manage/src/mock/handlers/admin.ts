/**
 * 管理端假接口
 * ---------------------------------------------------------------------------
 * 登录与权限 / 数据概览 / 商品 / 分类品牌 / 库存 / 订单 / 退款 / 内容运营 / 会员 / 操作日志
 *
 * 写操作都会真的改内存数据（并持久化到 localStorage），同时写一条操作日志，
 * 这样「角色权限配置 → 菜单按钮变化」「改价 → 概览数据变化」这类演示都是真的。
 */
import dayjs from 'dayjs';
import { image } from '../utils/image';
import { fail, toNumber, toText, type MockContext } from '../types';
import { money, paginate, price, shuffle } from '../utils/helper';
import { products, productMap, skuMap, type Product } from '../data/products';
import { getDb } from '../db';
import type { OrderRecord } from '../data/seed';
import {
    ALL_PERMISSIONS, PERMISSIONS, appendLog, buildOrderStats, buildTrend, effectivePrice,
    getAdminDb, isOnShelf, saveAdminDb,
} from '../data/admin';

/** 统一的「当前时间」字符串 */
const nowText = () => dayjs().format('YYYY-MM-DD HH:mm:ss');

/** 校验并返回当前登录的管理员（登录接口会把当前用户写进 adminDb.currentUser） */
function currentUser() {
    const db = getAdminDb();
    const user = db.currentUser;
    if (!user) fail(401, '登录状态已失效，请重新登录');
    return user;
}

function roleNameOf(code: string): string {
    return getAdminDb().roles.find((role) => role.code === code)?.name ?? code;
}

function logIt(module: string, action: string, detail: string, result?: '成功' | '失败') {
    const user = currentUser();
    appendLog({ username: user.username, realName: user.realName, module, action, detail, result });
}

/* ================================================================ 登录与权限 */

function login(ctx: MockContext) {
    const data = ctx.data ?? {};
    const username = toText(data.username).trim();
    const password = toText(data.password);
    if (!username) fail(400, '请输入账号');
    if (password.length < 6) fail(400, '密码长度至少 6 位');

    const db = getAdminDb();
    const user = db.users.find((item) => item.username === username);
    if (!user) fail(400, '账号不存在');
    if (user.password !== password) fail(400, '账号或密码错误');
    if (user.status === 0) fail(403, '该账号已被停用，请联系管理员');

    const role = db.roles.find((item) => item.code === user.roleCode);
    db.currentUser = {
        id: user.id,
        username: user.username,
        realName: user.realName,
        roleCode: user.roleCode,
        roleName: role?.name ?? user.roleName,
    };
    user.lastLoginAt = nowText();
    saveAdminDb();
    appendLog({ username: user.username, realName: user.realName, module: '登录', action: '登录成功', detail: `账号 ${user.username} 登录管理端` });

    return {
        token: `mock-token-${user.id}-${Date.now()}`,
        adminInfo: {
            id: user.id,
            username: user.username,
            realName: user.realName,
            avatar: '',
            roleCode: user.roleCode,
            roleName: role?.name ?? user.roleName,
            permissions: role?.permissions ?? [],
        },
    };
}

function profile(ctx: MockContext) {
    const username = toText(ctx.params.username || currentUser().username);
    const db = getAdminDb();
    const user = db.users.find((item) => item.username === username);
    if (!user) fail(404, '账号不存在');
    const role = db.roles.find((item) => item.code === user.roleCode);
    return {
        id: user.id,
        username: user.username,
        realName: user.realName,
        avatar: '',
        roleCode: user.roleCode,
        roleName: role?.name ?? user.roleName,
        permissions: role?.permissions ?? [],
        lastLoginAt: user.lastLoginAt,
    };
}

/** 管理员账号列表（带角色名、权限数） */
function adminUsers(ctx: MockContext) {
    const db = getAdminDb();
    const keyword = toText(ctx.params.keyword).trim();
    const roleCode = toText(ctx.params.roleCode);
    const status = toNumber(ctx.params.status, -1);

    let list = db.users.map((user) => ({
        ...user,
        password: '',
        permissionCount: db.roles.find((role) => role.code === user.roleCode)?.permissions.length ?? 0,
    }));
    if (keyword) list = list.filter((item) => item.username.includes(keyword) || item.realName.includes(keyword));
    if (roleCode) list = list.filter((item) => item.roleCode === roleCode);
    if (status >= 0) list = list.filter((item) => item.status === status);

    return paginate(list, toNumber(ctx.params.page, 1), toNumber(ctx.params.pageSize, 10));
}

function saveAdminUser(ctx: MockContext, id?: string) {
    const db = getAdminDb();
    const data = ctx.data ?? {};
    const username = toText(data.username).trim();
    const realName = toText(data.realName).trim();
    const roleCode = toText(data.roleCode);
    if (!username) fail(400, '请输入登录账号');
    if (!realName) fail(400, '请输入姓名');
    if (!roleCode) fail(400, '请选择角色');

    const role = db.roles.find((item) => item.code === roleCode);
    if (!role) fail(400, '角色不存在');

    if (id) {
        const user = db.users.find((item) => item.id === id);
        if (!user) fail(404, '账号不存在');
        if (user.username === 'admin' && roleCode !== 'ADMIN') fail(400, '内置超管账号不能修改角色');
        if (db.users.some((item) => item.username === username && item.id !== id)) fail(400, '登录账号已存在');
        Object.assign(user, { username, realName, roleCode, roleName: role.name, phone: toText(data.phone), email: toText(data.email), remark: toText(data.remark) });
        saveAdminDb();
        logIt('权限中心', '编辑管理员', `账号 ${username}（${role.name}）`);
        return user;
    }

    if (db.users.some((item) => item.username === username)) fail(400, '登录账号已存在');
    if (toText(data.password).length < 6) fail(400, '初始密码至少 6 位');
    const user = {
        id: `u-${Date.now()}`,
        username,
        password: toText(data.password) || '123456',
        realName,
        roleCode,
        roleName: role.name,
        status: 1 as const,
        phone: toText(data.phone),
        email: toText(data.email),
        createdAt: nowText(),
        lastLoginAt: '',
        remark: toText(data.remark),
    };
    db.users.unshift(user);
    role.userCount += 1;
    saveAdminDb();
    logIt('权限中心', '新增管理员', `新增账号 ${username}（${role.name}）`);
    return user;
}

function toggleAdminUser(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const user = db.users.find((item) => item.id === id);
    if (!user) fail(404, '账号不存在');
    if (user.username === 'admin') fail(400, '内置超管账号不允许停用');
    user.status = user.status === 1 ? 0 : 1;
    saveAdminDb();
    logIt('权限中心', user.status === 1 ? '启用账号' : '停用账号', `账号 ${user.username}`);
    return user;
}

function removeAdminUser(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const user = db.users.find((item) => item.id === id);
    if (!user) fail(404, '账号不存在');
    if (user.username === 'admin') fail(400, '内置超管账号不允许删除');
    db.users = db.users.filter((item) => item.id !== id);
    saveAdminDb();
    logIt('权限中心', '删除管理员', `账号 ${user.username}`);
    return { id };
}

function updatePassword(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const user = db.users.find((item) => item.id === id);
    if (!user) fail(404, '账号不存在');
    const password = toText(ctx.data?.password);
    if (password.length < 6) fail(400, '密码长度至少 6 位');
    user.password = password;
    saveAdminDb();
    logIt('权限中心', '重置密码', `账号 ${user.username}`);
    return { id };
}

function roleList() {
    const db = getAdminDb();
    return db.roles.map((role) => ({
        ...role,
        userCount: db.users.filter((user) => user.roleCode === role.code).length,
        permissionCount: role.permissions.length,
    }));
}

function updateRolePermissions(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const role = db.roles.find((item) => item.id === id);
    if (!role) fail(404, '角色不存在');
    const permissions = (ctx.data?.permissions ?? []) as string[];
    const invalid = permissions.filter((code) => !ALL_PERMISSIONS.includes(code));
    if (invalid.length) fail(400, `存在未知权限码：${invalid.join('、')}`);
    role.permissions = permissions;
    // 同步角色下账号的展示名
    saveAdminDb();
    logIt('权限中心', '修改角色权限', `角色「${role.name}」权限数量 ${permissions.length}`);
    return role;
}

function updateRole(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const role = db.roles.find((item) => item.id === id);
    if (!role) fail(404, '角色不存在');
    if (role.builtIn) fail(400, '内置角色不允许编辑基本信息');
    role.name = toText(ctx.data?.name) || role.name;
    role.desc = toText(ctx.data?.desc) || role.desc;
    saveAdminDb();
    logIt('权限中心', '编辑角色', `角色「${role.name}」`);
    return role;
}

function createRole(ctx: MockContext) {
    const db = getAdminDb();
    const name = toText(ctx.data?.name).trim();
    if (!name) fail(400, '请输入角色名称');
    const code = toText(ctx.data?.code).trim().toUpperCase();
    if (!code) fail(400, '请输入角色编码');
    if (db.roles.some((item) => item.code === code)) fail(400, '角色编码已存在');
    const role = {
        id: `r-${Date.now()}`,
        code,
        name,
        desc: toText(ctx.data?.desc),
        builtIn: false,
        permissions: ['dashboard:view'],
        userCount: 0,
        createdAt: nowText(),
    };
    db.roles.push(role);
    saveAdminDb();
    logIt('权限中心', '新增角色', `角色「${name}」`);
    return role;
}

/* ================================================================ 会员 */

function memberList(ctx: MockContext) {
    const db = getAdminDb();
    const keyword = toText(ctx.params.keyword).trim();
    const level = toNumber(ctx.params.level, -1);
    const status = toNumber(ctx.params.status, -1);

    let list = [...db.members];
    if (keyword) {
        list = list.filter((item) => item.nickname.includes(keyword) || item.account.includes(keyword) || item.phone.includes(keyword));
    }
    if (level > 0) list = list.filter((item) => item.level === level);
    if (status >= 0) list = list.filter((item) => item.status === status);
    return paginate(list, toNumber(ctx.params.page, 1), toNumber(ctx.params.pageSize, 10));
}

function toggleMember(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const member = db.members.find((item) => item.id === id);
    if (!member) fail(404, '会员不存在');
    member.status = member.status === 1 ? 0 : 1;
    saveAdminDb();
    logIt('会员中心', member.status === 1 ? '启用会员' : '禁用会员', `会员 ${member.nickname}（${member.account}）`);
    return member;
}

/* ================================================================ 商品 */

function toAdminGoods(product: Product) {
    const db = getAdminDb();
    const skus = [...skuMap.values()].filter((record) => record.product.id === product.id);
    const stock = db.stock.filter((item) => item.goodsId === product.id);
    const current = effectivePrice(product);
    return {
        id: product.id,
        name: product.name,
        desc: product.desc,
        picture: product.picture,
        mainPictures: product.mainPictures,
        catId: product.catId,
        catName: product.catName,
        subId: product.subId,
        subName: product.subName,
        brandId: product.brand.id,
        brandName: product.brand.name,
        price: current.price,
        oldPrice: current.oldPrice,
        /** 1 上架 0 下架 */
        status: isOnShelf(product) ? 1 : 0,
        salesCount: product.salesCount,
        commentCount: product.commentCount,
        collectCount: product.collectCount,
        skuCount: skus.length,
        stockTotal: stock.reduce((sum, item) => sum + item.total, 0),
        stockAvailable: stock.reduce((sum, item) => sum + item.available, 0),
        stockWarn: stock.some((item) => item.available <= item.warn),
        specs: product.specs,
        skus: product.skus,
        details: product.details,
        updatedAt: nowText(),
    };
}

function goodsList(ctx: MockContext) {
    const db = getAdminDb();
    const keyword = toText(ctx.params.keyword).trim();
    const catId = toText(ctx.params.catId);
    const subId = toText(ctx.params.subId);
    const status = toNumber(ctx.params.status, -1);

    let list = products.map(toAdminGoods);
    if (keyword) list = list.filter((item) => item.name.includes(keyword) || item.desc.includes(keyword));
    if (catId) list = list.filter((item) => item.catId === catId);
    if (subId) list = list.filter((item) => item.subId === subId);
    if (status >= 0) list = list.filter((item) => item.status === status);

    // 上架中的排前面，再按销量倒序
    list.sort((a, b) => b.status - a.status || b.salesCount - a.salesCount);
    return paginate(list, toNumber(ctx.params.page, 1), toNumber(ctx.params.pageSize, 10));
}

function goodsDetail(ctx: MockContext, id: string) {
    const product = productMap.get(id);
    if (!product) fail(404, '商品不存在');
    return toAdminGoods(product);
}

function updateGoods(ctx: MockContext, id: string) {
    const product = productMap.get(id);
    if (!product) fail(404, '商品不存在');
    const db = getAdminDb();
    const data = ctx.data ?? {};
    const nextPrice = toText(data.price) || product.price;
    const nextOldPrice = toText(data.oldPrice) || product.oldPrice;
    if (Number(nextPrice) <= 0) fail(400, '售价必须大于 0');

    // 假数据层的商品是模块级常量，改价/改名走「覆盖表」，刷新也不会丢
    db.goodsPrice[id] = { price: price(Number(nextPrice)), oldPrice: price(Number(nextOldPrice)), version: (db.goodsPrice[id]?.version ?? 0) + 1 };
    if (toText(data.name)) product.name = toText(data.name);
    if (toText(data.desc)) product.desc = toText(data.desc);
    saveAdminDb();

    const diff = Number(nextPrice) - Number(product.price);
    logIt('商品管理', '编辑商品', `${product.name} 价格 ${product.price} → ${nextPrice}（${diff >= 0 ? '+' : ''}${money(diff)}）`);
    return toAdminGoods(product);
}

function toggleGoodsShelf(ctx: MockContext, id: string) {
    const product = productMap.get(id);
    if (!product) fail(404, '商品不存在');
    const db = getAdminDb();
    const next = isOnShelf(product) ? 0 : 1;
    db.goodsStatus[id] = next as 0 | 1;
    saveAdminDb();
    logIt('商品管理', next === 1 ? '商品上架' : '商品下架', product.name);
    return { id, status: next };
}

function batchGoodsShelf(ctx: MockContext) {
    const ids = (ctx.data?.ids ?? []) as string[];
    const target = toNumber(ctx.data?.status, 1);
    if (!ids.length) fail(400, '请选择商品');
    const db = getAdminDb();
    const names: string[] = [];
    ids.forEach((id) => {
        const product = productMap.get(id);
        if (!product) return;
        db.goodsStatus[id] = target as 0 | 1;
        names.push(product.name);
    });
    saveAdminDb();
    logIt('商品管理', target === 1 ? '批量上架' : '批量下架', `${names.length} 件商品：${names.slice(0, 3).join('、')}${names.length > 3 ? ' 等' : ''}`);
    return { count: names.length };
}

function createGoods(ctx: MockContext) {
    const db = getAdminDb();
    const name = toText(ctx.data?.name).trim();
    const catId = toText(ctx.data?.catId);
    const subId = toText(ctx.data?.subId);
    const brandId = toText(ctx.data?.brandId);
    const goodsPrice = Number(toText(ctx.data?.price));
    if (!name) fail(400, '请输入商品名称');
    if (!catId || !subId) fail(400, '请选择商品分类');
    if (!brandId) fail(400, '请选择品牌');
    if (!(goodsPrice > 0)) fail(400, '请输入正确的售价');

    // 演示环境里新增商品复用一个现有商品做「模板」，再套上新的名字与价格
    const template = products[0]!;
    const newId = `demo-${Date.now()}`;
    const clone: Product = JSON.parse(JSON.stringify(template)) as Product;
    clone.id = newId;
    clone.name = name;
    clone.desc = toText(ctx.data?.desc) || '新品上架，详情完善中';
    clone.catId = catId;
    clone.subId = subId;
    clone.catName = toText(ctx.data?.catName) || clone.catName;
    clone.subName = toText(ctx.data?.subName) || clone.subName;
    clone.price = price(goodsPrice);
    clone.oldPrice = price(Number(toText(ctx.data?.oldPrice)) || goodsPrice * 1.2);
    clone.salesCount = 0;
    clone.commentCount = 0;
    clone.collectCount = 0;
    const cover = image(name, { width: 400, height: 400, seed: 666 });
    clone.mainPictures = [cover, ...clone.mainPictures.slice(1)];
    clone.picture = cover;
    clone.skus = clone.skus.map((sku, index) => ({ ...sku, id: `${newId}-sku-${index + 1}`, price: clone.price, oldPrice: clone.oldPrice, inventory: 100 + index * 20 }));
    products.unshift(clone);
    productMap.set(newId, clone);
    clone.skus.forEach((sku) => skuMap.set(sku.id, { product: clone, sku, attrsText: sku.specs.map((spec) => `${spec.name}：${spec.valueName}`).join(' ') }));

    // 同步库存
    clone.skus.forEach((sku, index) => {
        db.stock.unshift({
            skuId: sku.id,
            goodsId: newId,
            goodsName: clone.name,
            picture: clone.picture,
            attrsText: sku.specs.map((spec) => `${spec.name}：${spec.valueName}`).join(' '),
            catName: clone.catName,
            subName: clone.subName,
            brandName: clone.brand.name,
            price: sku.price,
            total: 100 + index * 20,
            locked: 0,
            available: 100 + index * 20,
            warn: 40,
        });
    });
    db.goodsStatus[newId] = 1;
    saveAdminDb();
    logIt('商品管理', '新增商品', `${name}（${price(goodsPrice)}）`);
    return toAdminGoods(clone);
}

function deleteGoods(ctx: MockContext, id: string) {
    const product = productMap.get(id);
    if (!product) fail(404, '商品不存在');
    if (isOnShelf(product)) fail(400, '上架中的商品不能删除，请先下架');
    const index = products.findIndex((item) => item.id === id);
    if (index >= 0) products.splice(index, 1);
    productMap.delete(id);
    const db = getAdminDb();
    db.stock = db.stock.filter((item) => item.goodsId !== id);
    saveAdminDb();
    logIt('商品管理', '删除商品', product.name);
    return { id };
}

/** 品牌列表（从商品数据聚合，支持后台改名/改介绍） */
function brandList() {
    const db = getAdminDb();
    const map = new Map<string, { id: string; name: string; nameEn: string; desc: string; logo: string; catName: string; goodsCount: number; onShelfCount: number }>();
    products.forEach((product) => {
        const exist = map.get(product.brand.id);
        if (exist) {
            exist.goodsCount += 1;
            if (isOnShelf(product)) exist.onShelfCount += 1;
            return;
        }
        map.set(product.brand.id, {
            id: product.brand.id,
            name: db.brandOverrides[product.brand.id]?.name ?? product.brand.name,
            nameEn: product.brand.nameEn,
            desc: db.brandOverrides[product.brand.id]?.desc ?? product.brand.desc,
            logo: product.brand.logo,
            catName: product.catName,
            goodsCount: 1,
            onShelfCount: isOnShelf(product) ? 1 : 0,
        });
    });
    return [...map.values()];
}

function updateBrand(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const name = toText(ctx.data?.name).trim();
    if (!name) fail(400, '请输入品牌名称');
    db.brandOverrides[id] = { name, desc: toText(ctx.data?.desc) };
    saveAdminDb();
    logIt('商品管理', '编辑品牌', `品牌 ${name}（${id}）`);
    return brandList().find((item) => item.id === id);
}

/** 分类树（一级 + 二级 + 商品数），分类与品牌页、商品编辑下拉共用 */
function categoryTree() {
    const db = getAdminDb();
    const groups = new Map<string, { id: string; name: string; goodsCount: number; onShelfCount: number; subs: Map<string, { id: string; name: string; goodsCount: number; onShelfCount: number }> }>();
    products.forEach((product) => {
        const onShelf = isOnShelf(product) ? 1 : 0;
        let cat = groups.get(product.catId);
        if (!cat) {
            cat = { id: product.catId, name: product.catName, goodsCount: 0, onShelfCount: 0, subs: new Map() };
            groups.set(product.catId, cat);
        }
        cat.goodsCount += 1;
        cat.onShelfCount += onShelf;
        let sub = cat.subs.get(product.subId);
        if (!sub) {
            sub = { id: product.subId, name: product.subName, goodsCount: 0, onShelfCount: 0 };
            cat.subs.set(product.subId, sub);
        }
        sub.goodsCount += 1;
        sub.onShelfCount += onShelf;
    });
    void db;
    return [...groups.values()].map((cat) => ({
        id: cat.id,
        name: cat.name,
        goodsCount: cat.goodsCount,
        onShelfCount: cat.onShelfCount,
        children: [...cat.subs.values()].map((sub) => ({ ...sub })),
    }));
}

/* ================================================================ 库存 */

function stockList(ctx: MockContext) {
    const db = getAdminDb();
    const keyword = toText(ctx.params.keyword).trim();
    const catName = toText(ctx.params.catName);
    const onlyWarn = toNumber(ctx.params.onlyWarn, 0);

    let list = [...db.stock];
    if (keyword) list = list.filter((item) => item.goodsName.includes(keyword) || item.skuId.includes(keyword) || item.attrsText.includes(keyword));
    if (catName) list = list.filter((item) => item.catName === catName);
    if (onlyWarn === 1) list = list.filter((item) => item.available <= item.warn);
    list.sort((a, b) => a.available - b.available);
    return {
        ...paginate(list, toNumber(ctx.params.page, 1), toNumber(ctx.params.pageSize, 10)),
        summary: {
            totalAvailable: db.stock.reduce((sum, item) => sum + item.available, 0),
            totalLocked: db.stock.reduce((sum, item) => sum + item.locked, 0),
            warnCount: db.stock.filter((item) => item.available <= item.warn).length,
            catNames: [...new Set(db.stock.map((item) => item.catName))],
        },
    };
}

function updateStock(ctx: MockContext, skuId: string) {
    const db = getAdminDb();
    const item = db.stock.find((row) => row.skuId === skuId);
    if (!item) fail(404, '库存记录不存在');
    const action = toText(ctx.data?.action); // increase / decrease / set
    const quantity = toNumber(ctx.data?.quantity, 0);
    if (!['increase', 'decrease', 'set'].includes(action)) fail(400, '请选择调整方式');
    if (quantity < 0) fail(400, '数量不能为负数');

    const before = item.available;
    if (action === 'increase') item.available += quantity;
    if (action === 'decrease') {
        if (quantity > item.available) fail(400, '可用库存不足');
        item.available -= quantity;
    }
    if (action === 'set') item.available = quantity;
    item.total = item.available + item.locked;
    const flowType = action === 'increase' ? '入库' : action === 'decrease' ? '出库' : '盘点';

    db.stockFlow.unshift({
        id: `sf-${Date.now()}`,
        skuId: item.skuId,
        goodsName: item.goodsName,
        attrsText: item.attrsText,
        type: flowType,
        quantity,
        before,
        after: item.available,
        operator: currentUser().realName,
        remark: action === 'set' ? '手动校准库存' : '后台手动调整',
        time: nowText(),
    });
    saveAdminDb();
    logIt('库存管理', `库存${flowType}`, `${item.goodsName} ${item.attrsText} ${before} → ${item.available}`);
    return item;
}

function stockFlow(ctx: MockContext) {
    const db = getAdminDb();
    const keyword = toText(ctx.params.keyword).trim();
    const type = toText(ctx.params.type);
    let list = [...db.stockFlow];
    if (keyword) list = list.filter((item) => item.goodsName.includes(keyword) || item.skuId.includes(keyword));
    if (type) list = list.filter((item) => item.type === type);
    return paginate(list, toNumber(ctx.params.page, 1), toNumber(ctx.params.pageSize, 10));
}

/* ================================================================ 订单与退款 */

function adminOrder(order: OrderRecord) {
    const db = getAdminDb();
    const member = db.members[Number(order.id.slice(-2)) % db.members.length] ?? db.members[0]!;
    return {
        ...order,
        memberName: member.nickname,
        memberAccount: member.account,
        memberLevel: member.level,
    };
}

function orderList(ctx: MockContext) {
    const keyword = toText(ctx.params.keyword).trim();
    const state = toNumber(ctx.params.state, -1);
    let list = getDb().orders.map(adminOrder);
    if (keyword) {
        list = list.filter((order) => order.id.includes(keyword) || order.receiverContact.includes(keyword) || order.skus.some((sku) => sku.name.includes(keyword)));
    }
    if (state >= 0) list = list.filter((order) => order.orderState === state);
    return paginate(list, toNumber(ctx.params.page, 1), toNumber(ctx.params.pageSize, 10));
}

function orderDetail(ctx: MockContext, id: string) {
    const order = getDb().orders.find((item) => item.id === id);
    if (!order) fail(404, '订单不存在');
    return adminOrder(order);
}

function shipOrder(ctx: MockContext, id: string) {
    const order = getDb().orders.find((item) => item.id === id);
    if (!order) fail(404, '订单不存在');
    if (order.orderState !== 2) fail(400, '只有「待发货」订单可以发货');
    const company = toText(ctx.data?.company);
    const trackingNo = toText(ctx.data?.trackingNo).trim();
    if (!company) fail(400, '请选择物流公司');
    if (trackingNo.length < 6) fail(400, '请输入正确的运单号');

    order.orderState = 3;
    order.consignTime = nowText();
    saveAdminDb();
    logIt('订单中心', '订单发货', `订单 ${order.id} · ${company} ${trackingNo}`);
    return adminOrder(order);
}

function cancelOrder(ctx: MockContext, id: string) {
    const order = getDb().orders.find((item) => item.id === id);
    if (!order) fail(404, '订单不存在');
    if (order.orderState !== 1 && order.orderState !== 2) fail(400, '只有待付款/待发货订单可以取消');
    order.orderState = 6;
    order.closeTime = nowText();
    saveAdminDb();
    logIt('订单中心', '取消订单', `订单 ${order.id}`);
    return adminOrder(order);
}

function refundList(ctx: MockContext) {
    const db = getAdminDb();
    const keyword = toText(ctx.params.keyword).trim();
    const status = toNumber(ctx.params.status, -1);
    let list = [...db.refunds];
    if (keyword) list = list.filter((item) => item.orderId.includes(keyword) || item.memberName.includes(keyword) || item.goodsName.includes(keyword));
    if (status >= 0) list = list.filter((item) => item.status === status);
    return paginate(list, toNumber(ctx.params.page, 1), toNumber(ctx.params.pageSize, 10));
}

function auditRefund(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const refund = db.refunds.find((item) => item.id === id);
    if (!refund) fail(404, '退款单不存在');
    if (refund.status !== 0) fail(400, '该退款单已处理');
    const approve = Boolean(ctx.data?.approve);
    const remark = toText(ctx.data?.remark);
    if (!approve && !remark) fail(400, '拒绝时请填写原因');
    refund.status = approve ? 1 : 2;
    refund.auditor = currentUser().realName;
    refund.auditTime = nowText();
    refund.remark = approve ? (remark || '审核通过，待打款') : remark;
    saveAdminDb();
    logIt('退款管理', approve ? '退款审核通过' : '退款审核拒绝', `退款单 ${refund.id} 金额 ${refund.amount}`);
    return refund;
}

function payRefund(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const refund = db.refunds.find((item) => item.id === id);
    if (!refund) fail(404, '退款单不存在');
    if (refund.status !== 1) fail(400, '只有审核通过的退款单可以打款');
    refund.status = 1;
    refund.remark = '已原路退回支付账户';
    saveAdminDb();
    logIt('退款管理', '退款打款', `退款单 ${refund.id} 金额 ${refund.amount}`);
    return refund;
}

/* ================================================================ 内容运营 */

function bannerList() {
    return getAdminDb().banners.slice().sort((a, b) => a.distributionSite - b.distributionSite || a.sort - b.sort);
}

function saveBanner(ctx: MockContext, id?: string) {
    const db = getAdminDb();
    const data = ctx.data ?? {};
    const title = toText(data.title).trim();
    const slogan = toText(data.slogan).trim();
    const hrefUrl = toText(data.hrefUrl).trim();
    if (!title) fail(400, '请输入 Banner 标题');
    if (!slogan) fail(400, '请输入副标题');
    if (!hrefUrl) fail(400, '请选择跳转地址');

    const now = nowText();
    if (id) {
        const banner = db.banners.find((item) => item.id === id);
        if (!banner) fail(404, 'Banner 不存在');
        banner.title = title;
        banner.slogan = slogan;
        banner.hrefUrl = hrefUrl;
        banner.distributionSite = (toNumber(data.distributionSite, banner.distributionSite) === 2 ? 2 : 1) as 1 | 2;
        banner.sort = toNumber(data.sort, banner.sort);
        banner.status = (toNumber(data.status, banner.status) === 0 ? 0 : 1) as 0 | 1;
        // 用假图生成器重画一张，保证标题和图一致
        banner.imgUrl = image(title, { width: 1240, height: 500, seed: banner.seed, subLabel: slogan });
        banner.updatedAt = now;
        saveAdminDb();
        logIt('内容运营', '编辑轮播图', `「${title}」排序 ${banner.sort}`);
        return banner;
    }

    const banner = {
        id: `b-${Date.now()}`,
        title,
        slogan,
        seed: Date.now() % 9999,
        imgUrl: image(title, { width: 1240, height: 500, seed: Date.now() % 9999, subLabel: slogan }),
        hrefUrl,
        distributionSite: (toNumber(data.distributionSite, 1) === 2 ? 2 : 1) as 1 | 2,
        sort: toNumber(data.sort, 1),
        status: 1 as const,
        startTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'),
        endTime: dayjs().add(90, 'day').format('YYYY-MM-DD 23:59:59'),
        updatedAt: now,
    };
    db.banners.push(banner);
    saveAdminDb();
    logIt('内容运营', '新增轮播图', `「${title}」`);
    return banner;
}

function toggleBanner(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const banner = db.banners.find((item) => item.id === id);
    if (!banner) fail(404, 'Banner 不存在');
    banner.status = banner.status === 1 ? 0 : 1;
    banner.updatedAt = nowText();
    saveAdminDb();
    logIt('内容运营', banner.status === 1 ? '启用轮播图' : '停用轮播图', `「${banner.title}」`);
    return banner;
}

function removeBanner(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const banner = db.banners.find((item) => item.id === id);
    if (!banner) fail(404, 'Banner 不存在');
    db.banners = db.banners.filter((item) => item.id !== id);
    saveAdminDb();
    logIt('内容运营', '删除轮播图', `「${banner.title}」`);
    return { id };
}

/** 推荐位/热榜里展示的商品（含商品信息） */
function slotGoods(ids: string[]) {
    return ids.map((id) => productMap.get(id)).filter((item): item is Product => Boolean(item)).map((product) => ({
        id: product.id,
        name: product.name,
        picture: product.picture,
        price: effectivePrice(product).price,
        catName: product.catName,
    }));
}

function cmsSlots() {
    const db = getAdminDb();
    return db.slots.map((slot) => ({ ...slot, goods: slotGoods(slot.goodsIds) }));
}

function updateSlot(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const slot = db.slots.find((item) => item.id === id);
    if (!slot) fail(404, '推荐位不存在');
    const goodsIds = (ctx.data?.goodsIds ?? []) as string[];
    if (goodsIds.length > 4) fail(400, '一个推荐位最多 4 件商品');
    if (goodsIds.length < 1) fail(400, '至少保留 1 件商品');
    slot.goodsIds = goodsIds;
    slot.status = (toNumber(ctx.data?.status, slot.status) === 0 ? 0 : 1) as 0 | 1;
    slot.updatedAt = nowText();
    saveAdminDb();
    logIt('内容运营', '调整推荐位', `「${slot.name}」共 ${goodsIds.length} 件商品`);
    return cmsSlots().find((item) => item.id === id);
}

function cmsHot() {
    const db = getAdminDb();
    return db.hotLists.map((item) => ({ ...item, goods: slotGoods(item.goodsIds) }));
}

function updateHot(ctx: MockContext, id: string) {
    const db = getAdminDb();
    const hot = db.hotLists.find((item) => item.id === id);
    if (!hot) fail(404, '热榜不存在');
    const goodsIds = (ctx.data?.goodsIds ?? []) as string[];
    if (goodsIds.length < 3 || goodsIds.length > 6) fail(400, '热榜需要 3-6 件商品');
    hot.goodsIds = goodsIds;
    hot.status = (toNumber(ctx.data?.status, hot.status) === 0 ? 0 : 1) as 0 | 1;
    hot.updatedAt = nowText();
    saveAdminDb();
    logIt('内容运营', '调整热榜', `「${hot.name}」共 ${goodsIds.length} 件商品`);
    return cmsHot().find((item) => item.id === id);
}

/* ================================================================ 数据概览 */

function dashboard() {
    const db = getAdminDb();
    const stats = buildOrderStats();
    const trend = buildTrend();
    const warnStock = db.stock.filter((item) => item.available <= item.warn);

    const topGoods = [...products]
        .slice()
        .sort((a, b) => b.salesCount - a.salesCount)
        .slice(0, 10)
        .map((product) => ({
            id: product.id,
            name: product.name,
            picture: product.picture,
            price: effectivePrice(product).price,
            sales: product.salesCount,
            amount: money(product.salesCount * Number(effectivePrice(product).price)),
            catName: product.catName,
        }));

    const categoryRatio = [...new Set(products.map((item) => item.catName))].map((catName) => ({
        name: catName,
        value: products.filter((item) => item.catName === catName).reduce((sum, item) => sum + item.salesCount, 0),
    })).sort((a, b) => b.value - a.value);

    const totalStock = db.stock.reduce((sum, item) => sum + item.available, 0);
    return {
        cards: [
            { label: '今日订单', value: trend.orders[trend.orders.length - 1]!, unit: '单', trend: 12.6, icon: 'Tickets', color: '#ef5f2a' },
            { label: '今日成交额', value: money(trend.amounts[trend.amounts.length - 1]!), unit: '元', trend: 8.4, icon: 'Wallet', color: '#f79009' },
            { label: '待发货订单', value: stats.pendingShipCount, unit: '单', trend: -3.2, icon: 'Van', color: '#12b76a' },
            { label: '库存预警 SKU', value: warnStock.length, unit: '个', trend: 5.1, icon: 'WarningFilled', color: '#f04438' },
        ],
        summary: {
            totalOrders: stats.totalOrders,
            paidOrders: stats.paidOrders,
            paidAmount: stats.paidAmount,
            pendingShipAmount: stats.pendingShipAmount,
            goodsOnShelf: products.filter((item) => isOnShelf(item)).length,
            goodsTotal: products.length,
            members: db.members.length,
            stockAvailable: totalStock,
        },
        trend,
        topGoods,
        categoryRatio,
        stockWarn: warnStock
            .slice()
            .sort((a, b) => a.available - b.available)
            .slice(0, 8)
            .map((item) => ({
                skuId: item.skuId,
                goodsName: item.goodsName,
                attrsText: item.attrsText,
                picture: item.picture,
                available: item.available,
                warn: item.warn,
                goodsId: item.goodsId,
            })),
        pending: {
            refunds: db.refunds.filter((item) => item.status === 0).length,
            ship: stats.pendingShipCount,
            stockWarn: warnStock.length,
            refundsAmount: money(db.refunds.filter((item) => item.status === 0).reduce((sum, item) => sum + item.amount, 0)),
        },
    };
}

function logList(ctx: MockContext) {
    const db = getAdminDb();
    const keyword = toText(ctx.params.keyword).trim();
    const module = toText(ctx.params.module);
    const result = toText(ctx.params.result);
    let list = [...db.logs];
    if (keyword) list = list.filter((item) => item.detail.includes(keyword) || item.realName.includes(keyword) || item.username.includes(keyword));
    if (module) list = list.filter((item) => item.module === module);
    if (result) list = list.filter((item) => item.result === result);
    return paginate(list, toNumber(ctx.params.page, 1), toNumber(ctx.params.pageSize, 10));
}

/* ================================================================ 路由表 */

export const adminRoutes = {
    'POST /admin/login': login,
    'GET /admin/profile': profile,
    'GET /admin/permissions': () => PERMISSIONS,
    'GET /admin/roles': () => roleList(),
    'POST /admin/roles': (ctx: MockContext) => createRole(ctx),
    'PUT /admin/roles/:id': (ctx: MockContext) => updateRole(ctx, ctx.segments[2]!),
    'PUT /admin/roles/:id/permissions': (ctx: MockContext) => updateRolePermissions(ctx, ctx.segments[2]!),
    'GET /admin/users': (ctx: MockContext) => adminUsers(ctx),
    'POST /admin/users': (ctx: MockContext) => saveAdminUser(ctx),
    'PUT /admin/users/:id': (ctx: MockContext) => saveAdminUser(ctx, ctx.segments[2]!),
    'PUT /admin/users/:id/status': (ctx: MockContext) => toggleAdminUser(ctx, ctx.segments[2]!),
    'PUT /admin/users/:id/password': (ctx: MockContext) => updatePassword(ctx, ctx.segments[2]!),
    'DELETE /admin/users/:id': (ctx: MockContext) => removeAdminUser(ctx, ctx.segments[2]!),

    'GET /admin/members': (ctx: MockContext) => memberList(ctx),
    'PUT /admin/members/:id/status': (ctx: MockContext) => toggleMember(ctx, ctx.segments[2]!),

    'GET /admin/goods': (ctx: MockContext) => goodsList(ctx),
    'POST /admin/goods': (ctx: MockContext) => createGoods(ctx),
    'GET /admin/goods/:id': (ctx: MockContext) => goodsDetail(ctx, ctx.segments[2]!),
    'PUT /admin/goods/:id': (ctx: MockContext) => updateGoods(ctx, ctx.segments[2]!),
    'PUT /admin/goods/:id/shelf': (ctx: MockContext) => toggleGoodsShelf(ctx, ctx.segments[2]!),
    'DELETE /admin/goods/:id': (ctx: MockContext) => deleteGoods(ctx, ctx.segments[2]!),
    'PUT /admin/goods/shelf/batch': (ctx: MockContext) => batchGoodsShelf(ctx),

    'GET /admin/goods/brands': () => brandList(),
    'PUT /admin/goods/brands/:id': (ctx: MockContext) => updateBrand(ctx, ctx.segments[3]!),
    'GET /admin/goods/categories': () => categoryTree(),

    'GET /admin/stock': (ctx: MockContext) => stockList(ctx),
    'PUT /admin/stock/:skuId': (ctx: MockContext) => updateStock(ctx, ctx.segments[2]!),
    'GET /admin/stock/flow': (ctx: MockContext) => stockFlow(ctx),

    'GET /admin/orders': (ctx: MockContext) => orderList(ctx),
    'GET /admin/orders/:id': (ctx: MockContext) => orderDetail(ctx, ctx.segments[2]!),
    'PUT /admin/orders/:id/ship': (ctx: MockContext) => shipOrder(ctx, ctx.segments[2]!),
    'PUT /admin/orders/:id/cancel': (ctx: MockContext) => cancelOrder(ctx, ctx.segments[2]!),

    'GET /admin/refunds': (ctx: MockContext) => refundList(ctx),
    'PUT /admin/refunds/:id/audit': (ctx: MockContext) => auditRefund(ctx, ctx.segments[2]!),
    'PUT /admin/refunds/:id/pay': (ctx: MockContext) => payRefund(ctx, ctx.segments[2]!),

    'GET /admin/cms/banners': () => bannerList(),
    'POST /admin/cms/banners': (ctx: MockContext) => saveBanner(ctx),
    'PUT /admin/cms/banners/:id': (ctx: MockContext) => saveBanner(ctx, ctx.segments[3]!),
    'PUT /admin/cms/banners/:id/status': (ctx: MockContext) => toggleBanner(ctx, ctx.segments[3]!),
    'DELETE /admin/cms/banners/:id': (ctx: MockContext) => removeBanner(ctx, ctx.segments[3]!),
    'GET /admin/cms/slots': () => cmsSlots(),
    'PUT /admin/cms/slots/:id': (ctx: MockContext) => updateSlot(ctx, ctx.segments[3]!),
    'GET /admin/cms/hot': () => cmsHot(),
    'PUT /admin/cms/hot/:id': (ctx: MockContext) => updateHot(ctx, ctx.segments[3]!),

    'GET /admin/logs': (ctx: MockContext) => logList(ctx),
    'GET /admin/dashboard': () => dashboard(),
};
