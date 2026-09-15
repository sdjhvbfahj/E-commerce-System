<template>
    <div class="page forbidden">
        <div class="box es-card">
            <span class="icon"><el-icon :size="30"><Lock /></el-icon></span>
            <div class="info">
                <h2>没有访问权限</h2>
                <p>当前角色（{{ userStore.adminInfo.roleName }}）无权访问该页面，请联系超级管理员开通。</p>
                <div class="actions">
                    <el-button type="primary" @click="router.replace('/dashboard')">回数据概览</el-button>
                    <el-button @click="router.back()">返回上一页</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Forbidden">
    import { useRouter } from 'vue-router'
    import { useUserStore } from '@/stores/userStore.ts'

    const router = useRouter();
    const userStore = useUserStore();
</script>

<style scoped lang="scss">
    .forbidden {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 120px);
    }
    .box {
        display: flex;
        align-items: center;
        gap: 30px;
        padding: 50px 70px;

        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 70px;
            height: 70px;
            border-radius: 20px;
            color: $brandColor;
            background: $brandColorSoft;
        }
        h2 {
            font-size: 22px;
            font-weight: 600;
            color: $inkColor;
        }
        p {
            margin-top: 10px;
            font-size: 14px;
            color: $inkColor3;
        }
        .actions {
            margin-top: 26px;
            display: flex;
            gap: 10px;
        }
    }
</style>
