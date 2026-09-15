<template>
    <div class="page stock-list">
        <!-- 查询区 -->
        <div class="query-card">
            <el-form :inline="true" :model="query" @submit.prevent>
                <el-form-item label="关键词">
                    <el-input
                        v-model="query.keyword"
                        placeholder="商品名称 / SKU 编号 / 规格"
                        clearable
                        style="width: 240px"
                        @keyup.enter="search()"
                        @clear="search()"
                    />
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-select v-model="query.catName" placeholder="全部分类" clearable style="width: 160px" @change="search()">
                        <el-option v-for="item in catNames" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="库存预警">
                    <el-switch v-model="onlyWarn" @change="search()" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()"><el-icon><Search /></el-icon>查询</el-button>
                    <el-button @click="reset"><el-icon><Refresh /></el-icon>重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 统计 -->
        <div class="stock-summary">
            <div class="item es-card">
                <p class="label">SKU 总数</p>
                <p class="value">{{ total }}</p>
            </div>
            <div class="item es-card">
                <p class="label">可用库存合计</p>
                <p class="value">{{ totalAvailable }}</p>
            </div>
            <div class="item es-card">
                <p class="label">锁定库存合计</p>
                <p class="value">{{ totalLocked }}</p>
            </div>
            <div class="item es-card danger">
                <p class="label">库存预警 SKU</p>
                <p class="value">{{ warnCount }}</p>
            </div>
        </div>

        <!-- 表格 -->
        <div class="table-card">
            <div class="toolbar">
                <div class="toolbar-left">
                    库存明细
                    <span class="count">数据来自商品 SKU，调整后立即写入库存流水</span>
                </div>
            </div>

            <el-table :data="list" v-loading="loading">
                <el-table-column label="商品 / 规格" min-width="300">
                    <template #default="{ row }">
                        <div class="goods-cell">
                            <img :src="row.picture">
                            <div>
                                <p class="name ellipsis">{{ row.goodsName }}</p>
                                <p class="spec ellipsis">{{ row.attrsText }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="skuId" label="SKU 编号" width="160" />
                <el-table-column prop="catName" label="分类" width="90" />
                <el-table-column prop="brandName" label="品牌" width="110" />
                <el-table-column prop="total" label="总库存" width="90" />
                <el-table-column prop="locked" label="锁定" width="80" />
                <el-table-column label="可用库存" width="120">
                    <template #default="{ row }">
                        <span class="available" :class="{ warn: row.available <= row.warn }">{{ row.available }}</span>
                        <el-tag v-if="row.available <= row.warn" type="danger" size="small" effect="light" round>预警</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="110" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" v-permission="'stock:update'" @click="openAdjust(row)">调整</el-button>
                        <el-button link type="primary" v-permission="'stock:flow'" @click="router.push('/stock/flow')">流水</el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有找到符合条件的库存记录" />
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

        <!-- 调整库存弹窗 -->
        <el-dialog v-model="dialogVisible" title="调整库存" width="460" :close-on-click-modal="false">
            <div class="adjust-goods" v-if="current">
                <img :src="current.picture">
                <div>
                    <p class="name ellipsis">{{ current.goodsName }}</p>
                    <p class="spec ellipsis">{{ current.attrsText }}</p>
                    <p class="sku">SKU：{{ current.skuId }}</p>
                </div>
            </div>
            <el-form :model="adjustForm" label-width="80px">
                <el-form-item label="调整方式">
                    <el-radio-group v-model="adjustForm.action">
                        <el-radio-button value="increase">入库</el-radio-button>
                        <el-radio-button value="decrease">出库</el-radio-button>
                        <el-radio-button value="set">校准为</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="调整数量">
                    <el-input-number v-model="adjustForm.quantity" :min="0" :max="99999" :step="10" controls-position="right" style="width: 180px" />
                    <span class="tip">当前可用库存：{{ current?.available }}</span>
                </el-form-item>
                <el-form-item label="调整结果">
                    <span class="result">{{ previewText }}</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="saving" v-permission="'stock:update'" @click="save">确定调整</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="StockList">
    import { computed, onMounted, reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessage } from 'element-plus'
    import { getStockListAPI, updateStockAPI } from '@/apis/goods.ts'

    const router = useRouter();
    const loading = ref(false);
    const saving = ref(false);
    const list = ref<any[]>([]);
    const total = ref(0);
    const totalAvailable = ref(0);
    const totalLocked = ref(0);
    const warnCount = ref(0);
    const catNames = ref<string[]>([]);
    const dialogVisible = ref(false);
    const current = ref<any>(null);
    const onlyWarn = ref(false);

    const query = reactive({
        page: 1,
        pageSize: 10,
        keyword: '',
        catName: '',
        onlyWarn: 0,
    });

    const adjustForm = reactive({ action: 'increase' as 'increase' | 'decrease' | 'set', quantity: 100 });

    const previewText = computed(() => {
        if (!current.value) return '';
        const base = current.value.available;
        if (adjustForm.action === 'increase') return `${base} → ${base + adjustForm.quantity}`;
        if (adjustForm.action === 'decrease') return `${base} → ${Math.max(0, base - adjustForm.quantity)}`;
        return `${base} → ${adjustForm.quantity}`;
    });

    async function getList() {
        loading.value = true;
        try {
            const result = await getStockListAPI({ ...query, onlyWarn: onlyWarn.value ? 1 : 0 }) as any;
            list.value = result.result.items;
            total.value = result.result.counts;
            // 接口附带全量汇总，不随分页变化
            totalAvailable.value = result.result.summary.totalAvailable;
            totalLocked.value = result.result.summary.totalLocked;
            warnCount.value = result.result.summary.warnCount;
            catNames.value = result.result.summary.catNames;
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
        query.catName = '';
        onlyWarn.value = false;
        search();
    }

    function openAdjust(row: any) {
        current.value = row;
        adjustForm.action = 'increase';
        adjustForm.quantity = 100;
        dialogVisible.value = true;
    }

    async function save() {
        if (!current.value) return;
        saving.value = true;
        try {
            await updateStockAPI(current.value.skuId, { action: adjustForm.action, quantity: adjustForm.quantity });
            ElMessage.success('库存已调整，流水已记录');
            dialogVisible.value = false;
            await getList();
        } finally {
            saving.value = false;
        }
    }

    onMounted(() => {
        getList();
    });
</script>

<style scoped lang="scss">
    .stock-summary {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
        margin-bottom: 14px;

        .item {
            padding: 16px 20px;

            .label {
                font-size: 13px;
                color: $inkColor3;
            }
            .value {
                margin-top: 6px;
                font-size: 24px;
                font-weight: 600;
                color: $inkColor;
            }
            &.danger .value {
                color: $helpColor;
            }
        }
    }
    .goods-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
            width: 46px;
            height: 46px;
            border-radius: 8px;
            object-fit: cover;
            background: #f5f6f8;
            flex-shrink: 0;
        }
        .name { font-size: 13px; color: $inkColor; }
        .spec { margin-top: 2px; font-size: 12px; color: $inkColor3; }
    }
    .available {
        font-size: 15px;
        font-weight: 600;
        color: $inkColor;
        margin-right: 6px;

        &.warn { color: $helpColor; }
    }
    .adjust-goods {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        margin-bottom: 16px;
        border-radius: 10px;
        background: #f7f8fa;

        img {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            object-fit: cover;
            background: #fff;
        }
        .name { font-size: 14px; color: $inkColor; }
        .spec { margin-top: 2px; font-size: 12px; color: $inkColor3; }
        .sku { margin-top: 2px; font-size: 12px; color: $inkColor3; }
    }
    .tip {
        margin-left: 10px;
        font-size: 12px;
        color: $inkColor3;
    }
    .result {
        font-size: 15px;
        font-weight: 600;
        color: $brandColor;
    }
</style>
