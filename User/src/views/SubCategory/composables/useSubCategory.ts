import {onMounted} from 'vue'
import {useSubCategoryStore} from '@/stores/subCategoryStore.ts'

export const useSubCategory = () => {
    const SubCategoryStore = useSubCategoryStore();
    onMounted(() => {
        SubCategoryStore.getSubCategoryFilter(SubCategoryStore.route.params.id as string);
        SubCategoryStore.getSubCategory();
    });
}