import {defineStore} from 'pinia'
import {ref} from 'vue'
import {getCategoryAPI,type CategroyItem} from '@/apis/layout.ts'

export const useCategoryStore = defineStore('category', () => {
  // 复制导航分类类别的数据
  let categoryList = ref<CategroyItem[]>([]);

  // 封装分类数据的渲染函数
  const getCategory = async () => {
    const result = await getCategoryAPI() as any;
    categoryList.value = result.result as CategroyItem[];
  }

  return {categoryList, getCategory};
});