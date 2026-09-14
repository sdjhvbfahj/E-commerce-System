/**
 * 「内容型」页面的假数据：帮助中心 / 关于我们 / 品牌专区 / 专题活动
 * ---------------------------------------------------------------------------
 * 这些页面原来在项目里是死链（footer 和顶栏里点不动），
 * 这里补齐数据，让它们和商品页一样走假接口。
 */
import { image, imageSet } from '../utils/image';
import { products, spreadByCat, toListItem, type Product } from './products';
import { CATALOG } from './catalog';
import { catIdOf } from './ids';

/* ------------------------------------------------------------------ 帮助中心 */

export interface HelpArticle {
    id: string;
    question: string;
    answer: string;
}

export interface HelpLink {
    name: string;
    desc: string;
    url: string;
}

export interface HelpSection {
    /** 栏目 id，对应 footer 里的链接（/help?type=xxx） */
    id: string;
    name: string;
    desc: string;
    articles: HelpArticle[];
    /** 友情链接这类栏目用卡片展示 */
    links?: HelpLink[];
}

export interface HelpData {
    sections: HelpSection[];
    hotLines: string[];
    servicePhone: string;
    serviceTime: string;
}

const HELP_SECTIONS: HelpSection[] = [
    {
        id: 'help',
        name: '帮助中心',
        desc: '账户、下单、支付里遇到的小问题，这里都有答案',
        articles: [
            {
                id: 'help-1',
                question: '如何注册成为621电商会员？',
                answer: '点击右上角「免费注册」，填写账号与密码并勾选协议即可。本演示项目为假数据环境，账号任意填写、密码 6-20 位即可登录。',
            },
            {
                id: 'help-2',
                question: '忘记密码了怎么办？',
                answer: '在登录页点击「忘记密码」，通过注册手机号接收验证码后即可重置。演示环境未开放该能力，可直接用新账号登录体验。',
            },
            {
                id: 'help-3',
                question: '下单后多久发货？',
                answer: '现货商品在支付成功后 24 小时内发出，预售商品以商品详情页标注的发货时间为准。',
            },
            {
                id: 'help-4',
                question: '支持哪些支付方式？',
                answer: '目前支持支付宝、微信支付，以及招商、工商、建设、农业、交通等银行的储蓄卡与信用卡支付。',
            },
            {
                id: 'help-5',
                question: '订单可以修改收货地址吗？',
                answer: '订单未发货前可联系在线客服修改；已发货的订单建议直接与配送员沟通。你也可以在「会员中心 - 地址管理」中提前维护常用地址。',
            },
        ],
    },
    {
        id: 'service',
        name: '售后服务',
        desc: '七天无理由退换、破损包赔，售后流程全透明',
        articles: [
            {
                id: 'service-1',
                question: '七天无理由退换怎么申请？',
                answer: '签收后 7 天内，在「我的订单」中找到对应订单，点击「申请售后」，选择退货或换货并填写原因即可。',
            },
            {
                id: 'service-2',
                question: '退款多久能到账？',
                answer: '审核通过后原路退回：支付宝/微信一般 1-3 个工作日，银行卡一般 3-7 个工作日，具体以银行到账时间为准。',
            },
            {
                id: 'service-3',
                question: '收到的商品破损了怎么办？',
                answer: '生鲜、玻璃陶瓷等易碎品支持「破损包赔」。请在签收后 48 小时内拍照上传，审核通过后无需寄回即可补发或退款。',
            },
            {
                id: 'service-4',
                question: '哪些商品不支持无理由退货？',
                answer: '拆封后影响二次销售的商品（如贴身衣物、已开封食品、定制商品）不支持无理由退货，商品详情页会明确标注。',
            },
        ],
    },
    {
        id: 'delivery',
        name: '配送与验收',
        desc: '发货时效、配送范围与签收注意事项',
        articles: [
            {
                id: 'delivery-1',
                question: '一般多久可以收到货？',
                answer: '江浙沪皖次日达，全国大部分地区 48-72 小时送达，偏远地区 3-5 天。大件家具类商品需要提前电话预约配送时间。',
            },
            {
                id: 'delivery-2',
                question: '运费怎么计算？',
                answer: '单笔订单实付满 99 元免运费；不满 99 元收取 8 元基础运费。货到付款订单另收 5 元手续费。',
            },
            {
                id: 'delivery-3',
                question: '可以指定送货时间吗？',
                answer: '结算页可以选择「不限送货时间」「工作日送货」「双休日、假日送货」，我们会按你选择的时间段安排配送。',
            },
            {
                id: 'delivery-4',
                question: '签收时需要注意什么？',
                answer: '建议当面开箱验货，核对数量与外包装是否完好。若发现破损或缺失，可当场拒收，并在「我的订单」里提交售后申请。',
            },
        ],
    },
    {
        id: 'business',
        name: '商务合作',
        desc: '供货、渠道、品牌联名与内容合作，欢迎来聊',
        articles: [
            {
                id: 'business-1',
                question: '供应商如何入驻？',
                answer: '请准备营业执照、品牌授权书与商品质检报告，发送至 cooperation@xiaotuxian.demo，我们会在 3 个工作日内回复。',
            },
            {
                id: 'business-2',
                question: '支持企业采购与团购吗？',
                answer: '支持 50 件以上的企业采购与节日福利团购，可开具增值税专用发票，并提供专属客户经理对接。',
            },
            {
                id: 'business-3',
                question: '渠道与分销合作怎么联系？',
                answer: '我们开放 API 商品库与一件代发能力，欢迎内容平台、社群团长、线下门店联系我们洽谈分销合作。',
            },
        ],
    },
    {
        id: 'search',
        name: '搜索推荐',
        desc: '搜不到想要的商品？试试这些技巧',
        articles: [
            {
                id: 'search-1',
                question: '为什么搜索不到某个商品？',
                answer: '建议只输入核心词，例如搜「车厘子」而不是「进口智利车厘子2斤包邮」；也可以直接进入对应分类逐层浏览。',
            },
            {
                id: 'search-2',
                question: '推荐的商品是怎么来的？',
                answer: '「猜你喜欢」会结合你的浏览与购买记录推荐；「人气推荐」按近 30 天销量排序，属于全站热门。',
            },
            {
                id: 'search-3',
                question: '如何让自己的浏览记录不被用于推荐？',
                answer: '登录后进入「会员中心 - 安全设置」可以关闭个性化推荐，关闭后仅展示全站热门商品。',
            },
        ],
    },
    {
        id: 'links',
        name: '友情链接',
        desc: '与我们一起，把好物带给更多人',
        articles: [],
        links: [
            { name: '621电商 · 主站', desc: '生鲜、居家、数码全品类好物', url: '/' },
            { name: '621电商 · 严选', desc: '层层试用的自有品牌商品', url: `/category/${catIdOf(5)}` },
            { name: '621电商 · 品牌专区', desc: '合作品牌与联名企划', url: '/brand' },
            { name: '621电商 · 专题活动', desc: '换季焕新、厨房升级等活动', url: '/topic' },
        ],
    },
];

export function getHelpData(): HelpData {
    return {
        sections: HELP_SECTIONS,
        hotLines: ['订单查不到怎么办？', '退款多久到账？', '如何申请发票？', '会员积分怎么用？'],
        servicePhone: '400-0000-000',
        serviceTime: '周一至周日 8:00-18:00',
    };
}

/* ---------------------------------------------------------------- 关于我们 */

export interface AboutStat {
    value: string;
    label: string;
}

export interface AboutValue {
    icon: string;
    title: string;
    desc: string;
}

export interface AboutMilestone {
    year: string;
    title: string;
    desc: string;
}

export interface AboutData {
    name: string;
    slogan: string;
    intro: string;
    cover: string;
    story: { title: string; paragraphs: string[]; picture: string };
    stats: AboutStat[];
    values: AboutValue[];
    milestones: AboutMilestone[];
    contact: { address: string; phone: string; email: string; time: string };
}

export function getAboutData(): AboutData {
    return {
        name: '621电商',
        slogan: '让日子过得讲究一点',
        intro: '我们相信，好的生活不需要很贵。621电商从一颗车厘子开始，把源头好物直接送到你家门口。',
        // 头图只做纯色渐变背景，标题文字由页面叠加（label 传空字符串即可）
        cover: image('', { width: 1240, height: 420, seed: 2030 }),
        story: {
            title: '从一颗车厘子开始',
            paragraphs: [
                '2016 年冬天，团队在智利的一处果园里蹲了整整两周，只为确认一颗车厘子的糖度是否稳定。那一年，我们只做了一件事：把真正好吃的车厘子，用最快的速度送到国内。',
                '十年过去，621电商从生鲜做起，慢慢长成了覆盖居家、美食、服饰、母婴、数码等十大品类的品质生活平台。唯一没变的，是每一件商品上架前都要经过试用与质检。',
                '我们不做最便宜的生意，也不追求最全的货架。我们只想让你在挑东西的时候少纠结一点——因为该纠结的部分，我们已经替你做完了。',
            ],
            picture: image('621电商 · 品牌故事', { width: 560, height: 420, seed: 3031, subLabel: '产地直采 · 层层试用' }),
        },
        stats: [
            { value: '2016', label: '品牌创立' },
            { value: '1300万+', label: '累计用户' },
            { value: '138', label: '在售商品数' },
            { value: '320', label: '覆盖城市' },
        ],
        values: [
            { icon: 'icon-queren-', title: '品质优先', desc: '每件商品上架前都要经过试吃、试用与质检，不合格的一律退回。' },
            { icon: 'icon-dw', title: '产地直采', desc: '生鲜品类与产地果园直接合作，省掉中间环节，更新鲜也更实在。' },
            { icon: 'icon-favorite-filling', title: '价格亲民', desc: '不靠花哨的营销堆价格，把成本花在商品本身。' },
            { icon: 'icon-duihua', title: '服务兜底', desc: '七天无理由退换、破损包赔、物流实时跟踪，出问题我们负责到底。' },
        ],
        milestones: [
            { year: '2016', title: '品牌创立', desc: '从智利车厘子单品起步，第一批 3000 箱 48 小时售罄。' },
            { year: '2018', title: '扩展至十大品类', desc: '居家、服饰、母婴等品类陆续上线，商品数突破 1000 款。' },
            { year: '2021', title: '用户破千万', desc: '累计服务用户超过 1000 万，次日达覆盖 200 个城市。' },
            { year: '2023', title: '推出自有品牌', desc: '「621严选」上线，从选品走向参与研发与生产。' },
            { year: '2026', title: '线上线下融合', desc: '城市体验店与线上商城打通，覆盖 320 个城市。' },
        ],
        contact: {
            address: '浙江省杭州市西湖区文三路 199 号 3 幢',
            phone: '400-0000-000',
            email: 'hello@xiaotuxian.demo',
            time: '周一至周日 8:00-18:00',
        },
    };
}

/* ---------------------------------------------------------------- 品牌专区 */

export interface BrandGoodsItem {
    id: string;
    name: string;
    price: string;
    picture: string;
}

export interface BrandListItem {
    id: string;
    name: string;
    nameEn: string;
    logo: string;
    desc: string;
    picture: string;
    goodsCount: number;
    catName: string;
    /** 品牌所属的一级分类（用于跳转分类页） */
    catId: string;
    goods: BrandGoodsItem[];
}

/** 从商品数据里聚合出品牌列表（每个一级分类对应一个品牌） */
export function getBrandList(): BrandListItem[] {
    const group = new Map<string, { brand: Product['brand']; list: Product[] }>();
    products.forEach((product) => {
        const exist = group.get(product.brand.id);
        if (exist) {
            exist.list.push(product);
        } else {
            group.set(product.brand.id, { brand: product.brand, list: [product] });
        }
    });

    return [...group.values()].map(({ brand, list }) => ({
        id: brand.id,
        name: brand.name,
        nameEn: brand.nameEn,
        logo: brand.logo,
        desc: brand.desc,
        picture: brand.picture,
        goodsCount: list.length,
        catName: list[0]?.catName ?? '',
        catId: list[0]?.catId ?? '',
        goods: spreadByCat(list[0]?.catId ?? '').slice(0, 4).map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            picture: item.picture,
        })),
    }));
}

/* ---------------------------------------------------------------- 专题活动 */

export interface TopicItem {
    id: string;
    title: string;
    subtitle: string;
    desc: string;
    tag: string;
    cover: string;
    /** 跳转目标：某个分类或某个商品 */
    href: string;
    goods: BrandGoodsItem[];
}

const TOPIC_SEEDS: Array<{
    title: string;
    subtitle: string;
    desc: string;
    tag: string;
    catIndex: number;
    seed: number;
}> = [
    {
        title: '换季焕新 · 收拾出一个清爽的家',
        subtitle: '收纳整理专场',
        desc: '从玄关到厨房，把每个角落都理顺。收纳箱、置物架、分隔盒一价到底。',
        tag: '居家专场',
        catIndex: 0,
        seed: 4101,
    },
    {
        title: '产地直采 · 这一口就知道新鲜',
        subtitle: '当季水果上新',
        desc: '48 小时从枝头到餐桌。车厘子、蓝莓、贵妃芒，坏果包赔不玩虚的。',
        tag: '生鲜专场',
        catIndex: 1,
        seed: 4202,
    },
    {
        title: '基础款也有高级感',
        subtitle: '纯棉衣物满减',
        desc: '不挑人不挑场合的基础款，穿三四年也不过时，全场满 199 减 30。',
        tag: '服饰专场',
        catIndex: 2,
        seed: 4303,
    },
    {
        title: '数码好物 · 好听好看还耐用',
        subtitle: '影音装备精选',
        desc: '耳机、音箱、投屏器，实测过的低延迟与长续航，通勤路上刚刚好。',
        tag: '数码专场',
        catIndex: 6,
        seed: 4404,
    },
    {
        title: '给宝宝更温柔的呵护',
        subtitle: '母婴安心购',
        desc: 'A 类面料、无骨缝制、食品级材质，每一件都经得起妈妈们的挑剔。',
        tag: '母婴专场',
        catIndex: 3,
        seed: 4505,
    },
    {
        title: '每一次出汗 都有好装备',
        subtitle: '运动户外季',
        desc: '瑜伽垫、弹力带、冲锋衣，家里能练、出门能扛的实用装备。',
        tag: '运动专场',
        catIndex: 7,
        seed: 4606,
    },
];

export function getTopicList(): TopicItem[] {
    return TOPIC_SEEDS.map((seed, index) => {
        const catId = catIdOf(seed.catIndex);
        const list = spreadByCat(catId).slice(0, 4);
        return {
            id: String(9100 + index),
            title: seed.title,
            subtitle: seed.subtitle,
            desc: seed.desc,
            tag: seed.tag,
            cover: imageSet(seed.title, 1, { width: 800, height: 420, seed: seed.seed })[0] ?? '',
            href: `/category/${catId}`,
            goods: list.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                picture: item.picture,
            })),
        };
    });
}

/** 首页底部「服务承诺」之类的文案，供内容页复用 */
export const SERVICE_PROMISES = ['价格亲民', '物流快捷', '品质新鲜'];

/** 分类总数（关于我们页面用） */
export const categoryCount = CATALOG.length;

/** 商品总数 */
export const goodsCount = products.length;

/** 便于其他页面复用的列表项转换 */
export { toListItem };
