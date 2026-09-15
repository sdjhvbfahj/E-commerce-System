<template>
    <div class="page order-list">
        <!-- 状态页签 + 查询 -->
        <div class="table-card">
            <el-tabs v-model="query.state" class="state-tabs" @tab-change="search()">
                <el-tab-pane label="全部订单" name="-1" />
                <el-tab-pane v-for="item in ORDER_STATE_OPTIONS" :key="item.value" :label="item.label" :name="String(item.value)" />
            </el-tabs>

            <el-form :inline="true" :model="query" @submit.prevent class="query-form">
                <el-form-item label="关键词">
                    <el-input
                        v-model="query.keyword"
                        placeholder="订单号 / 收货人 / 商品名"
                        clearable
                        style="width: 260px"
                        @keyup.enter="search()"
                        @clear="search()"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()"><el-icon><Search /></el-icon>查询</el-button>
                    <el-button @click="reset"><el-icon><Refresh /></el-icon>重置</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="list" v-loading="loading">
                <el-table-column prop="id" label="订单号" width="190">
                    <template #default="{ row }">
                        <RouterLink class="order-no" :to="`/order/detail/${row.id}`">{{ row.id }}</RouterLink>
                    </template>
                </el-table-column>
                <el-table-column label="商品" min-width="280">
                    <template #default="{ row }">
                        <div class="goods-cell" v-for="sku in row.skus.slice(0, 2)" :key="sku.id">
                            <img :src="sku.image">
                            <div class="goods-info">
                                <p class="name ellipsis">{{ sku.name }}</p>
                                <p class="spec ellipsis">{{ sku.attrsText }} × {{ sku.quantity }}</p>
                            </div>
                        </div>
                        <p class="more-goods" v-if="row.skus.length > 2">等 {{ row.skus.length }} 件商品</p>
                    </template>
                </el-table-column>
                <el-table-column label="收货人" width="140">
                    <template #default="{ row }">
                        <p class="receiver">{{ row.receiverContact }}</p>
                        <p class="mobile">{{ row.receiverMobile }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="实付金额" width="110">
                    <template #default="{ row }">
                        <span class="money">¥{{ row.payMoney.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="ORDER_STATE_TAG[row.orderState]" effect="light" round>
                            {{ ORDER_STATE_TEXT[row.orderState] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="下单时间" width="170" />
                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" v-permission="'order:detail'" @click="router.push(`/order/detail/${row.id}`)">详情</el-button>
                        <el-button
                            link
                            type="primary"
                            v-permission="'order:ship'"
                            v-if="row.orderState === 2"
                            @click="openShip(row)"
                        >发货</el-button>
                        <el-button
                            link
                            type="danger"
                            v-permission="'order:cancel'"
                            v-if="row.orderState === 1 || row.orderState === 2"
                            @click="cancel(row)"
                        >取消</el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有找到符合条件的订单" />
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

        <!-- 发货弹窗 -->
        <el-dialog v-model="shipVisible" title="订单发货" width="460" :close-on-click-modal="false">
            <el-form :model="shipForm" label-width="80px">
                <el-form-item label="物流公司" required>
                    <el-select v-model="shipForm.company" placeholder="请选择物流公司" style="width: 100%">
                        <el-option v-for="item in EXPRESS_COMPANIES" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="运单号" required>
                    <el-input v-model="shipForm.trackingNo" placeholder="请输入运单号（至少 6 位）" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="shipVisible = false">取消</el-button>
                <el-button type="primary" :loading="saving" @click="saveShip">确认发货</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="OrderList">
    import { onMounted, reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { cancelOrderAPI, getAdminOrderListAPI, shipOrderAPI } from '@/apis/order.ts'
    import { EXPRESS_COMPANIES, ORDER_STATE_OPTIONS, ORDER_STATE_TAG, ORDER_STATE_TEXT } from '@/utils/order.ts'

    const router = useRouter();
    const loading = ref(false);
    const saving = ref(false);
    const list = ref<any[]>([]);
    const total = ref(0);
    const shipVisible = ref(false);
    const shipForm = reactive({ id: '', company: '顺丰速运', trackingNo: '' });

    const query = reactive({
        page: 1,
        pageSize: 10,
        keyword: '',
        state: '-1',
    });

    async function getList() {
        loading.value = true;
        try {
            const state = Number(query.state);
            const result = await getAdminOrderListAPI({ ...query, state: state >= 0 ? state : -1 }) as any;
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
        query.state = '-1';
        search();
    }

    function openShip(row: any) {
        shipForm.id = row.id;
        shipForm.company = '顺丰速运';
        shipForm.trackingNo = '';
        shipVisible.value = true;
    }

    async function saveShip() {
        if (shipForm.trackingNo.trim().length < 6) {
            ElMessage.warning('请输入正确的运单号');
            return;
        }
        saving.value = true;
        try {
            await shipOrderAPI(shipForm.id, { company: shipForm.company, trackingNo: shipForm.trackingNo.trim() });
            ElMessage.success('发货成功，用户端订单状态已更新');
            shipVisible.value = false;
            getList();
        } finally {
            saving.value = false;
        }
    }

    async function cancel(row: any) {
        try {
            await ElMessageBox.confirm(`确定取消订单 ${row.id} 吗？取消后不可恢复。`, '取消订单', {
                type: 'warning',
                confirmButtonText: '确定取消',
                cancelButtonText: '再想想',
            });
        } catch {
            return;
        }
        await cancelOrderAPI(row.id);
        ElMessage.success('订单已取消');
        getList();
    }

    onMounted(() => {
        getList();
    });
</script>

<style scoped lang="scss">
    .state-tabs {
        margin-bottom: 6px;

        :deep(.el-tabs__item) {
            font-size: 15px;
            color: $inkColor2;

            &.is-active {
                color: $brandColor;
                font-weight: 500;
            }
        }
        :deep(.el-tabs__active-bar) {
            height: 3px;
            border-radius: 2px;
            background: $brandGradient;
        }
    }
    .query-form {
        padding-top: 4px;
    }
    .order-no {
        font-family: Consolas, Monaco, monospace;
        font-size: 13px;
        color: $brandColor;

        &:hover { text-decoration: underline; }
    }
    .goods-cell {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 6px;

        &:last-of-type { margin-bottom: 0; }
        img {
            width: 44px;
            height: 44px;
            border-radius: 8px;
            object-fit: cover;
            background: #f5f6f8;
            flex-shrink: 0;
        }
        .name { font-size: 13px; color: $inkColor; }
        .spec { margin-top: 2px; font-size: 12px; color: $inkColor3; }
    }
    .more-goods {
        margin-top: 4px;
        font-size: 12px;
        color: $inkColor3;
    }
    .receiver {
        font-size: 13px;
        color: $inkColor;
    }
    .mobile {
        margin-top: 3px;
        font-size: 12px;
        color: $inkColor3;
    }
    .money {
        font-size: 15px;
        font-weight: 600;
        color: $priceColor;
    }
</style>
