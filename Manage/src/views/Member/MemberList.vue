<template>
    <div class="page member-list">
        <!-- 查询区 -->
        <div class="query-card">
            <el-form :inline="true" :model="query" @submit.prevent>
                <el-form-item label="关键词">
                    <el-input
                        v-model="query.keyword"
                        placeholder="昵称 / 账号 / 手机号"
                        clearable
                        style="width: 240px"
                        @keyup.enter="search()"
                        @clear="search()"
                    />
                </el-form-item>
                <el-form-item label="会员等级">
                    <el-select v-model="query.level" placeholder="全部等级" clearable style="width: 150px" @change="search()">
                        <el-option v-for="item in LEVELS" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="账号状态">
                    <el-select v-model="query.status" placeholder="全部状态" clearable style="width: 140px" @change="search()">
                        <el-option label="正常" :value="1" />
                        <el-option label="已禁用" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()"><el-icon><Search /></el-icon>查询</el-button>
                    <el-button @click="reset"><el-icon><Refresh /></el-icon>重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 表格 -->
        <div class="table-card">
            <div class="toolbar">
                <div class="toolbar-left">
                    会员列表
                    <span class="count">共 {{ total }} 位会员 · 禁用后会员无法登录用户端</span>
                </div>
            </div>

            <el-table :data="list" v-loading="loading">
                <el-table-column label="会员" min-width="200">
                    <template #default="{ row }">
                        <div class="member-cell">
                            <img :src="row.avatar">
                            <div>
                                <p class="name">{{ row.nickname }}</p>
                                <p class="account">{{ row.account }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" width="130" />
                <el-table-column label="性别" width="70">
                    <template #default="{ row }">
                        {{ (GENDER_TEXT as Record<number, string>)[row.gender] ?? '未知' }}
                    </template>
                </el-table-column>
                <el-table-column label="等级" width="110">
                    <template #default="{ row }">
                        <el-tag :type="row.level >= 3 ? 'primary' : 'info'" effect="light" round>
                            {{ LEVELS[row.level - 1]?.label }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="points" label="积分" width="90" />
                <el-table-column label="余额" width="100">
                    <template #default="{ row }">¥{{ row.balance.toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="orderCount" label="订单数" width="90" />
                <el-table-column label="累计消费" width="120">
                    <template #default="{ row }">
                        <span class="amount">¥{{ row.totalAmount.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="registeredAt" label="注册时间" width="170" />
                <el-table-column label="状态" width="100">
                    <template #default="{ row }">
                        <el-switch
                            :model-value="row.status === 1"
                            :disabled="!hasPermission('member:update')"
                            @change="toggle(row)"
                        />
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有找到符合条件的会员" />
                </template>
            </el-table>

            <div class="pager">
                <el-pagination
                    background
                    layout="total, prev, pager, next, sizes"
                    :total="total"
                    :current-page="query.page"
                    :page-size="query.pageSize"
                    :page-sizes="[10, 20, 50]"
                    @current-change="(page: number) => { query.page = page; getList(); }"
                    @size-change="(size: number) => { query.pageSize = size; query.page = 1; getList(); }"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="MemberList">
    import { onMounted, reactive, ref } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { getMemberListAPI, toggleMemberStatusAPI } from '@/apis/admin.ts'
    import { useUserStore } from '@/stores/userStore.ts'

    const GENDER_TEXT = { 1: '男', 2: '女' };

    const LEVELS = [
        { value: 1, label: '普通会员' },
        { value: 2, label: '白银会员' },
        { value: 3, label: '黄金会员' },
        { value: 4, label: '钻石会员' },
    ];

    const userStore = useUserStore();
    const loading = ref(false);
    const list = ref<any[]>([]);
    const total = ref(0);

    const query = reactive({ page: 1, pageSize: 10, keyword: '', level: undefined as number | undefined, status: undefined as number | undefined });

    function hasPermission(code: string) {
        return userStore.hasPermission(code);
    }

    async function getList() {
        loading.value = true;
        try {
            const result = await getMemberListAPI({ ...query }) as any;
            list.value = result.result.items;
            total.value = result.result.counts;
        } finally {
            loading.value = false;
        }
    }

    function search() {
        query.page = 1;
        getList();
    }

    function reset() {
        query.keyword = '';
        query.level = undefined;
        query.status = undefined;
        search();
    }

    async function toggle(row: any) {
        try {
            await ElMessageBox.confirm(
                `确定要${row.status === 1 ? '禁用' : '启用'}会员「${row.nickname}」吗？`,
                '会员状态',
                { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' },
            );
        } catch {
            return;
        }
        await toggleMemberStatusAPI(row.id);
        ElMessage.success(row.status === 1 ? '已禁用' : '已启用');
        getList();
    }

    onMounted(() => {
        getList();
    });
</script>

<style scoped lang="scss">
    .member-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            object-fit: cover;
            background: #f5f6f8;
            flex-shrink: 0;
        }
        .name {
            font-size: 14px;
            color: $inkColor;
        }
        .account {
            margin-top: 2px;
            font-size: 12px;
            color: $inkColor3;
        }
    }
    .amount {
        font-size: 14px;
        font-weight: 600;
        color: $priceColor;
    }
</style>
