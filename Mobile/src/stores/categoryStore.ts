import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategoryAPI as getNavCategoryAPI } from '@/apis/layout.ts'
import { getCategoryAPI as getCategoryDetailAPI } from '@/apis/category.ts'
import type { CategroyItem } from '@/apis/layout.ts'

/**
 * 分类数据
 * - navList：首页金刚区 + 分类页左侧一级分类（GET /home/category/head）
 * - detail：分类页右侧选中项对应的二级分类（GET /category）
 */
export const useCategoryStore = defineStore('category', () => {
    const navList = ref<CategroyItem[]>([])
    const detail = ref<any>(null)
    const activeId = ref('')

    async function getNavList() {
        if (navList.value.length) return navList.value
        const result = (await getNavCategoryAPI()) as any
        navList.value = result.result ?? []
        if (!activeId.value && navList.value.length) {
            activeId.value = navList.value[0]!.id
        }
        return navList.value
    }

    async function getCategoryDetail(id: string) {
        activeId.value = id
        const result = (await getCategoryDetailAPI(id)) as any
        detail.value = result.result
        return detail.value
    }

    return { navList, detail, activeId, getNavList, getCategoryDetail }
})
