import {getCategoryAPI, type CategoryItem} from '@/apis/category.ts'
import {useRoute, onBeforeRouteUpdate} from 'vue-router'
import {ref, onMounted} from 'vue'

export const useCategory = () => {
    let category = ref<CategoryItem>({} as CategoryItem);
    // 拿到当前页面的路由信息
    const route = useRoute();
    // 封装调用获取二级分类列表数据
    async function getCategory(id:string) {
        const result = await getCategoryAPI(id) as any;
        category.value = result.result;
    }
    onMounted(() => {
        getCategory(route.params.id as string);
    });

    // 监听路由id的变化--更新页面
    // watch(() => route.params.id, (newValue) => {
    //     if(newValue) {
    //         getCategory(newValue as string);
    //     }
    // });

    // 路由更新之前的钩子
    onBeforeRouteUpdate((to) => {
        // 但是此时route的路由还没有更新，所以使用to--表示最新的路由信息
        getCategory(to.params.id as string);
    });

    return {category};
}