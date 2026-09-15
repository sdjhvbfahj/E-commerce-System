<template>
    <aside class="admin-aside" :class="{ collapsed: permissionStore.collapsed }">
        <!-- logo -->
        <div class="logo">
            <span class="badge">621</span>
            <div class="txt" v-show="!permissionStore.collapsed">
                <p class="name">621电商</p>
                <p class="sub">运营管理端</p>
            </div>
        </div>
        <!-- 菜单 -->
        <el-scrollbar class="menu-wrap">
            <el-menu
                class="admin-menu"
                :collapse="permissionStore.collapsed"
                :collapse-transition="false"
                :default-active="activeMenu"
                router
            >
                <template v-for="item in permissionStore.menus" :key="item.path">
                    <!-- 有子菜单 -->
                    <el-sub-menu v-if="item.children?.length" :index="item.path">
                        <template #title>
                            <el-icon><component :is="item.icon" /></el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
                            <el-icon><component :is="child.icon" /></el-icon>
                            <span>{{ child.title }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <!-- 没有子菜单 -->
                    <el-menu-item v-else :index="item.path">
                        <el-icon><component :is="item.icon" /></el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </el-menu>
        </el-scrollbar>
        <!-- 底部：重置演示数据 -->
        <div class="aside-footer">
            <el-tooltip content="把演示数据恢复到初始状态" placement="right" :disabled="!permissionStore.collapsed">
                <button class="reset-btn" @click="resetDemo">
                    <el-icon><RefreshLeft /></el-icon>
                    <span v-show="!permissionStore.collapsed">重置演示数据</span>
                </button>
            </el-tooltip>
        </div>
    </aside>
</template>

<script setup lang="ts" name="LayoutAside">
    import { computed } from 'vue'
    import { useRoute } from 'vue-router'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { usePermissionStore } from '@/stores/permissionStore.ts'
    import { resetAdminDb } from '@/mock'

    const route = useRoute();
    const permissionStore = usePermissionStore();

    // 编辑/详情页高亮对应的列表菜单（路由 meta.active）
    const activeMenu = computed(() => (route.meta.active as string) || route.path);

    /** 一键把演示数据还原（管理端写操作会真的改数据，方便演示时回到初始状态） */
    async function resetDemo() {
        try {
            await ElMessageBox.confirm('会把商品上下架、改价、库存调整、退款审核等演示数据全部还原，确定继续吗？', '重置演示数据', {
                type: 'warning',
                confirmButtonText: '重置',
                cancelButtonText: '取消',
            });
        } catch {
            return;
        }
        resetAdminDb();
        ElMessage.success('演示数据已还原，页面刷新后生效');
        setTimeout(() => window.location.reload(), 600);
    }
</script>

<style scoped lang="scss">
    .admin-aside {
        display: flex;
        flex-direction: column;
        width: 224px;
        flex-shrink: 0;
        background: linear-gradient(180deg, #232838 0%, #2b3044 55%, #232838 100%);
        transition: width 0.25s ease;
        overflow: hidden;

        &.collapsed {
            width: 68px;
        }
    }
    .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 64px;
        padding: 0 16px;
        flex-shrink: 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);

        .badge {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            flex-shrink: 0;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 700;
            color: #fff;
            background: $brandGradient;
            box-shadow: 0 6px 14px rgba(239, 95, 42, 0.35);
        }
        .txt {
            min-width: 0;

            .name {
                font-size: 16px;
                font-weight: 500;
                color: #fff;
                letter-spacing: 1px;
                white-space: nowrap;
            }
            .sub {
                font-size: 11px;
                color: #8b90a2;
                white-space: nowrap;
            }
        }
    }
    .menu-wrap {
        flex: 1;
        padding: 10px 0;
    }
    .admin-menu {
        border-right: none;
        background: transparent;

        :deep(.el-menu-item),
        :deep(.el-sub-menu__title) {
            height: 44px;
            line-height: 44px;
            margin: 3px 10px;
            border-radius: 10px;
            color: #b6bac9;
            transition: all 0.2s ease;

            .el-icon {
                color: inherit;
            }
            &:hover {
                background: rgba(255, 255, 255, 0.08);
                color: #fff;
            }
        }
        :deep(.el-menu-item.is-active) {
            color: #fff;
            background: $brandGradient;
            box-shadow: 0 6px 14px rgba(239, 95, 42, 0.35);
        }
        :deep(.el-menu) {
            background: transparent;

            .el-menu-item {
                margin-left: 22px;
                padding-left: 12px !important;
            }
        }
    }
    .aside-footer {
        flex-shrink: 0;
        padding: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);

        .reset-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            width: 100%;
            height: 38px;
            border: 1px dashed rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            background: transparent;
            color: #8b90a2;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.25s ease;
            white-space: nowrap;

            &:hover {
                color: #fff;
                border-color: rgba(255, 255, 255, 0.45);
            }
        }
    }
</style>
