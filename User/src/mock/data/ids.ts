/**
 * 统一的 ID 规则（分类 / 商品）
 * 单独抽出来是为了避免 products.ts 和 categories.ts 互相引用造成循环依赖。
 */

/** 一级分类 id：1005000 ~ 1005009 */
export const catIdOf = (catIndex: number): string => String(1005000 + catIndex);

/** 二级分类 id：1005010 起，每个一级分类预留 100 个位置 */
export const subIdOf = (catIndex: number, subIndex: number): string => String(1005010 + catIndex * 100 + subIndex);

/** 商品 id：1500001 起自增 */
export const productIdOf = (n: number): string => String(1500000 + n);
