<template>
    <div class="page order-detail" v-loading="loading">
        <!-- 页头 -->
        <div class="page-head es-card">
            <div class="head-left">
                <el-button class="back" circle @click="router.back()"><el-icon><ArrowLeft /></el-icon></el-button>
                <div>
                    <div class="title-row">
                        <h2>订单详情</h2>
                        <el-tag v-if="order" :type="ORDER_STATE_TAG[order.orderState]" effect="light" round>
                            {{ ORDER_STATE_TEXT[order.orderState] }}
                        </el-tag>
                    </div>
                    <p class="sub">订单号：{{ order?.id }}　下单时间：{{ order?.createTime }}</p>
                </div>
            </div>
            <div class="head-right">
                <el-button v-if="order?.orderState === 2" v-permission="'order:ship'" type="primary" @click="shipVisible = true">
                    <el-icon><Van /></el-icon>订单发货
                </el-button>
                <el-button
                    v-if="order?.orderState === 1 || order?.orderState === 2"
                    v-permission="'order:cancel'"
                    @click="cancelOrder"
                >取消订单</el-button>
            </div>
        </div>

        <div class="detail-body">
            <!-- 订单进度 -->
            <div class="block es-card">
                <div class="card-head"><h3>订单进度</h3></div>
                <el-steps :active="activeStep" align-center finish-status="success">
                    <el-step title="提交订单" :description="order?.createTime" />
                    <el-step title="付款成功" :description="order?.payTime" />
                    <el-step title="商品发货" :description="order?.consignTime" />
                    <el-step title="确认收货" :description="order?.endTime" />
                    <el-step title="评价完成" :description="order?.evaluationTime" />
                </el-steps>
                <el-alert
                    v-if="order?.orderState === 6"
                    type="info"
                    :closable="false"
                    show-icon
                    :title="`该订单已于 ${order.closeTime} 取消`"
                />
            </div>

            <div class="info-row">
                <!-- 收货信息 -->
                <div class="block es-card">
                    <div class="card-head"><h3>收货信息</h3></div>
                    <ul class="info-list">
                        <li><span>收货人</span><b>{{ order?.receiverContact }}</b></li>
                        <li><span>联系电话</span><b>{{ order?.receiverMobile }}</b></li>
                        <li><span>收货地址</span><b>{{ order?.fullLocation }} {{ order?.receiverAddress }}</b></li>
                        <li v-if="order?.memberName"><span>下单会员</span><b>{{ order.memberName }}（{{ order.memberAccount }}）</b></li>
                        <li v-if="order?.deliveryTimeType"><span>配送时间</span><b>不限送货时间：周一至周日</b></li>
                    </ul>
                </div>
                <!-- 支付信息 -->
                <div class="block es-card">
                    <div class="card-head"><h3>支付信息</h3></div>
                    <ul class="info-list">
                        <li><span>支付方式</span><b>{{ PAY_TYPE_TEXT[order?.payType ?? 1] }}</b></li>
                        <li><span>商品总额</span><b>¥{{ order?.totalMoney.toFixed(2) }}</b></li>
                        <li><span>运费</span><b>¥{{ order?.postFee.toFixed(2) }}</b></li>
                        <li class="strong"><span>实付金额</span><b>¥{{ order?.payMoney.toFixed(2) }}</b></li>
                        <li v-if="order?.payTime"><span>付款时间</span><b>{{ order.payTime }}</b></li>
                    </ul>
                </div>
            </div>

            <!-- 商品清单 -->
            <div class="block es-card">
                <div class="card-head"><h3>商品清单</h3><span class="sub">共 {{ order?.totalNum }} 件商品</span></div>
                <el-table :data="order?.skus" size="default">
                    <el-table-column label="商品" min-width="320">
                        <template #default="{ row }">
                            <div class="goods-cell">
                                <img :src="row.image">
                                <div>
                                    <p class="name ellipsis">{{ row.name }}</p>
                                    <p class="spec">{{ row.attrsText }}</p>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="curPrice" label="单价" width="110">
                        <template #default="{ row }">¥{{ row.curPrice.toFixed(2) }}</template>
                    </el-table-column>
                    <el-table-column prop="quantity" label="数量" width="80" />
                    <el-table-column label="小计" width="110">
                        <template #default="{ row }">
                            <span class="money">¥{{ row.realPay.toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
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

<script setup lang="ts" name="OrderDetail">
    import { computed, onMounted, reactive, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { cancelOrderAPI, getAdminOrderDetailAPI, shipOrderAPI } from '@/apis/order.ts'
    import { EXPRESS_COMPANIES, ORDER_STATE_TAG, ORDER_STATE_TEXT, PAY_TYPE_TEXT } from '@/utils/order.ts'

    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    const saving = ref(false);
    const order = ref<any>(null);
    const shipVisible = ref(false);
    const shipForm = reactive({ company: '顺丰速运', trackingNo: '' });

    // 步骤条：1 待付款=0，2 待发货=1，3 待收货=2，4 待评价=3，5 已完成=4，6 已取消=1
    const STEP_MAP: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 1 };
    const activeStep = computed(() => STEP_MAP[order.value?.orderState ?? 1] ?? 0);

    async function getDetail() {
        loading.value = true;
        try {
            const result = await getAdminOrderDetailAPI(String(route.params.id)) as any;
            order.value = result.result;
        } finally {
            loading.value = false;
        }
    }

    async function saveShip() {
        if (shipForm.trackingNo.trim().length < 6) {
            ElMessage.warning('请输入正确的运单号');
            return;
        }
        saving.value = true;
        try {
            await shipOrderAPI(order.value.id, { company: shipForm.company, trackingNo: shipForm.trackingNo.trim() });
            ElMessage.success('发货成功');
            shipVisible.value = false;
            getDetail();
        } finally {
            saving.value = false;
        }
    }

    async function cancelOrder() {
        try {
            await ElMessageBox.confirm(`确定取消订单 ${order.value.id} 吗？`, '取消订单', {
                type: 'warning',
                confirmButtonText: '确定取消',
                cancelButtonText: '再想想',
            });
        } catch {
            return;
        }
        await cancelOrderAPI(order.value.id);
        ElMessage.success('订单已取消');
        getDetail();
    }

    onMounted(() => {
        getDetail();
    });
</script>

<style scoped lang="scss">
    .order-detail {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }
    .page-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 22px;

        .head-left {
            display: flex;
            align-items: center;
            gap: 14px;

            .back { width: 38px; height: 38px; }
            .title-row {
                display: flex;
                align-items: center;
                gap: 10px;

                h2 { font-size: 18px; font-weight: 600; color: $inkColor; }
            }
            .sub {
                margin-top: 4px;
                font-size: 13px;
                color: $inkColor3;
            }
        }
    }
    .detail-body {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }
    .block {
        padding: 20px 24px;

        .card-head {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            margin-bottom: 16px;

            h3 {
                position: relative;
                padding-left: 12px;
                font-size: 16px;
                font-weight: 500;
                color: $inkColor;

                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 16px;
                    border-radius: 2px;
                    background: $brandGradient;
                }
            }
            .sub { font-size: 12px; color: $inkColor3; }
        }
    }
    .info-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
    }
    .info-list {
        li {
            display: flex;
            align-items: baseline;
            padding: 7px 0;

            span {
                width: 80px;
                flex-shrink: 0;
                font-size: 13px;
                color: $inkColor3;
            }
            b {
                font-size: 13px;
                font-weight: 400;
                color: $inkColor2;
            }
            &.strong b {
                font-size: 17px;
                font-weight: 600;
                color: $priceColor;
            }
        }
    }
    .goods-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
            width: 52px;
            height: 52px;
            border-radius: 8px;
            object-fit: cover;
            background: #f5f6f8;
            flex-shrink: 0;
        }
        .name { font-size: 13px; color: $inkColor; }
        .spec { margin-top: 3px; font-size: 12px; color: $inkColor3; }
    }
    .money {
        font-size: 14px;
        font-weight: 600;
        color: $priceColor;
    }
</style>
