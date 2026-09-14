<template>
    <!-- 导航 -->
    <div class="nav">
        <ul>
            <li>
                <RouterLink exact-active-class="active" to="/">首页</RouterLink>
            </li>
            <li v-for="item in categoryStore.categoryList" :key="item.id">
                <RouterLink active-class="active" :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
            </li>
            <li class="nav-extra divider">
                <RouterLink active-class="active" to="/brand">品牌专区</RouterLink>
            </li>
            <li class="nav-extra">
                <RouterLink active-class="active" to="/topic">专题活动</RouterLink>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts" name="LayoutHeaderUI">
    import { useCategoryStore } from '@/stores/categoryStore.ts'
    // 可以直接获取pinia中暴露出来的数据(index.vue文件已经初始化数据了)
    const categoryStore = useCategoryStore();
</script>

<style scoped lang="scss">
    /* 首页 / 居家 / 美食 … 这些 tab 整体居中 */
    .nav {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .nav ul {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .nav ul li a {
        display: inline-block;
        height: 38px;
        line-height: 38px;
        padding: 0 16px;
        font-size: 15px;
        border-radius: 19px;
        color: $inkColor2;
        transition: all 0.22s ease;

        &:hover {
            color: $brandColor;
            background: $brandColorSoft;
        }
        &.active {
            color: #fff;
            background: $brandGradient;
            box-shadow: 0 6px 14px rgba(239, 95, 42, 0.24);
        }
    }
    // 品牌 / 专题用一条细线和大类分开
    .nav-extra.divider {
        margin-left: 10px;
        padding-left: 14px;
        border-left: 1px solid $lineColor;
    }
</style>
