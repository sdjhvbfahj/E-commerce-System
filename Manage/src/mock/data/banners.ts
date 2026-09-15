/**
 * 轮播图假数据
 * distributionSite = '1' 首页轮播，'2' 分类页轮播（对齐真实接口的入参）
 */
import { image } from '../utils/image';
import { catIdOf } from './ids';

export interface BannerItem {
    id: string;
    imgUrl: string;
    hrefUrl: string;
    type: string;
}

interface BannerSeed {
    title: string;
    slogan: string;
    hrefUrl: string;
    seed: number;
}

const HOME_BANNERS: BannerSeed[] = [
    { title: '新鲜好物 · 产地直采', slogan: '48 小时从枝头到餐桌', hrefUrl: `/category/${catIdOf(1)}`, seed: 101 },
    { title: '居家焕新季', slogan: '收纳 · 清洁 · 厨房 一站配齐', hrefUrl: `/category/${catIdOf(0)}`, seed: 202 },
    { title: '数码好物严选', slogan: '好听好看 还耐用', hrefUrl: `/category/${catIdOf(6)}`, seed: 303 },
    { title: '换季衣橱计划', slogan: '基础款也能穿出高级感', hrefUrl: `/category/${catIdOf(2)}`, seed: 404 },
];

const CATEGORY_BANNERS: BannerSeed[] = [
    { title: '全部分类 · 正在热卖', slogan: '严选好物 品质之选', hrefUrl: `/category/${catIdOf(5)}`, seed: 505 },
    { title: '个护专场', slogan: '成分简单 温和有效', hrefUrl: `/category/${catIdOf(4)}`, seed: 606 },
    { title: '母婴安心购', slogan: '母婴友好选材 更温柔的呵护', hrefUrl: `/category/${catIdOf(3)}`, seed: 707 },
    { title: '运动户外季', slogan: '每一次出汗 都有好装备', hrefUrl: `/category/${catIdOf(7)}`, seed: 808 },
];

/** 获取轮播图 */
export function getBanners(distributionSite: string = '1'): BannerItem[] {
    const list = distributionSite === '2' ? CATEGORY_BANNERS : HOME_BANNERS;
    return list.map((item, index) => ({
        id: String(index + 1),
        imgUrl: image(item.title, { width: 1240, height: 500, seed: item.seed, subLabel: item.slogan }),
        hrefUrl: item.hrefUrl,
        type: distributionSite,
    }));
}
