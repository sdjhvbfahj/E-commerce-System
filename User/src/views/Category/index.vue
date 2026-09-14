<template>
    <div class="Category wrapper">
        <CategoryBrandcrumb :category="category.name"/>
        <div class="banner">
            <CategoryBanner/>
        </div>
        <div class="goods">
            <CategoryGoods :secondCategory="category.children"/>
        </div>
    </div>
</template>

<script setup lang="ts" name="Category">
    import CategoryBrandcrumb from './components/CategoryBreadcrumb.vue'
    import CategoryBanner from './components/CategoryBanner.vue'
    import CategoryGoods from './components/CategoryGoods.vue'
    import {useCategory} from './composables/useCategory.ts'
    const {category} = useCategory();
</script>

<style scoped>
    .wrapper {
        width: 1240px;
        margin: 0px auto;
    }
    .Category {
        .banner {
            position: relative;
            width: 100%;
            height: 500px;
        }
    }
</style>