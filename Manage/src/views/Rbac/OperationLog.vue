<template>
    <div class="page operation-log">
        <!-- 查询区 -->
        <div class="query-card">
            <el-form :inline="true" :model="query" @submit.prevent>
                <el-form-item label="关键词">
                    <el-input
                        v-model="query.keyword"
                        placeholder="操作人 / 操作内容"
                        clearable
                        style="width: 240px"
                        @keyup.enter="search()"
                        @clear="search()"
                    />
                </el-form-item>
                <el-form-item label="所属模块">
                    <el-select v-model="query.module" placeholder="全部模块" clearable style="width: 160px" @change="search()">
                        <el-option v-for="item in MODULES" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="结果">
                    <el-select v-model="query.result" placeholder="全部结果" clearable style="width: 130px" @change="search()">
                        <el-option label="成功" value="成功" />
                        <el-option label="失败" value="失败" />
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
                    操作日志
                    <span class="count">共 {{ total }} 条 · 管理端所有写操作都会自动留痕</span>
                </div>
            </div>

            <el-table :data="list" v-loading="loading">
                <el-table-column prop="time" label="时间" width="170" />
                <el-table-column label="操作人" width="150">
                    <template #default="{ row }">
                        <p class="real">{{ row.realName }}</p>
                        <p class="account">{{ row.username }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="module" label="所属模块" width="110">
                    <template #default="{ row }">
                        <el-tag effect="plain" round size="small">{{ row.module }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="action" label="操作" width="130" />
                <el-table-column prop="detail" label="操作内容" min-width="300" show-overflow-tooltip />
                <el-table-column prop="ip" label="IP 地址" width="140" />
                <el-table-column label="结果" width="90">
                    <template #default="{ row }">
                        <el-tag :type="row.result === '成功' ? 'success' : 'danger'" effect="light" round>
                            {{ row.result }}
                        </el-tag>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="暂无操作日志" />
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

<script setup lang="ts" name="OperationLog">
    import { onMounted, reactive, ref } from 'vue'
    import { getLogListAPI } from '@/apis/admin.ts'

    const MODULES = ['登录', '商品管理', '库存管理', '订单中心', '退款管理', '内容运营', '会员中心', '权限中心'];

    const loading = ref(false);
    const list = ref<any[]>([]);
    const total = ref(0);

    const query = reactive({ page: 1, pageSize: 10, keyword: '', module: '', result: '' });

    async function getList() {
        loading.value = true;
        try {
            const result = await getLogListAPI({ ...query }) as any;
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
        query.module = '';
        query.result = '';
        search();
    }

    onMounted(() => {
        getList();
    });
</script>

<style scoped lang="scss">
    .real {
        font-size: 13px;
        color: $inkColor;
    }
    .account {
        margin-top: 2px;
        font-size: 12px;
        color: $inkColor3;
    }
</style>
