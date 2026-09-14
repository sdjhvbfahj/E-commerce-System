<template>
    <div class="SubCategoryBrandcrumb">
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: `/category/${subCategoryFilterList.parentId}` }">{{ subCategoryFilterList.parentName }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ subCategoryFilterList.name }}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup lang="ts" name="SubCategoryBreadcrumb">
    import {ArrowRight} from '@element-plus/icons-vue'
    import {useSubCategoryStore} from '@/stores/subCategoryStore.ts'
    import {storeToRefs} from 'pinia'
    const SubCategoryStore = useSubCategoryStore();
    const {subCategoryFilterList} = storeToRefs(SubCategoryStore);
</script>

<style scoped lang="scss">
    .SubCategoryBrandcrumb {
        margin: 25px 7px;
    }
</style>