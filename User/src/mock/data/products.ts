/**
 * 商品假数据：由 catalog.ts 自动构建
 * ---------------------------------------------------------------------------
 * 自动生成的内容包括：
 *  - 商品主图 / 详情长图（离线 SVG 假图；少数重点商品用真实照片）
 *  - 规格（specs）与 SKU 组合（skus）：支持详情页 XtxSku 组件的选择联动
 *  - 品牌、销量、评价数、收藏数、上架时间（用于排序）
 */
import { CATALOG, type SpecSeed } from './catalog';
import { catIdOf, productIdOf, subIdOf } from './ids';
import { image, imageSet } from '../utils/image';
import { price as fmtPrice, shuffle } from '../utils/helper';

// 真实商品照片（来源与授权见 assets/images/goods/ATTRIBUTION.json）
import cherriesPhoto from '@/assets/images/goods/cherries.jpg';
import tshirtPhoto from '@/assets/images/goods/tshirt.jpg';
import earbudsPhoto from '@/assets/images/goods/earbuds.jpg';
import headphonesPhoto from '@/assets/images/goods/headphones.jpg';
import panPhoto from '@/assets/images/goods/pan-nonstick.jpg';
import tablewarePhoto from '@/assets/images/goods/tableware.jpg';
import yogaMatPhoto from '@/assets/images/goods/yoga-mat.jpg';

/**
 * 少数「重点商品」用真实照片展示，其余商品继续用离线 SVG 假图。
 * 想再换商品：在这里加一行「商品名 -> 图片地址」即可（也可以直接写外链）。
 */
const REAL_PICTURES: Record<string, string> = {
    '智利进口车厘子2斤': cherriesPhoto,
    '纯棉基础款圆领T恤': tshirtPhoto,
    '真无线蓝牙耳机': earbudsPhoto,
    '头戴式降噪耳机': headphonesPhoto,
    '麦饭石不粘炒锅': panPhoto,
    '日式陶瓷餐具套装': tablewarePhoto,
    '加厚防滑瑜伽垫': yogaMatPhoto,
};

/** 取商品主图：优先真实照片，否则用生成的假图 */
function mainPicture(name: string, seed: number): string {
    return REAL_PICTURES[name] ?? image(name, { width: 400, height: 400, seed });
}

/** 取商品多图：有真实照片时把它放在第一张 */
function mainPictures(name: string, seed: number): string[] {
    const real = REAL_PICTURES[name];
    const generated = imageSet(name, real ? 4 : 5, { width: 400, height: 400, seed: seed + 11 });
    return real ? [real, ...generated] : generated;
}

export interface SpecValue {
    name: string;
    picture?: string;
    disabled?: boolean;
    selected?: boolean;
}
export interface Spec {
    id: string;
    name: string;
    values: SpecValue[];
}
export interface SkuSpec {
    name: string;
    valueName: string;
}
export interface Sku {
    id: string;
    inventory: number;
    price: string;
    oldPrice: string;
    specs: SkuSpec[];
}
export interface Brand {
    id: string;
    name: string;
    nameEn: string;
    logo: string;
    desc: string;
    picture: string;
}
export interface DetailProperty {
    name: string;
    value: string;
}
export interface Product {
    id: string;
    name: string;
    desc: string;
    price: string;
    oldPrice: string;
    picture: string;
    /** 归属分类 */
    catId: string;
    catName: string;
    subId: string;
    subName: string;
    /** 排序字段（对齐真实接口的 sortField：orderNum / evaluateNum / publishTime） */
    orderNum: number;
    evaluateNum: number;
    publishTime: number;
    /** 详情页数据 */
    brand: Brand;
    mainPictures: string[];
    details: { pictures: string[]; properties: DetailProperty[] };
    specs: Spec[];
    skus: Sku[];
    salesCount: number;
    commentCount: number;
    collectCount: number;
}

/** 每个一级分类对应一个「品牌」 */
const BRANDS: ReadonlyArray<readonly [string, string, string]> = [
    ['优家良品', 'YOUJIA HOME', '专注居家好物，让日子过得讲究一点。'],
    ['鲜果时光', 'FRESH TIME', '产地直采，从枝头到餐桌不超过 48 小时。'],
    ['简白', 'JANBAI', '基础款也能有高级感，舒适是第一原则。'],
    ['贝贝乐', 'BABY LOVE', '母婴友好选材，给宝宝更温柔的呵护。'],
    ['清润', 'QINGRUN', '成分简单，温和有效，日常护理刚刚好。'],
    ['621严选', '621 SELECT', '每一件都经过层层试用，只留下值得推荐的。'],
    ['星驰', 'STARCI', '把好用的科技做成不贵的东西。'],
    ['越动', 'YUEDONG', '为每一次出汗，提供专业又耐用的装备。'],
    ['慢生活', 'SLOWLIFE', '一点点小物，让生活多一点松弛感。'],
    ['621电商', '621 BRAND', '621电商自有品牌，品质与口碑的双重保证。'],
];

const ORIGINS = ['中国·杭州', '中国·上海', '中国·成都', '中国·广州', '中国·青岛', '中国·苏州'];

/** 稳定伪随机：同一个商品每次刷新得到的数字都一样 */
function rand(seed: number, offset = 0): number {
    const value = Math.sin(seed * 12.9898 + offset * 78.233) * 43758.5453;
    return value - Math.floor(value);
}

function randInt(seed: number, offset: number, min: number, max: number): number {
    return min + Math.floor(rand(seed, offset) * (max - min + 1));
}

/** 规格值做笛卡尔积，得到所有 SKU 组合 */
function cartesian(specs: SpecSeed[]): SkuSpec[][] {
    let combos: SkuSpec[][] = [[]];
    specs.forEach(([specName, values]) => {
        const next: SkuSpec[][] = [];
        combos.forEach((combo) => {
            values.forEach((value) => {
                next.push([...combo, { name: specName, valueName: value }]);
            });
        });
        combos = next;
    });
    return combos;
}

function buildSpecs(specs: SpecSeed[], productId: string): Spec[] {
    return specs.map(([specName, values], index) => ({
        id: `${productId}-s${index + 1}`,
        name: specName,
        values: values.map((value) => ({ name: value })),
    }));
}

function buildSkus(specs: SpecSeed[], basePrice: number, productId: string): Sku[] {
    const combos = cartesian(specs);
    const oldPrice = fmtPrice(basePrice * 1.25);
    return combos.map((combo, index) => ({
        id: `${productId}${String(index + 1).padStart(2, '0')}`,
        // 每件商品留一个「缺货」SKU，用来演示规格的禁用状态
        inventory: combos.length >= 4 && index === combos.length - 1 ? 0 : randInt(basePrice * 100, index, 60, 400),
        price: fmtPrice(basePrice),
        oldPrice,
        specs: combo,
    }));
}

/** 构建全部商品 */
function buildProducts(): Product[] {
    const list: Product[] = [];
    let counter = 0;

    CATALOG.forEach((cat, catIndex) => {
        const catId = catIdOf(catIndex);
        const brandSeed = BRANDS[catIndex] ?? BRANDS[0]!;
        const [brandName, brandNameEn, brandDesc] = brandSeed;

        cat.subs.forEach((sub, subIndex) => {
            const subId = subIdOf(catIndex, subIndex);

            sub.goods.forEach((seed) => {
                counter += 1;
                const id = productIdOf(counter);
                const numericSeed = Number(id);
                const basePrice = seed.price;
                const specs = buildSpecs(cat.specs, id);
                const skus = buildSkus(cat.specs, basePrice, id);

                const brand: Brand = {
                    id: `brand-${catIndex + 1}`,
                    name: brandName,
                    nameEn: brandNameEn,
                    logo: image(brandName, { width: 120, height: 120, seed: catIndex + 3 }),
                    desc: brandDesc,
                    picture: image(brandName, { width: 300, height: 200, seed: catIndex + 5, subLabel: brandNameEn }),
                };

                const origin = ORIGINS[randInt(numericSeed, 3, 0, ORIGINS.length - 1)] ?? ORIGINS[0]!;
                const salesCount = randInt(numericSeed, 5, 320, 9800);
                const commentCount = Math.max(12, Math.round(salesCount * 0.28));
                const collectCount = Math.max(20, Math.round(salesCount * 0.45));

                list.push({
                    id,
                    name: seed.name,
                    desc: seed.desc,
                    price: fmtPrice(basePrice),
                    oldPrice: fmtPrice(seed.oldPrice ?? basePrice * 1.25),
                    picture: mainPicture(seed.name, numericSeed),
                    catId,
                    catName: cat.name,
                    subId,
                    subName: sub.name,
                    orderNum: randInt(numericSeed, 7, 50, 5000),
                    evaluateNum: commentCount,
                    // 上架时间：越靠前的商品越新，保证「最新商品」排序有变化
                    publishTime: Date.parse('2024-09-01T10:00:00+08:00') - counter * 36e5 * 7,
                    brand,
                    mainPictures: mainPictures(seed.name, numericSeed),
                    details: {
                        pictures: imageSet(`${seed.name} 商品详情`, 4, {
                            width: 800,
                            height: 560,
                            seed: numericSeed + 100,
                            subLabel: '商品详情图',
                        }),
                        properties: [
                            { name: '品牌', value: brand.name },
                            { name: '商品编号', value: id },
                            { name: '产地', value: origin },
                            { name: '可选规格', value: cat.specs.map(([n, v]) => `${n}（${v.length}种）`).join('  ') },
                            { name: '适用场景', value: '居家日常 送礼自用' },
                            { name: '包装清单', value: `${seed.name} × 1、说明卡 × 1` },
                            { name: '上市时间', value: '2024-09' },
                            { name: '保质期', value: catIndex === 1 ? '12个月' : '36个月' },
                            { name: '储存方式', value: '置于阴凉干燥处，避免阳光直射' },
                            { name: '售后服务', value: '七天无理由退换 · 破损包赔' },
                        ],
                    },
                    specs,
                    skus,
                    salesCount,
                    commentCount,
                    collectCount,
                });
            });
        });
    });

    return list;
}

/** 全部商品 */
export const products: Product[] = buildProducts();

/** 商品 id -> 商品 */
export const productMap = new Map<string, Product>(products.map((item) => [item.id, item]));

/** skuId -> 商品 & sku（购物车等处需要根据 skuId 反查商品信息） */
export interface SkuRecord {
    product: Product;
    sku: Sku;
    /** 例如「颜色：米白 尺码：M」，对齐真实接口的 attrsText */
    attrsText: string;
}
export const skuMap = new Map<string, SkuRecord>();
products.forEach((product) => {
    product.skus.forEach((sku) => {
        skuMap.set(sku.id, {
            product,
            sku,
            attrsText: sku.specs.map((spec) => `${spec.name}：${spec.valueName}`).join(' '),
        });
    });
});

/** 查询：按 id 取商品 */
export function findProduct(id: string): Product | undefined {
    return productMap.get(id);
}

/** 查询：某个二级分类下的全部商品 */
export function productsBySub(subId: string): Product[] {
    return products.filter((item) => item.subId === subId);
}

/** 查询：某个一级分类下的全部商品 */
export function productsByCat(catId: string): Product[] {
    return products.filter((item) => item.catId === catId);
}

/** 查询：猜你喜欢 / 热销推荐（排除当前商品，结果稳定） */
export function recommendProducts(limit = 4, excludeId?: string): Product[] {
    const pool = products.filter((item) => item.id !== excludeId);
    return shuffle(pool, 20240914).slice(0, limit);
}

/**
 * 查询：把某个一级分类下的商品按二级分类「轮流」取出来
 * 这样首页楼层里相邻的商品来自不同二级分类，视觉上更自然
 */
export function spreadByCat(catId: string): Product[] {
    const group = new Map<string, Product[]>();
    productsByCat(catId).forEach((item) => {
        const list = group.get(item.subId);
        if (list) {
            list.push(item);
        } else {
            group.set(item.subId, [item]);
        }
    });
    const buckets = [...group.values()];
    const result: Product[] = [];
    let cursor = 0;
    let hasMore = true;
    while (hasMore) {
        hasMore = false;
        buckets.forEach((bucket) => {
            const item = bucket[cursor];
            if (item) {
                result.push(item);
                hasMore = true;
            }
        });
        cursor += 1;
    }
    return result;
}

/** 列表卡片需要的精简字段 */
export function toListItem(product: Product) {
    return {
        id: product.id,
        name: product.name,
        desc: product.desc,
        price: product.price,
        picture: product.picture,
        orderNum: product.orderNum,
    };
}
