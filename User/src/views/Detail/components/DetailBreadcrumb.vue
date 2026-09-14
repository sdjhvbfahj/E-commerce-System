<template>
    <div class="bread-container">
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <!-- 使用可选链语法?    方式初始化时undefined遇上(数组强依赖类型)(多层属性访问)会出现报错, 导致页面渲染失败 -->
            <el-breadcrumb-item :to="{ path: `/category/${detailList.categories?.[1].id}` }">{{ detailList?.categories?.[1].name }}</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: `/category/sub/${detailList.categories?.[0].id}` }">{{ detailList?.categories?.[0].name }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ detailList.name }}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup lang="ts" name="DetailBreadcrumb">
    import {ArrowRight} from '@element-plus/icons-vue'
    defineProps(['detailList']);
</script>

<style scoped lang="scss">
    .bread-container {
        padding: 25px 7px;
    }
</style>