<template>
    <div class="CategoryBrandcrumb">
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ category }}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup lang="ts" name="CategoryBreadcrumb">
    import {ArrowRight} from '@element-plus/icons-vue'
    defineProps(['category']);
</script>

<style scoped lang="scss">
    .CategoryBrandcrumb {
        margin: 25px 7px;
    }
</style>