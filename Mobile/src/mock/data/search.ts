/**
 * 搜索假数据
 * ---------------------------------------------------------------------------
 * 没有真实搜索接口，这里按关键词在「商品名 / 二级分类 / 一级分类 / 卖点 / 品牌」里做匹配，
 * 命中越准排得越前，同时把命中的分类也返回给页面做「快捷入口」。
 */
import { CATALOG } from './catalog';
import { products, toListItem, type Product } from './products';
import { catIdOf, subIdOf } from './ids';

export interface SearchCategoryHit {
    id: string;
    name: string;
    /** cat = 一级分类，sub = 二级分类 */
    type: 'cat' | 'sub';
    parentName: string;
    href: string;
}

export interface SearchResult {
    keyword: string;
    /** 命中总数 */
    counts: number;
    page: number;
    pages: number;
    pageSize: number;
    items: ReturnType<typeof toListItem>[];
    /** 命中的分类（最多 8 个） */
    categories: SearchCategoryHit[];
    /** 没搜到时的推荐词 */
    suggests: string[];
}

/** 兜底推荐词（搜不到时给用户一点方向） */
const SUGGEST_WORDS = ['车厘子', '收纳箱', '纯棉T恤', '蓝牙耳机', '瑜伽垫', '陶瓷餐具', '儿童水杯'];

/**
 * 给一个商品打分：命中越精确分越高
 * 100 商品名完全相同 > 90 商品名包含 > 70 二级分类 > 60 一级分类 > 45 卖点 > 35 品牌
 */
function scoreOf(product: Product, keyword: string): number {
    const kw = keyword.toLowerCase();
    const name = product.name.toLowerCase();

    if (name === kw) return 100;
    if (name.includes(kw)) return 90;
    if (product.subName?.toLowerCase().includes(kw)) return 70;
    if (product.catName?.toLowerCase().includes(kw)) return 60;
    if (product.desc?.toLowerCase().includes(kw)) return 45;
    if (product.brand?.name?.toLowerCase().includes(kw)) return 35;
    if (product.brand?.nameEn?.toLowerCase().includes(kw)) return 35;
    return 0;
}

/** 收集命中的分类，作为搜索页顶部的快捷入口 */
function matchCategories(keyword: string): SearchCategoryHit[] {
    const kw = keyword.toLowerCase();
    const hits: SearchCategoryHit[] = [];
    CATALOG.forEach((cat, catIndex) => {
        const catId = catIdOf(catIndex);
        if (cat.name.toLowerCase().includes(kw)) {
            hits.push({ id: catId, name: cat.name, type: 'cat', parentName: '', href: `/category/${catId}` });
        }
        cat.subs.forEach((sub, subIndex) => {
            if (sub.name.toLowerCase().includes(kw)) {
                const subId = subIdOf(catIndex, subIndex);
                hits.push({
                    id: subId,
                    name: sub.name,
                    type: 'sub',
                    parentName: cat.name,
                    href: `/category/sub/${subId}`,
                });
            }
        });
    });
    // 二级分类更精确，排在前面
    return hits.sort((a, b) => (a.type === b.type ? 0 : a.type === 'sub' ? -1 : 1)).slice(0, 8);
}

export function searchProducts(keyword: string, page = 1, pageSize = 20): SearchResult {
    const kw = (keyword ?? '').trim();
    if (!kw) {
        return {
            keyword: '',
            counts: 0,
            page: 1,
            pages: 0,
            pageSize,
            items: [],
            categories: [],
            suggests: SUGGEST_WORDS,
        };
    }

    const scored = products
        .map((product) => ({ product, score: scoreOf(product, kw) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || b.product.salesCount - a.product.salesCount);

    const counts = scored.length;
    const current = Math.max(1, Number(page) || 1);
    const size = Math.max(1, Number(pageSize) || 20);
    const pages = Math.ceil(counts / size);
    const slice = scored.slice((current - 1) * size, current * size);

    return {
        keyword: kw,
        counts,
        page: current,
        pages,
        pageSize: size,
        items: slice.map((item) => toListItem(item.product)),
        categories: matchCategories(kw),
        suggests: counts ? [] : SUGGEST_WORDS,
    };
}
