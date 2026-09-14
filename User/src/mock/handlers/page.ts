/**
 * 内容型页面（帮助中心 / 关于我们 / 品牌专区 / 专题活动）的假接口
 * 对应的真实接口（本项目自拟，原项目这些页面是死链）：
 *   GET /help、/about、/brand、/topic
 */
import { getAboutData, getBrandList, getHelpData, getTopicList } from '../data/pages';

export const pageRoutes = {
    '/help': () => getHelpData(),
    '/about': () => getAboutData(),
    '/brand': () => getBrandList(),
    '/topic': () => getTopicList(),
};
