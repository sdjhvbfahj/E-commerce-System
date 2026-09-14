import {defineStore} from 'pinia'
import {getSubCategoryAPI, type SubCategoryItem} from '@/apis/subCategory.ts'
import {getSubCategoryFilterAPI, type SubCategoryFilterItem} from '@/apis/subCategory.ts'
import {reactive, ref} from 'vue'
import {useRoute} from 'vue-router'

export const useSubCategoryStore = defineStore('subCategory', () => {
    // 定义一个ref响应式对象来接收Filter数据
    const subCategoryFilterList = ref<SubCategoryFilterItem>({} as SubCategoryFilterItem);
    const route = useRoute();
    // 封装获取Filter数据的接口函数
    async function getSubCategoryFilter(id:string) {
        const result = await getSubCategoryFilterAPI(id) as any;
        subCategoryFilterList.value = result.result;
    }

    // 定义一个ref响应式对象来接收goods商品数据
    const subCategoryList = ref<SubCategoryItem>({} as SubCategoryItem);
    // 传递给服务器的数据
    const requestData = reactive({
        categoryId: route.params.id as string,
        page: 1,
        pageSize: 20,
        sortField: 'publishTime'
    });
    // 封装获取商品数据的接口函数
    async function getSubCategory() {
        const result = await getSubCategoryAPI(requestData) as any;
        subCategoryList.value = result.result;
    }
    return {subCategoryFilterList, getSubCategoryFilter, subCategoryList, getSubCategory, route, requestData}
});