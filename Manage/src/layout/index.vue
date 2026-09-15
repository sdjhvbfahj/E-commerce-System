<template>
    <div class="admin-layout">
        <!-- 左侧菜单 -->
        <LayoutAside />
        <!-- 右侧主体 -->
        <div class="admin-body">
            <LayoutHeader />
            <main class="admin-content">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts" name="Layout">
    import LayoutAside from './components/LayoutAside.vue'
    import LayoutHeader from './components/LayoutHeader.vue'
</script>

<style scoped lang="scss">
    .admin-layout {
        display: flex;
        height: 100%;
        overflow: hidden;
    }
    .admin-body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
    }
    .admin-content {
        flex: 1;
        overflow: auto;
        background-color: $bgColor;
        // 让页面自带 padding，这里不再加
    }
</style>
