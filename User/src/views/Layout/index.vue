<template>
    <LayoutNav/>
    <LayoutHeader/>
    <LayoutFixed/>
    <!-- 传递一个key值，路由更新时先销毁再创建 -->
    <!-- <RouterView :key="$route.fullPath"></RouterView> -->
    <RouterView></RouterView>
    <LayoutFooter/>
</template>

<script setup lang="ts" name="Layout">
    import {onMounted} from 'vue'
    import LayoutNav from './components/LayoutNav.vue'
    import LayoutHeader from './components/LayoutHeader.vue'
    import LayoutFooter from './components/LayoutFooter.vue'
    import LayoutFixed from './components/LayoutFixed.vue';
    import {useCategoryStore} from '@/stores/categoryStore.ts'
    const categoryStore = useCategoryStore();
    onMounted(() => {
        // 调用封装的函数, 得到服务器中的数据, 并赋值给pinia中的数据
        categoryStore.getCategory();
    });
</script>

<style scoped>

</style>