<template>
    <div class="page refund-list">
        <!-- 查询区 -->
        <div class="query-card">
            <el-form :inline="true" :model="query" @submit.prevent>
                <el-form-item label="关键词">
                    <el-input
                        v-model="query.keyword"
                        placeholder="订单号 / 会员 / 商品名"
                        clearable
                        style="width: 260px"
                        @keyup.enter="search()"
                        @clear="search()"
                    />
                </el-form-item>
                <el-form-item label="处理状态">
                    <el-select v-model="query.status" placeholder="全部状态" clearable style="width: 160px" @change="search()">
                        <el-option label="待审核" :value="0" />
                        <el-option label="已退款" :value="1" />
                        <el-option label="已拒绝" :value="2" />
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
                    退款管理
                    <span class="count">共 {{ total }} 笔 · 待审核 {{ pendingCount }} 笔</span>
                </div>
            </div>

            <el-table :data="list" v-loading="loading">
                <el-table-column prop="id" label="退款单号" width="130" />
                <el-table-column label="退款商品" min-width="260">
                    <template #default="{ row }">
                        <div class="goods-cell">
                            <img :src="row.image">
                            <div>
                                <p class="name ellipsis">{{ row.goodsName }}</p>
                                <p class="sub">订单 {{ row.orderId }} · × {{ row.quantity }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="memberName" label="申请会员" width="110" />
                <el-table-column label="退款金额" width="110">
                    <template #default="{ row }">
                        <span class="money">¥{{ row.amount.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="reason" label="退款原因" min-width="180" show-overflow-tooltip />
                <el-table-column prop="applyTime" label="申请时间" width="170" />
                <el-table-column label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="statusTag(row.status)" effect="light" round>{{ statusText(row.status) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                        <template v-if="row.status === 0">
                            <el-button link type="primary" v-permission="'refund:audit'" @click="openAudit(row)">审核</el-button>
                        </template>
                        <el-button
                            link
                            type="primary"
                            v-permission="'refund:final'"
                            v-else-if="row.status === 1 && !row.remark.includes('原路')"
                            @click="pay(row)"
                        >打款</el-button>
                        <el-tooltip v-else :content="row.remark || '—'" placement="top">
                            <span class="done-text">已处理</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="暂无退款申请" />
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

        <!-- 审核弹窗 -->
        <el-dialog v-model="auditVisible" title="退款审核" width="480" :close-on-click-modal="false">
            <div class="audit-goods" v-if="current">
                <img :src="current.image">
                <div>
                    <p class="name ellipsis">{{ current.goodsName }}</p>
                    <p class="sub">退款单 {{ current.id }} · 退款金额 ¥{{ current.amount.toFixed(2) }}</p>
                    <p class="sub">原因：{{ current.reason }}</p>
                </div>
            </div>
            <el-form label-width="80px">
                <el-form-item label="审核结果">
                    <el-radio-group v-model="auditForm.approve">
                        <el-radio-button :value="true">通过退款</el-radio-button>
                        <el-radio-button :value="false">拒绝退款</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审核备注">
                    <el-input
                        v-model="auditForm.remark"
                        type="textarea"
                        :rows="3"
                        maxlength="100"
                        show-word-limit
                        :placeholder="auditForm.approve ? '选填，默认「审核通过，待打款」' : '必填，请说明拒绝原因'"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="auditVisible = false">取消</el-button>
                <el-button type="primary" :loading="saving" v-permission="'refund:audit'" @click="saveAudit">提交审核</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="RefundList">
    import { computed, onMounted, reactive, ref } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { auditRefundAPI, getRefundListAPI, payRefundAPI } from '@/apis/order.ts'

    const loading = ref(false);
    const saving = ref(false);
    const list = ref<any[]>([]);
    const total = ref(0);
    const auditVisible = ref(false);
    const current = ref<any>(null);
    const auditForm = reactive({ approve: true, remark: '' });

    const query = reactive({ page: 1, pageSize: 10, keyword: '', status: undefined as number | undefined });

    const pendingCount = computed(() => list.value.filter((item) => item.status === 0).length);

    function statusText(status: number) {
        return ({ 0: '待审核', 1: '已退款', 2: '已拒绝' })[status] ?? '未知';
    }

    function statusTag(status: number) {
        return ({ 0: 'warning', 1: 'success', 2: 'info' })[status] ?? 'info';
    }

    async function getList() {
        loading.value = true;
        try {
            const result = await getRefundListAPI({ ...query }) as any;
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
        query.status = undefined;
        search();
    }

    function openAudit(row: any) {
        current.value = row;
        auditForm.approve = true;
        auditForm.remark = '';
        auditVisible.value = true;
    }

    async function saveAudit() {
        if (!auditForm.approve && !auditForm.remark.trim()) {
            ElMessage.warning('拒绝退款时请填写原因');
            return;
        }
        saving.value = true;
        try {
            await auditRefundAPI(current.value.id, { approve: auditForm.approve, remark: auditForm.remark.trim() });
            ElMessage.success(auditForm.approve ? '审核通过，可进行打款' : '已拒绝该退款申请');
            auditVisible.value = false;
            getList();
        } finally {
            saving.value = false;
        }
    }

    async function pay(row: any) {
        try {
            await ElMessageBox.confirm(`确认向会员 ${row.memberName} 打款 ¥${row.amount.toFixed(2)} 吗？`, '退款打款', {
                type: 'warning',
                confirmButtonText: '确认打款',
                cancelButtonText: '取消',
            });
        } catch {
            return;
        }
        await payRefundAPI(row.id);
        ElMessage.success('打款成功，款项已原路退回');
        getList();
    }

    onMounted(() => {
        getList();
    });
</script>

<style scoped lang="scss">
    .goods-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            object-fit: cover;
            background: #f5f6f8;
            flex-shrink: 0;
        }
        .name { font-size: 13px; color: $inkColor; }
        .sub { margin-top: 2px; font-size: 12px; color: $inkColor3; }
    }
    .money {
        font-size: 15px;
        font-weight: 600;
        color: $priceColor;
    }
    .done-text {
        font-size: 13px;
        color: $inkColor3;
        cursor: help;
    }
    .audit-goods {
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
        .sub { margin-top: 2px; font-size: 12px; color: $inkColor3; }
    }
</style>
