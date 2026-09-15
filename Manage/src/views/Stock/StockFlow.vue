<template>
    <div class="page stock-flow">
        <!-- 查询区 -->
        <div class="query-card">
            <el-form :inline="true" :model="query" @submit.prevent>
                <el-form-item label="关键词">
                    <el-input
                        v-model="query.keyword"
                        placeholder="商品名称 / SKU 编号"
                        clearable
                        style="width: 240px"
                        @keyup.enter="search()"
                        @clear="search()"
                    />
                </el-form-item>
                <el-form-item label="流水类型">
                    <el-select v-model="query.type" placeholder="全部类型" clearable style="width: 150px" @change="search()">
                        <el-option v-for="item in flowTypes" :key="item" :label="item" :value="item" />
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
                    库存流水
                    <span class="count">共 {{ total }} 条 · 每一次库存变动都会留痕，可在「库存管理」里发起调整</span>
                </div>
                <div class="toolbar-right">
                    <el-button v-permission="'stock:list'" @click="router.push('/stock/index')"><el-icon><Box /></el-icon>去调整库存</el-button>
                </div>
            </div>

            <el-table :data="list" v-loading="loading">
                <el-table-column prop="time" label="时间" width="170" />
                <el-table-column label="商品 / 规格" min-width="280">
                    <template #default="{ row }">
                        <div class="goods-cell">
                            <div>
                                <p class="name ellipsis">{{ row.goodsName }}</p>
                                <p class="spec ellipsis">{{ row.attrsText }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="类型" width="90">
                    <template #default="{ row }">
                        <el-tag :type="typeTag(row.type)" effect="light" round>{{ row.type }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="数量" width="90">
                    <template #default="{ row }">
                        <span class="qty" :class="{ up: row.type === '入库', down: row.type === '出库' }">
                            {{ row.type === '入库' ? '+' : row.type === '出库' ? '-' : '' }}{{ row.quantity }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="变动" width="130">
                    <template #default="{ row }">
                        <span class="change">{{ row.before }} → {{ row.after }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作人" width="100" />
                <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
                <template #empty>
                    <el-empty description="暂无库存流水" />
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

<script setup lang="ts" name="StockFlow">
    import { onMounted, reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { getStockFlowAPI } from '@/apis/goods.ts'

    const router = useRouter();
    const loading = ref(false);
    const list = ref<any[]>([]);
    const total = ref(0);
    const flowTypes = ['入库', '出库', '盘点', '锁定', '释放', '预警'];

    const query = reactive({ page: 1, pageSize: 10, keyword: '', type: '' });

    function typeTag(type: string) {
        const map: Record<string, string> = {
            '入库': 'success',
            '出库': 'warning',
            '盘点': 'info',
            '锁定': 'primary',
            '释放': 'info',
            '预警': 'danger',
        };
        return map[type] ?? 'info';
    }

    async function getList() {
        loading.value = true;
        try {
            const result = await getStockFlowAPI({ ...query }) as any;
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
        query.type = '';
        search();
    }

    onMounted(() => {
        getList();
    });
</script>

<style scoped lang="scss">
    .goods-cell {
        .name { font-size: 13px; color: $inkColor; }
        .spec { margin-top: 2px; font-size: 12px; color: $inkColor3; }
    }
    .qty {
        font-weight: 600;
        color: $inkColor2;

        &.up { color: $sucColor; }
        &.down { color: $helpColor; }
    }
    .change {
        font-family: Consolas, Monaco, monospace;
        font-size: 13px;
        color: $inkColor2;
    }
</style>
