import {getBannerAPI, type BannerItem} from '@/apis/home.ts'
import {ref} from 'vue'

export const useBanner = () => {
    // 存放banner数据
    let bannerList = ref<BannerItem[]>([]);
    // 封装获取banner数据函数
    const getBanner = async (distributionSite:string = '1') => {
        const result = await getBannerAPI(distributionSite) as any;
        bannerList.value = result.result;
    }
    return {bannerList, getBanner};
}