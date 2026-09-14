<template>
    <div class="SubCategory wrapper">
        <SubCategoryBrandcrumb/>
        <SubCategoryGoods/>
    </div>
</template>

<script setup lang="ts" name="SubCategory">
    import SubCategoryBrandcrumb from './components/SubCategoryBreadcrumb.vue'
    import SubCategoryGoods from './components/SubCategoryGoods.vue'
    import {useSubCategory} from './composables/useSubCategory.ts'
    
    useSubCategory();
</script>

<style scoped lang="scss">
    .wrapper {
        width: 1240px;
        margin: 0px auto;
    }
</style>