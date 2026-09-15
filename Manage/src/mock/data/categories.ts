/**
 * 分类假数据：导航分类 / 分类页 / 二级分类筛选 / 二级分类商品分页
 */
import { CATALOG } from './catalog';
import { catIdOf, subIdOf } from './ids';
import { image } from '../utils/image';
import { paginate } from '../utils/helper';
import { productsBySub, spreadByCat, toListItem, type Product } from './products';

export interface NavChildrenItem {
    id: string;
    name: string;
    picture: string;
}

export interface NavCategoryItem {
    id: string;
    name: string;
    picture: string;
    children: NavChildrenItem[];
    goods: ReturnType<typeof toListItem>[];
}

export interface CategoryChildrenItem {
    id: string;
    name: string;
    picture: string;
    goods: ReturnType<typeof toListItem>[];
}

export interface CategoryDetailItem {
    id: string;
    name: string;
    children: CategoryChildrenItem[];
}

export interface SubCategoryFilterItem {
    id: string;
    name: string;
    parentId: string;
    parentName: string;
    categories: Array<{ id: string; name: string }>;
    goods: ReturnType<typeof toListItem>[];
}

/** 二级分类索引：subId -> 所属分类信息 */
interface SubRef {
    catId: string;
    catName: string;
    subId: string;
    subName: string;
    catIndex: number;
    subIndex: number;
}
const subRefs = new Map<string, SubRef>();
CATALOG.forEach((cat, catIndex) => {
    cat.subs.forEach((sub, subIndex) => {
        subRefs.set(subIdOf(catIndex, subIndex), {
            catId: catIdOf(catIndex),
            catName: cat.name,
            subId: subIdOf(catIndex, subIndex),
            subName: sub.name,
            catIndex,
            subIndex,
        });
    });
});

/** 二级分类图标（小尺寸，不带副标题） */
function subPicture(name: string, seed: number): string {
    return image(name, { width: 160, height: 160, seed, label: name });
}

/** 一级分类图标 */
function catPicture(name: string, seed: number): string {
    return image(name, { width: 120, height: 120, seed, label: name });
}

/** 导航分类（首页左侧导航 + 弹层推荐） */
export function getNavCategories(): NavCategoryItem[] {
    return CATALOG.map((cat, catIndex) => ({
        id: catIdOf(catIndex),
        name: cat.name,
        picture: catPicture(cat.name, catIndex + 1),
        children: cat.subs.map((sub, subIndex) => ({
            id: subIdOf(catIndex, subIndex),
            name: sub.name,
            picture: subPicture(sub.name, catIndex * 10 + subIndex),
        })),
        goods: spreadByCat(catIdOf(catIndex)).slice(0, 9).map(toListItem),
    }));
}

/** 分类页：一级分类下的所有二级分类 + 每个二级分类的推荐商品 */
export function getCategoryDetail(id: string): CategoryDetailItem | undefined {
    const catIndex = CATALOG.findIndex((_, index) => catIdOf(index) === id);
    const cat = CATALOG[catIndex];
    if (!cat) return undefined;

    return {
        id,
        name: cat.name,
        children: cat.subs.map((sub, subIndex) => {
            const subId = subIdOf(catIndex, subIndex);
            return {
                id: subId,
                name: sub.name,
                picture: subPicture(sub.name, catIndex * 10 + subIndex),
                goods: productsBySub(subId).slice(0, 5).map(toListItem),
            };
        }),
    };
}

/** 二级分类页顶部的筛选/面包屑数据 */
export function getSubCategoryFilter(id: string): SubCategoryFilterItem | undefined {
    const ref = subRefs.get(id);
    if (!ref) return undefined;
    const cat = CATALOG[ref.catIndex];
    if (!cat) return undefined;

    return {
        id: ref.subId,
        name: ref.subName,
        parentId: ref.catId,
        parentName: ref.catName,
        // 同一级分类下的兄弟分类（可当作筛选标签）
        categories: cat.subs.map((sub, subIndex) => ({
            id: subIdOf(ref.catIndex, subIndex),
            name: sub.name,
        })),
        goods: spreadByCat(ref.catId).slice(0, 6).map(toListItem),
    };
}

export interface SubCategoryQuery {
    categoryId: string;
    page: number;
    pageSize: number;
    sortField: string;
}

/** 二级分类商品列表（带排序 + 分页，支持无限滚动） */
export function getSubCategoryGoods(query: SubCategoryQuery) {
    const ref = subRefs.get(query.categoryId);
    // 找不到分类时，退化成「一级分类下全部商品」，避免前端出现空白
    const list: Product[] = ref ? productsBySub(ref.subId) : [];

    const sorted = [...list].sort((a, b) => {
        if (query.sortField === 'orderNum') return b.orderNum - a.orderNum;
        if (query.sortField === 'evaluateNum') return b.evaluateNum - a.evaluateNum;
        return b.publishTime - a.publishTime;
    });

    const paged = paginate(sorted, query.page, query.pageSize);
    return { ...paged, items: paged.items.map(toListItem) };
}

/** 二级分类名（面包屑等处需要） */
export function getSubName(id: string): string | undefined {
    return subRefs.get(id)?.subName;
}
