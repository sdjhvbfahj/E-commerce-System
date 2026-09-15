/**
 * 首页假数据：新鲜好物 / 人气推荐 / 商品楼层
 */
import { image } from '../utils/image';
import { CATALOG } from './catalog';
import { catIdOf, subIdOf } from './ids';
import { products, productsByCat, spreadByCat, toListItem, type Product } from './products';

export interface NewItem {
    id: string;
    name: string;
    picture: string;
    price: string;
}

export interface HotItem {
    id: string;
    /** 主标题 */
    title: string;
    /** 副标题 */
    alt: string;
    picture: string;
}

export interface HomeGoodsBannerItem {
    id: string;
    name: string;
    picture: string;
    children: Array<{ id: string; name: string }>;
    goods: ReturnType<typeof toListItem>[];
}

/** 从某个一级分类里挑第 n 件商品（当作「精选」用） */
function pick(catIndex: number, index: number): Product | undefined {
    return productsByCat(catIdOf(catIndex))[index];
}

/** 新鲜好物：从 4 个不同分类各挑一件，页面看起来更丰富 */
export function getNewGoods(): NewItem[] {
    const picks = [pick(1, 0), pick(2, 0), pick(6, 0), pick(5, 0)].filter(
        (item): item is Product => Boolean(item)
    );
    return picks.map((item) => ({
        id: item.id,
        name: item.name,
        picture: item.picture,
        price: item.price,
    }));
}

/** 人气推荐：标题 + 副标题的形式 */
export function getHotGoods(): HotItem[] {
    const picks = [pick(1, 0), pick(4, 0), pick(3, 2), pick(7, 0)].filter(
        (item): item is Product => Boolean(item)
    );
    return picks.map((item) => ({
        id: item.id,
        title: item.name,
        alt: item.desc,
        picture: item.picture,
    }));
}

/** 首页商品楼层：取前 5 个一级分类 */
export function getGoodsBlocks(): HomeGoodsBannerItem[] {
    return CATALOG.slice(0, 5).map((cat, catIndex) => ({
        id: catIdOf(catIndex),
        name: cat.name,
        picture: image(`${cat.name} · 精选好物`, {
            width: 610,
            height: 610,
            seed: 900 + catIndex,
            subLabel: '为你精选',
        }),
        children: cat.subs.map((sub, subIndex) => ({
            id: subIdOf(catIndex, subIndex),
            name: sub.name,
        })),
        goods: spreadByCat(catIdOf(catIndex)).slice(0, 8).map(toListItem),
    }));
}

/** 商品总数量（首页底部统计用，可选） */
export const totalProductCount = products.length;
