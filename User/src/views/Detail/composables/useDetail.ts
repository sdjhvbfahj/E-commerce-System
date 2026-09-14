import {getDetailAPI, type DetailItem} from '@/apis/detail.ts'
import {fetchHotGoodsAPI, type HotGoodsItem} from '@/apis/detail.ts'
import {ref, reactive, onMounted} from 'vue'
import {useRoute} from 'vue-router'

// 获取详情信息数据
export const useDetail = () => {
    const route = useRoute();
    const detailList = ref<DetailItem>({} as DetailItem);
    async function getDetail(id:string) {
        const result = await getDetailAPI(id) as any;
        detailList.value = result.result;
    }
    onMounted(() => {
        getDetail(route.params.id as string);
    })
    return {detailList};
}

// 获取热销榜数据
export const useDetailHot = (type:number) => {
    const route = useRoute();
    // 接收热销榜的数据
    const hotList = ref<HotGoodsItem[]>([]);
    // axois接口的params参数
    const HotParamsData = reactive({
        id: route.params.id as string,
        type: type,
        limit: 3
    });
    async function getDetailHot() {
        const result = await fetchHotGoodsAPI(HotParamsData) as any;
        hotList.value = result.result;
    }
    onMounted(() => {
        getDetailHot();
    });
    return {hotList, HotParamsData};
}