/**
 * 管理端假数据
 * ---------------------------------------------------------------------------
 * 角色权限 / 管理员账号 / 会员 / 库存 / 库存流水 / 退款单 / 内容运营 / 操作日志
 * 以及一份「可变的」管理端数据库（写操作会真的改数据并持久化到 localStorage）。
 *
 * 商品、分类、品牌等基础数据直接复用用户端的 catalog.ts / products.ts，
 * 所以管理端改价、上下架看到的商品和用户端展示的是同一批。
 */
import dayjs from 'dayjs';
import { money, price, shuffle } from '../utils/helper';
import { image } from '../utils/image';
import { products, skuMap, type Product } from './products';
import { catIdOf } from './ids';
import { getDb } from '../db';

/* ================================================================ 权限定义 */

export interface PermissionItem {
    code: string;
    name: string;
}

export interface PermissionGroup {
    group: string;
    items: PermissionItem[];
}

/** 全量权限码（对齐架构文档 AD 章节的权限设计） */
export const PERMISSIONS: PermissionGroup[] = [
    {
        group: '数据概览',
        items: [{ code: 'dashboard:view', name: '查看数据概览' }],
    },
    {
        group: '商品管理',
        items: [
            { code: 'goods:list', name: '查看商品列表' },
            { code: 'goods:detail', name: '查看商品详情' },
            { code: 'goods:create', name: '新增商品' },
            { code: 'goods:update', name: '编辑商品/改价' },
            { code: 'goods:shelf', name: '商品上下架' },
            { code: 'goods:delete', name: '删除商品' },
            { code: 'category:update', name: '分类与品牌维护' },
        ],
    },
    {
        group: '库存管理',
        items: [
            { code: 'stock:list', name: '查看库存' },
            { code: 'stock:update', name: '调整库存' },
            { code: 'stock:flow', name: '查看库存流水' },
        ],
    },
    {
        group: '订单中心',
        items: [
            { code: 'order:list', name: '查看订单列表' },
            { code: 'order:detail', name: '查看订单详情' },
            { code: 'order:ship', name: '订单发货' },
            { code: 'order:cancel', name: '取消订单' },
            { code: 'refund:list', name: '查看退款申请' },
            { code: 'refund:audit', name: '退款审核' },
            { code: 'refund:final', name: '退款打款' },
        ],
    },
    {
        group: '内容运营',
        items: [
            { code: 'cms:list', name: '查看内容运营' },
            { code: 'cms:update', name: '维护 Banner/推荐位/热榜' },
        ],
    },
    {
        group: '会员中心',
        items: [
            { code: 'member:list', name: '查看会员列表' },
            { code: 'member:update', name: '会员状态维护' },
        ],
    },
    {
        group: '权限中心',
        items: [
            { code: 'admin:list', name: '查看管理员账号' },
            { code: 'admin:update', name: '管理员账号维护' },
            { code: 'role:list', name: '查看角色权限' },
            { code: 'role:update', name: '角色权限配置' },
            { code: 'log:list', name: '查看操作日志' },
        ],
    },
];

export const ALL_PERMISSIONS = PERMISSIONS.flatMap((group) => group.items.map((item) => item.code));

export interface RoleItem {
    id: string;
    code: string;
    name: string;
    desc: string;
    builtIn: boolean;
    permissions: string[];
    userCount: number;
    createdAt: string;
}

export const ROLE_SEED: RoleItem[] = [
    {
        id: 'r-01',
        code: 'ADMIN',
        name: '超级管理员',
        desc: '拥有全部权限，不可删除',
        builtIn: true,
        permissions: [...ALL_PERMISSIONS],
        userCount: 1,
        createdAt: '2024-01-01 09:00:00',
    },
    {
        id: 'r-02',
        code: 'OPERATOR',
        name: '商品运营',
        desc: '负责商品上下架、改价、内容运营',
        builtIn: true,
        permissions: [
            'dashboard:view',
            'goods:list', 'goods:detail', 'goods:create', 'goods:update', 'goods:shelf',
            'category:update',
            'cms:list', 'cms:update',
            'order:list', 'order:detail',
        ],
        userCount: 2,
        createdAt: '2024-01-05 10:20:00',
    },
    {
        id: 'r-03',
        code: 'STOCK',
        name: '库存管理员',
        desc: '负责库存调整与盘点',
        builtIn: true,
        permissions: [
            'dashboard:view',
            'goods:list', 'goods:detail',
            'stock:list', 'stock:update', 'stock:flow',
        ],
        userCount: 1,
        createdAt: '2024-02-11 14:05:00',
    },
    {
        id: 'r-04',
        code: 'CS',
        name: '订单客服',
        desc: '处理订单、退款与会员咨询',
        builtIn: true,
        permissions: [
            'dashboard:view',
            'order:list', 'order:detail', 'order:ship', 'order:cancel',
            'refund:list', 'refund:audit',
            'member:list',
            'goods:list', 'goods:detail',
        ],
        userCount: 2,
        createdAt: '2024-03-02 09:30:00',
    },
    {
        id: 'r-05',
        code: 'FINANCE',
        name: '财务',
        desc: '退款打款与操作审计',
        builtIn: true,
        permissions: [
            'dashboard:view',
            'order:list', 'order:detail',
            'refund:list', 'refund:audit', 'refund:final',
            'log:list',
        ],
        userCount: 1,
        createdAt: '2024-04-18 11:00:00',
    },
];

/* ================================================================ 管理员账号 */

export interface AdminUserRecord {
    id: string;
    username: string;
    password: string;
    realName: string;
    roleCode: string;
    roleName: string;
    status: 0 | 1;
    phone: string;
    email: string;
    createdAt: string;
    lastLoginAt: string;
    remark: string;
}

export function buildAdminUsers(): AdminUserRecord[] {
    const base = [
        { username: 'admin', realName: '超级管理员', roleCode: 'ADMIN', roleName: '超级管理员', phone: '13800000001', remark: '系统内置账号' },
        { username: 'oper01', realName: '商品运营·小六', roleCode: 'OPERATOR', roleName: '商品运营', phone: '13800000002', remark: '负责生鲜与居家品类' },
        { username: 'oper02', realName: '商品运营·阿禾', roleCode: 'OPERATOR', roleName: '商品运营', phone: '13800000003', remark: '负责数码与服饰品类' },
        { username: 'stock01', realName: '库存管理·大仓', roleCode: 'STOCK', roleName: '库存管理员', phone: '13800000004', remark: '杭州中心仓' },
        { username: 'cs01', realName: '客服·小暖', roleCode: 'CS', roleName: '订单客服', phone: '13800000005', remark: '白班' },
        { username: 'cs02', realName: '客服·阿澄', roleCode: 'CS', roleName: '订单客服', phone: '13800000006', remark: '夜班' },
        { username: 'fin01', realName: '财务·阿算', roleCode: 'FINANCE', roleName: '财务', phone: '13800000007', remark: '退款打款与对账' },
        { username: 'test01', realName: '体验账号', roleCode: 'CS', roleName: '订单客服', phone: '13800000008', remark: '演示用，默认停用' },
    ];
    return base.map((item, index) => ({
        id: `u-${String(index + 1).padStart(2, '0')}`,
        username: item.username,
        password: '123456',
        realName: item.realName,
        roleCode: item.roleCode,
        roleName: item.roleName,
        status: (item.username === 'test01' ? 0 : 1) as 0 | 1,
        phone: item.phone,
        email: `${item.username}@621mall.demo`,
        createdAt: dayjs().subtract(320 - index * 30, 'day').hour(9).minute(30).format('YYYY-MM-DD HH:mm:ss'),
        lastLoginAt: dayjs().subtract(index % 5, 'day').hour(9).minute(12).format('YYYY-MM-DD HH:mm:ss'),
        remark: item.remark,
    }));
}

/* ================================================================ 会员 */

export interface MemberRecord {
    id: string;
    account: string;
    nickname: string;
    avatar: string;
    phone: string;
    gender: 0 | 1 | 2;
    level: number;
    points: number;
    balance: number;
    status: 0 | 1;
    registeredAt: string;
    lastActiveAt: string;
    orderCount: number;
    totalAmount: number;
    address: string;
}

const MEMBER_NAMES = [
    '林晚晚', '苏叶', '顾行舟', '沈知意', '陆知遥', '江疏影', '白鹿原', '秦朗', '许迟迟', '韩岁岁',
    '孟秋白', '温言', '谢星辞', '裴照', '季长安', '闻人语', '南宫野', '宫商羽', '容与', '祝余',
    '岑寂', '宋知微', '傅明夜', '黎深', '卫无涯', '花间令', '叶未眠', '顾南亭', '苏折枝', '陆吾',
    '洛清寒', '桑落', '云归处', '萧别离', '池鱼', '阮软', '姜妩', '程既白', '方迟', '邵星野',
];

export function buildMembers(): MemberRecord[] {
    return MEMBER_NAMES.map((name, index) => {
        const level = (index % 4) + 1;
        const orderCount = 3 + ((index * 7) % 46);
        const totalAmount = money(orderCount * (96 + ((index * 37) % 380)));
        return {
            id: `m-${String(index + 1).padStart(3, '0')}`,
            account: `user${String(10001 + index)}`,
            nickname: name,
            avatar: image(name, { width: 80, height: 80, seed: 9000 + index }),
            phone: `139${String(10000000 + index * 137).slice(0, 8)}`,
            gender: ((index % 3) + 1) as 0 | 1 | 2,
            level,
            points: level * 1200 + ((index * 233) % 900),
            balance: money(((index * 173) % 500) + 12),
            status: (index === 11 || index === 27 ? 0 : 1) as 0 | 1,
            registeredAt: dayjs().subtract(430 - index * 9, 'day').hour(10).minute(20).format('YYYY-MM-DD HH:mm:ss'),
            lastActiveAt: dayjs().subtract(index % 14, 'day').hour(9).minute(index % 60).format('YYYY-MM-DD HH:mm:ss'),
            orderCount,
            totalAmount,
            address: (['浙江省 杭州市 西湖区', '江苏省 南京市 鼓楼区', '上海市 徐汇区', '广东省 深圳市 南山区', '四川省 成都市 武侯区'] as const)[index % 5] ?? '',
        };
    });
}

/* ================================================================ 库存 */

export interface StockRecord {
    skuId: string;
    goodsId: string;
    goodsName: string;
    picture: string;
    attrsText: string;
    catName: string;
    subName: string;
    brandName: string;
    price: string;
    total: number;
    locked: number;
    available: number;
    warn: number;
}

export function buildStock(): StockRecord[] {
    const list: StockRecord[] = [];
    let index = 0;
    skuMap.forEach((record) => {
        const { product, sku, attrsText } = record;
        // 用固定规则生成库存分布：绝大多数 SKU 库存充足，少数（每 29 个 1 个）低于预警值
        const locked = index % 7;
        const warn = 40;
        const isLow = index % 29 === 0;
        const available = isLow ? 3 + (index % 18) : 120 + ((index * 137) % 900);
        list.push({
            skuId: sku.id,
            goodsId: product.id,
            goodsName: product.name,
            picture: product.picture,
            attrsText,
            catName: product.catName,
            subName: product.subName,
            brandName: product.brand.name,
            price: sku.price,
            total: available + locked,
            locked,
            available,
            warn,
        });
        index += 1;
    });
    return list;
}

export type StockFlowType = '入库' | '出库' | '盘点' | '锁定' | '释放' | '预警';

export interface StockFlowRecord {
    id: string;
    skuId: string;
    goodsName: string;
    attrsText: string;
    type: StockFlowType;
    quantity: number;
    before: number;
    after: number;
    operator: string;
    remark: string;
    time: string;
}

export function buildStockFlow(stock: StockRecord[]): StockFlowRecord[] {
    const operators = ['大仓', '小六', '系统', '阿算'];
    const types: StockFlowType[] = ['入库', '出库', '盘点', '锁定', '释放', '预警'];
    const remarks: Record<StockFlowType, string> = {
        '入库': '采购到货入库',
        '出库': '订单发货出库',
        '盘点': '月度盘点校准',
        '锁定': '促销活动锁库存',
        '释放': '超时未支付释放',
        '预警': '库存低于预警值',
    };
    const pick = shuffle(stock, 20260914).slice(0, 66);
    return pick.map((item, index) => {
        const type = types[index % types.length]!;
        const quantity = 5 + ((index * 13) % 90);
        const before = item.available + (type === '入库' ? -quantity : type === '出库' ? quantity : 0);
        const dayOffset = Math.floor(index / 5);
        return {
            id: `sf-${String(index + 1).padStart(4, '0')}`,
            skuId: item.skuId,
            goodsName: item.goodsName,
            attrsText: item.attrsText,
            type,
            quantity,
            before: Math.max(0, before),
            after: Math.max(0, type === '入库' ? before + quantity : type === '出库' ? before - quantity : before),
            operator: operators[index % operators.length]!,
            remark: remarks[type]!,
            time: dayjs().subtract(dayOffset, 'day').hour(8 + (index % 10)).minute((index * 7) % 60).format('YYYY-MM-DD HH:mm:ss'),
        };
    });
}

/* ================================================================ 退款单 */

export interface RefundRecord {
    id: string;
    orderId: string;
    memberName: string;
    goodsName: string;
    image: string;
    quantity: number;
    amount: number;
    reason: string;
    applyTime: string;
    /** 0 待审核 1 已退款 2 已拒绝 */
    status: 0 | 1 | 2;
    auditor: string;
    auditTime: string;
    remark: string;
}

const REFUND_REASONS = [
    '商品破损，包装漏水',
    '尺码偏大，申请换货退款',
    '七天无理由退货',
    '少发一件商品',
    '与描述不符，颜色有色差',
    '发货太慢，不想要了',
    '商品有质量问题',
];

export function buildRefunds(): RefundRecord[] {
    // 全部订单都可能有历史退款单，取前 10 笔做演示
    const orders = getDb().orders;
    const members = buildMembers();
    return orders.slice(0, 10).map((order, index) => {
        const sku = order.skus[0]!;
        const member = members[index % members.length]!;
        const status = ([0, 0, 1, 2, 0, 1, 1, 2, 0, 1] as const)[index] ?? 0;
        return {
            id: `rf-${String(index + 1).padStart(4, '0')}`,
            orderId: order.id,
            memberName: member.nickname,
            goodsName: sku.name,
            image: sku.image,
            quantity: sku.quantity,
            amount: money(sku.realPay),
            reason: REFUND_REASONS[index % REFUND_REASONS.length]!,
            applyTime: dayjs().subtract(index + 1, 'day').hour(9 + (index % 8)).minute(30).format('YYYY-MM-DD HH:mm:ss'),
            status,
            auditor: status === 0 ? '' : '阿算',
            auditTime: status === 0 ? '' : dayjs().subtract(index, 'day').hour(15).minute(10).format('YYYY-MM-DD HH:mm:ss'),
            remark: status === 2 ? '商品已拆封，不符合退款条件' : status === 1 ? '原路退回支付账户' : '',
        };
    });
}

/* ================================================================ 内容运营 */

export interface CmsBannerRecord {
    id: string;
    title: string;
    slogan: string;
    seed: number;
    imgUrl: string;
    hrefUrl: string;
    /** 1 首页轮播 2 分类页轮播 */
    distributionSite: 1 | 2;
    sort: number;
    status: 0 | 1;
    startTime: string;
    endTime: string;
    updatedAt: string;
}

const BANNER_SEEDS: Array<{ title: string; slogan: string; hrefUrl: string; seed: number; distributionSite: 1 | 2 }> = [
    { title: '新鲜好物 · 产地直采', slogan: '48 小时从枝头到餐桌', hrefUrl: `/category/${catIdOf(1)}`, seed: 101, distributionSite: 1 },
    { title: '居家焕新季', slogan: '收纳 · 清洁 · 厨房 一站配齐', hrefUrl: `/category/${catIdOf(0)}`, seed: 202, distributionSite: 1 },
    { title: '数码好物严选', slogan: '好听好看 还耐用', hrefUrl: `/category/${catIdOf(6)}`, seed: 303, distributionSite: 1 },
    { title: '换季衣橱计划', slogan: '基础款也能穿出高级感', hrefUrl: `/category/${catIdOf(2)}`, seed: 404, distributionSite: 1 },
    { title: '全部分类 · 正在热卖', slogan: '严选好物 品质之选', hrefUrl: `/category/${catIdOf(5)}`, seed: 505, distributionSite: 2 },
    { title: '个护专场', slogan: '成分简单 温和有效', hrefUrl: `/category/${catIdOf(4)}`, seed: 606, distributionSite: 2 },
    { title: '母婴安心购', slogan: '母婴友好选材 更温柔的呵护', hrefUrl: `/category/${catIdOf(3)}`, seed: 707, distributionSite: 2 },
    { title: '运动户外季', slogan: '每一次出汗 都有好装备', hrefUrl: `/category/${catIdOf(7)}`, seed: 808, distributionSite: 2 },
];

export function buildCmsBanners(): CmsBannerRecord[] {
    return BANNER_SEEDS.map((item, index) => ({
        id: `b-${String(index + 1).padStart(2, '0')}`,
        title: item.title,
        slogan: item.slogan,
        seed: item.seed,
        imgUrl: image(item.title, { width: 1240, height: 500, seed: item.seed, subLabel: item.slogan }),
        hrefUrl: item.hrefUrl,
        distributionSite: item.distributionSite,
        sort: (index % 4) + 1,
        status: 1 as const,
        startTime: dayjs().subtract(30, 'day').format('YYYY-MM-DD 00:00:00'),
        endTime: dayjs().add(60, 'day').format('YYYY-MM-DD 23:59:59'),
        updatedAt: dayjs().subtract(index, 'day').hour(16).minute(20).format('YYYY-MM-DD HH:mm:ss'),
    }));
}

export interface RecommendSlotRecord {
    id: string;
    name: string;
    desc: string;
    goodsIds: string[];
    status: 0 | 1;
    updatedAt: string;
}

export function buildRecommendSlots(): RecommendSlotRecord[] {
    const picks = shuffle(products, 8888);
    return [
        {
            id: 'slot-home-new',
            name: '首页 · 新鲜好物',
            desc: '用户端首页「新鲜好物」板块，展示 4 件商品',
            goodsIds: picks.slice(0, 4).map((item) => item.id),
            status: 1,
            updatedAt: dayjs().subtract(2, 'day').hour(11).minute(30).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            id: 'slot-home-hot',
            name: '首页 · 人气推荐',
            desc: '用户端首页「人气推荐」板块，展示 4 件商品',
            goodsIds: picks.slice(4, 8).map((item) => item.id),
            status: 1,
            updatedAt: dayjs().subtract(1, 'day').hour(18).minute(10).format('YYYY-MM-DD HH:mm:ss'),
        },
    ];
}

export interface HotListRecord {
    id: string;
    name: string;
    desc: string;
    /** 1 24小时热销榜 2 周热销榜 */
    type: 1 | 2;
    goodsIds: string[];
    status: 0 | 1;
    updatedAt: string;
}

export function buildHotLists(): HotListRecord[] {
    const hot = [...products].sort((a, b) => b.salesCount - a.salesCount);
    return [
        {
            id: 'hot-24h',
            name: '24 小时热销榜',
            desc: '商品详情页「24 小时热销榜」侧栏',
            type: 1,
            goodsIds: hot.slice(0, 6).map((item) => item.id),
            status: 1,
            updatedAt: dayjs().subtract(1, 'day').hour(20).minute(0).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            id: 'hot-week',
            name: '周热销榜',
            desc: '商品详情页「周热销榜」侧栏',
            type: 2,
            goodsIds: hot.slice(6, 12).map((item) => item.id),
            status: 1,
            updatedAt: dayjs().subtract(3, 'day').hour(20).minute(0).format('YYYY-MM-DD HH:mm:ss'),
        },
    ];
}

/* ================================================================ 操作日志 */

export interface LogRecord {
    id: string;
    username: string;
    realName: string;
    module: string;
    action: string;
    detail: string;
    ip: string;
    result: '成功' | '失败';
    time: string;
}

export function buildLogs(): LogRecord[] {
    const actions: Array<{ module: string; action: string; detail: string; result?: '成功' | '失败' }> = [
        { module: '商品管理', action: '修改价格', detail: '智利进口车厘子2斤 价格 129.00 → 119.00' },
        { module: '商品管理', action: '商品下架', detail: '日式陶瓷餐具套装' },
        { module: '库存管理', action: '库存入库', detail: '纯棉基础款圆领T恤 +200' },
        { module: '库存管理', action: '库存预警', detail: '麦饭石不粘炒锅 可用库存低于 40' },
        { module: '订单中心', action: '订单发货', detail: '订单 20260912 发出，顺丰 SF1339' },
        { module: '订单中心', action: '取消订单', detail: '订单 20260908 用户申请取消' },
        { module: '退款管理', action: '退款审核通过', detail: '退款单 rf-0003 金额 129.00' },
        { module: '退款管理', action: '退款打款', detail: '退款单 rf-0002 原路退回' },
        { module: '内容运营', action: '更新轮播图', detail: '「居家焕新季」排序调整为 1' },
        { module: '内容运营', action: '推荐位调整', detail: '首页·新鲜好位 移除 1 件商品' },
        { module: '会员中心', action: '禁用会员', detail: '会员 洛清寒 涉嫌刷单' },
        { module: '权限中心', action: '新增管理员', detail: '新增账号 oper02（商品运营）' },
        { module: '权限中心', action: '修改角色权限', detail: '订单客服 增加「订单发货」权限' },
        { module: '登录', action: '登录成功', detail: '账号 admin 登录管理端', result: '成功' },
        { module: '登录', action: '登录失败', detail: '账号 test01 密码错误 3 次', result: '失败' },
    ];
    const users = buildAdminUsers().filter((item) => item.status === 1);
    return actions.flatMap((action, index) =>
        [0, 1, 2].map((round) => {
            const user = users[(index + round) % users.length]!;
            const id = index * 3 + round;
            return {
                id: `lg-${String(id + 1).padStart(4, '0')}`,
                username: user.username,
                realName: user.realName,
                module: action.module,
                action: action.action,
                detail: action.detail,
                ip: `192.168.1.${100 + (id % 60)}`,
                result: (action.result ?? '成功') as '成功' | '失败',
                time: dayjs().subtract(Math.floor(id / 4), 'day').hour(8 + (id % 10)).minute((id * 11) % 60).format('YYYY-MM-DD HH:mm:ss'),
            };
        })
    );
}

/* ================================================================ 可变数据库 */

export interface AdminDb {
    users: AdminUserRecord[];
    roles: RoleItem[];
    members: MemberRecord[];
    stock: StockRecord[];
    stockFlow: StockFlowRecord[];
    refunds: RefundRecord[];
    logs: LogRecord[];
    banners: CmsBannerRecord[];
    slots: RecommendSlotRecord[];
    hotLists: HotListRecord[];
    /** 商品上下架覆盖（1 上架 0 下架），key 是商品 id */
    goodsStatus: Record<string, 0 | 1>;
    /** 商品改价记录，key 是商品 id */
    goodsPrice: Record<string, { price: string; oldPrice: string; version: number }>;
    /** 当前登录的管理员（登录接口写入，日志埋点用） */
    currentUser: { id: string; username: string; realName: string; roleCode: string; roleName: string } | null;
    /** 品牌信息覆盖（品牌改名 / 改介绍），key 是品牌 id */
    brandOverrides: Record<string, { name?: string; desc?: string }>;
}

const STORAGE_KEY = 'eshop621-admin-db-v1';

function createAdminDb(): AdminDb {
    const stock = buildStock();
    return {
        users: buildAdminUsers(),
        roles: ROLE_SEED.map((item) => ({ ...item })),
        members: buildMembers(),
        stock,
        stockFlow: buildStockFlow(stock),
        refunds: buildRefunds(),
        logs: buildLogs(),
        banners: buildCmsBanners(),
        slots: buildRecommendSlots(),
        hotLists: buildHotLists(),
        goodsStatus: {},
        goodsPrice: {},
        currentUser: null,
        brandOverrides: {},
    };
}

function readStorage(): AdminDb | undefined {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return undefined;
        const parsed = JSON.parse(raw) as Partial<AdminDb>;
        if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.stock)) return undefined;
        return parsed as AdminDb;
    } catch {
        return undefined;
    }
}

let adminDb: AdminDb = readStorage() ?? createAdminDb();

export function getAdminDb(): AdminDb {
    return adminDb;
}

export function saveAdminDb(): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adminDb));
    } catch {
        /* 忽略隐私模式 */
    }
}

export function resetAdminDb(): AdminDb {
    adminDb = createAdminDb();
    saveAdminDb();
    return adminDb;
}

/** 记录一条操作日志（写操作统一在这里埋点） */
export function appendLog(input: {
    username: string;
    realName: string;
    module: string;
    action: string;
    detail: string;
    result?: '成功' | '失败';
}): void {
    adminDb.logs.unshift({
        id: `lg-${Date.now()}`,
        username: input.username,
        realName: input.realName,
        module: input.module,
        action: input.action,
        detail: input.detail,
        ip: '192.168.1.66',
        result: input.result ?? '成功',
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    if (adminDb.logs.length > 300) adminDb.logs.length = 300;
    saveAdminDb();
}

/** 商品当前生效的价格（管理端改价后覆盖种子数据） */
export function effectivePrice(product: Product): { price: string; oldPrice: string } {
    const override = adminDb.goodsPrice[product.id];
    return override ? { price: override.price, oldPrice: override.oldPrice } : { price: product.price, oldPrice: product.oldPrice };
}

/** 商品当前是否上架（管理端上下架后覆盖种子数据） */
export function isOnShelf(product: Product): boolean {
    return (adminDb.goodsStatus[product.id] ?? 1) === 1;
}

/** 最近 7 天趋势（用固定种子生成，保证每次刷新一致） */
export function buildTrend() {
    const dates: string[] = [];
    const orders: number[] = [];
    const amounts: number[] = [];
    const visitors: number[] = [];
    let seed = 20260914;
    const next = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
    for (let i = 6; i >= 0; i -= 1) {
        const day = dayjs().subtract(i, 'day');
        dates.push(day.format('MM-DD'));
        const base = 180 + Math.round(next() * 160) + (day.day() === 0 || day.day() === 6 ? 90 : 0);
        const orderCount = base + (i === 0 ? 46 : 0);
        orders.push(orderCount);
        amounts.push(money(orderCount * (118 + next() * 42)));
        visitors.push(Math.round(orderCount * (5.2 + next() * 1.6)));
    }
    return { dates, orders, amounts, visitors };
}

/** 真实订单里能统计到的数据（管理端概览用） */
export function buildOrderStats() {
    const orders = getDb().orders;
    const paid = orders.filter((order) => order.orderState !== 1 && order.orderState !== 6);
    const pendingShip = orders.filter((order) => order.orderState === 2);
    return {
        totalOrders: orders.length,
        paidOrders: paid.length,
        paidAmount: money(paid.reduce((sum, order) => sum + order.payMoney, 0)),
        pendingShipCount: pendingShip.length,
        pendingShipAmount: money(pendingShip.reduce((sum, order) => sum + order.payMoney, 0)),
    };
}
