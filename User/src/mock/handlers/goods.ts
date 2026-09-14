/**
 * 首页 / 分类 / 商品详情 相关的假接口
 * 对应的真实接口：
 *   GET  /home/banner、/home/new、/home/hot、/home/goods、/home/category/head
 *   GET  /category、/category/sub/filter
 *   POST /category/goods/temporary
 *   GET  /goods、/goods/hot、/goods/relevant
 *   GET  /search（本项目自拟：关键词搜索商品与分类）
 */
import { getBanners } from '../data/banners';
import { getGoodsBlocks, getHotGoods, getNewGoods } from '../data/home';
import {
    getCategoryDetail,
    getNavCategories,
    getSubCategoryFilter,
    getSubCategoryGoods,
} from '../data/categories';
import { findProduct, productsByCat, recommendProducts, toListItem, type Product } from '../data/products';
import { searchProducts } from '../data/search';
import { fail, toNumber, toText, type MockContext } from '../types';

/** 详情页需要的完整数据 */
function buildDetail(product: Product) {
    const related = productsByCat(product.catId).filter((item) => item.id !== product.id);
    return {
        id: product.id,
        name: product.name,
        desc: product.desc,
        price: product.price,
        oldPrice: product.oldPrice,
        brand: product.brand,
        /**
         * 注意顺序：面包屑组件里 categories[1] 是一级分类（跳 /category/:id），
         * categories[0] 是二级分类（跳 /category/sub/:id）
         */
        categories: [
            { id: product.subId, name: product.subName },
            { id: product.catId, name: product.catName },
        ],
        hotByDay: related.slice(0, 6).map(toListItem),
        details: product.details,
        salesCount: product.salesCount,
        commentCount: product.commentCount,
        collectCount: product.collectCount,
        mainPictures: product.mainPictures,
        specs: product.specs,
        skus: product.skus,
    };
}

/** 热榜商品（type 1 = 24 小时热销榜，type 2 = 周热销榜） */
function buildHotGoods(ctx: MockContext) {
    const id = toText(ctx.params.id);
    const type = toNumber(ctx.params.type, 1);
    const limit = toNumber(ctx.params.limit, 3);
    const current = findProduct(id);
    const catId = current?.catId;

    const pool = (catId ? productsByCat(catId) : [])
        .filter((item) => item.id !== id)
        .sort((a, b) => (type === 2 ? b.evaluateNum - a.evaluateNum : b.salesCount - a.salesCount));

    return pool.slice(0, limit || 3).map(toListItem);
}

export const goodsRoutes = {
    '/home/banner': (ctx: MockContext) => getBanners(toText(ctx.params.distributionSite, '1')),
    '/home/new': () => getNewGoods(),
    '/home/hot': () => getHotGoods(),
    '/home/goods': () => getGoodsBlocks(),
    '/home/category/head': () => getNavCategories(),
    '/category': (ctx: MockContext) => {
        const id = toText(ctx.params.id);
        const detail = getCategoryDetail(id);
        if (!detail) fail(404, '该分类不存在');
        return detail;
    },
    '/category/sub/filter': (ctx: MockContext) => {
        const id = toText(ctx.params.id);
        const filter = getSubCategoryFilter(id);
        if (!filter) fail(404, '该二级分类不存在');
        return filter;
    },
    '/category/goods/temporary': (ctx: MockContext) => {
        const data = ctx.data ?? {};
        return getSubCategoryGoods({
            categoryId: toText(data.categoryId ?? ctx.params.id),
            page: toNumber(data.page, 1),
            pageSize: toNumber(data.pageSize, 20),
            sortField: toText(data.sortField, 'publishTime'),
        });
    },
    '/goods': (ctx: MockContext) => {
        const product = findProduct(toText(ctx.params.id));
        if (!product) fail(404, '商品不存在或已下架');
        return buildDetail(product);
    },
    '/goods/hot': buildHotGoods,
    '/goods/relevant': (ctx: MockContext) => {
        const limit = toNumber(ctx.params.limit, 4);
        return recommendProducts(limit || 4);
    },

    /**
     * 关键词搜索：商品名 / 二级分类 / 一级分类 / 卖点 / 品牌都会参与匹配，
     * 同时返回命中的分类，页面上可以一键跳过去
     */
    '/search': (ctx: MockContext) => {
        const keyword = toText(ctx.params.keyword || ctx.params.q);
        const page = toNumber(ctx.params.page, 1);
        const pageSize = toNumber(ctx.params.pageSize, 20);
        return searchProducts(keyword, page || 1, pageSize || 20);
    },
};
