<template>
    <header class="admin-header">
        <!-- 左侧：折叠 + 面包屑 -->
        <div class="left">
            <button class="collapse-btn" @click="permissionStore.toggleCollapsed()">
                <el-icon :size="18">
                    <Expand v-if="permissionStore.collapsed" />
                    <Fold v-else />
                </el-icon>
            </button>
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-if="parentTitle && parentTitle !== currentTitle">{{ parentTitle }}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 右侧：角色 + 管理员 -->
        <div class="right">
            <el-tooltip content="切换角色后重新登录即可体验不同权限" placement="bottom">
                <span class="role-tag">
                    <el-icon><Avatar /></el-icon>
                    {{ userStore.adminInfo.roleName }}
                </span>
            </el-tooltip>
            <el-dropdown trigger="click" @command="onCommand">
                <div class="user">
                    <span class="avatar">{{ userStore.adminInfo.realName.slice(0, 1) }}</span>
                    <span class="name">{{ userStore.adminInfo.realName }}</span>
                    <el-icon class="arrow"><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="profile" disabled>
                            <el-icon><User /></el-icon>账号：{{ userStore.adminInfo.username }}
                        </el-dropdown-item>
                        <el-dropdown-item command="logout" divided>
                            <el-icon><SwitchButton /></el-icon>退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </header>
</template>

<script setup lang="ts" name="LayoutHeader">
    import { computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { ArrowRight } from '@element-plus/icons-vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { useUserStore } from '@/stores/userStore.ts'
    import { usePermissionStore } from '@/stores/permissionStore.ts'

    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();

    const currentTitle = computed(() => (route.meta.title as string) || '');
    // 一级菜单标题（编辑/详情页也能带上分组名）
    const parentTitle = computed(() => {
        const find = (menus: any[]): string => {
            for (const item of menus) {
                if (item.path === route.path) return item.title;
                if (item.children) {
                    const child = item.children.find((sub: any) => sub.path === (route.meta.active || route.path));
                    if (child) return item.title;
                    const deep = find(item.children);
                    if (deep) return deep;
                }
            }
            return '';
        };
        return find(permissionStore.menus);
    });

    async function onCommand(command: string) {
        if (command === 'logout') {
            try {
                await ElMessageBox.confirm('确定要退出登录吗？', '退出登录', {
                    type: 'warning',
                    confirmButtonText: '退出',
                    cancelButtonText: '取消',
                });
            } catch {
                return;
            }
            userStore.logout();
            ElMessage.success('已退出登录');
            router.replace('/login');
        }
    }
</script>

<style scoped lang="scss">
    .admin-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 0 18px;
        flex-shrink: 0;
        background-color: #fff;
        border-bottom: 1px solid $lineColor;
    }
    .left {
        display: flex;
        align-items: center;
        gap: 14px;

        .collapse-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border: none;
            border-radius: 10px;
            background: #f5f6f8;
            color: $inkColor2;
            cursor: pointer;
            transition: all 0.25s ease;

            &:hover {
                color: $brandColor;
                background: $brandColorSoft;
            }
        }
    }
    .right {
        display: flex;
        align-items: center;
        gap: 16px;

        .role-tag {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            height: 30px;
            padding: 0 12px;
            border-radius: 15px;
            font-size: 13px;
            color: $brandColor;
            background: $brandColorSoft;
        }
        .user {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 10px 4px 4px;
            border-radius: 20px;
            cursor: pointer;
            transition: background 0.25s ease;

            .avatar {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                font-size: 14px;
                color: #fff;
                background: $brandGradient;
            }
            .name {
                font-size: 14px;
                color: $inkColor;
            }
            .arrow {
                font-size: 12px;
                color: $inkColor3;
            }
            &:hover {
                background: #f5f6f8;
            }
        }
    }
</style>
