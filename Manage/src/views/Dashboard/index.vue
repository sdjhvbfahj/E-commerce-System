<template>
    <div class="page dashboard">
        <!-- 指标卡 -->
        <div class="stat-cards">
            <div class="stat-card es-card" v-for="item in data?.cards" :key="item.label">
                <span class="icon" :style="{ background: item.color + '14', color: item.color }">
                    <el-icon :size="22"><component :is="item.icon" /></el-icon>
                </span>
                <div class="info">
                    <p class="label">{{ item.label }}</p>
                    <p class="value">
                        {{ item.label.includes('成交额') ? moneyText(item.value) : item.value }}
                        <span class="unit">{{ item.unit }}</span>
                    </p>
                    <p class="trend" :class="item.trend >= 0 ? 'up' : 'down'">
                        <el-icon><CaretTop v-if="item.trend >= 0" /><CaretBottom v-else /></el-icon>
                        较昨日 {{ Math.abs(item.trend) }}%
                    </p>
                </div>
            </div>
        </div>

        <!-- 待办 -->
        <div class="todo-bar es-card">
            <span class="label">今日待办</span>
            <RouterLink class="todo" to="/order/list">
                <b>{{ data?.pending.ship ?? 0 }}</b> 个订单待发货
                <el-icon><ArrowRight /></el-icon>
            </RouterLink>
            <RouterLink class="todo warn" to="/order/refund">
                <b>{{ data?.pending.refunds ?? 0 }}</b> 个退款待审核（{{ moneyText(data?.pending.refundsAmount ?? 0) }} 元）
                <el-icon><ArrowRight /></el-icon>
            </RouterLink>
            <RouterLink class="todo danger" to="/stock/index">
                <b>{{ data?.pending.stockWarn ?? 0 }}</b> 个 SKU 库存预警
                <el-icon><ArrowRight /></el-icon>
            </RouterLink>
        </div>

        <!-- 趋势 + 类目占比 -->
        <div class="chart-row">
            <div class="chart-card es-card">
                <div class="card-head">
                    <h3>近 7 日经营趋势</h3>
                    <span class="sub">订单量 / 成交额 / 访客数</span>
                </div>
                <EChart :option="trendOption" height="320px" />
            </div>
            <div class="chart-card es-card">
                <div class="card-head">
                    <h3>类目销售占比</h3>
                    <span class="sub">按商品销量汇总</span>
                </div>
                <EChart :option="pieOption" height="320px" />
            </div>
        </div>

        <!-- 热销 + 库存预警 -->
        <div class="table-row">
            <div class="table-panel es-card">
                <div class="card-head">
                    <h3>热销商品 TOP10</h3>
                    <RouterLink class="more" to="/goods/list">去商品管理<el-icon><ArrowRight /></el-icon></RouterLink>
                </div>
                <ul class="top-list">
                    <li v-for="(item, index) in data?.topGoods" :key="item.id">
                        <span class="rank" :class="Number(index) <= 3 ? `top${Number(index) + 1}` : ''">{{ Number(index) + 1 }}</span>
                        <img :src="item.picture" :alt="item.name">
                        <div class="info">
                            <p class="name ellipsis">{{ item.name }}</p>
                            <p class="cat">{{ item.catName }}</p>
                        </div>
                        <div class="nums">
                            <p class="sales">已售 {{ item.sales }}</p>
                            <p class="amount">¥{{ moneyText(item.amount) }}</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="table-panel es-card">
                <div class="card-head">
                    <h3>库存预警</h3>
                    <RouterLink class="more" to="/stock/index">去处理<el-icon><ArrowRight /></el-icon></RouterLink>
                </div>
                <el-table :data="data?.stockWarn" size="default" height="520">
                    <el-table-column label="商品" min-width="220">
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
                    <el-table-column prop="available" label="可用库存" width="90">
                        <template #default="{ row }">
                            <span class="warn-num">{{ row.available }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="warn" label="预警值" width="80" />
                    <el-table-column label="状态" width="90">
                        <template #default>
                            <el-tag type="danger" effect="light" round>库存不足</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="90">
                        <template #default="{ row }">
                            <el-button link type="primary" @click="router.push('/stock/index')">补货</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Dashboard">
    import { computed, onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { getDashboardAPI } from '@/apis/admin.ts'
    import { useUserStore } from '@/stores/userStore.ts'

    const router = useRouter();
    const userStore = useUserStore();
    const data = ref<any>();

    async function getDashboard() {
        const result = await getDashboardAPI() as any;
        data.value = result.result;
    }

    onMounted(() => {
        getDashboard();
    });

    /** 金额统一显示成 1.2万 这种格式，避免卡片放不下 */
    function moneyText(value: number) {
        const num = Number(value) || 0;
        return num >= 10000 ? `${(num / 10000).toFixed(2)} 万` : num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // 近 7 日趋势：柱状（订单量）+ 折线（成交额）
    const trendOption = computed(() => ({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { top: 0, left: 6, itemWidth: 14, itemHeight: 8, icon: 'roundRect', textStyle: { color: '#5a6072', fontSize: 12 } },
        grid: { left: 8, right: 16, top: 52, bottom: 0, containLabel: true },
        xAxis: {
            type: 'category',
            data: data.value?.trend.dates ?? [],
            axisLine: { lineStyle: { color: '#eceef2' } },
            axisLabel: { color: '#9aa0b0' },
            axisTick: { show: false },
        },
        yAxis: [
            { type: 'value', name: '订单量', nameTextStyle: { color: '#9aa0b0' }, axisLabel: { color: '#9aa0b0' }, splitLine: { lineStyle: { color: '#f0f1f4' } } },
            { type: 'value', name: '成交额(元)', nameTextStyle: { color: '#9aa0b0' }, axisLabel: { color: '#9aa0b0' }, splitLine: { show: false } },
        ],
        series: [
            {
                name: '订单量',
                type: 'bar',
                barWidth: 18,
                itemStyle: { borderRadius: [6, 6, 0, 0], color: 'rgba(239, 95, 42, 0.72)' },
                data: data.value?.trend.orders ?? [],
            },
            {
                name: '成交额',
                type: 'line',
                yAxisIndex: 1,
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: { width: 3, color: '#232838' },
                itemStyle: { color: '#232838', borderColor: '#fff', borderWidth: 2 },
                areaStyle: {
                    color: {
                        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(35, 40, 56, 0.18)' },
                            { offset: 1, color: 'rgba(35, 40, 56, 0)' },
                        ],
                    },
                },
                data: data.value?.trend.amounts ?? [],
            },
        ],
    }));

    // 类目占比：环形图
    const pieOption = computed(() => ({
        tooltip: { trigger: 'item', formatter: '{b}<br/>{c} 件（{d}%）' },
        legend: { type: 'scroll', orient: 'vertical', right: 0, top: 'middle', itemWidth: 12, itemHeight: 8, textStyle: { color: '#5a6072', fontSize: 12 } },
        color: ['#ef5f2a', '#ff8a4c', '#f79009', '#232838', '#12b76a', '#5a6072', '#f04438', '#9aa0b0', '#1dc779', '#ffb302'],
        series: [
            {
                type: 'pie',
                radius: ['46%', '72%'],
                center: ['38%', '50%'],
                avoidLabelOverlap: true,
                itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                label: { show: false },
                emphasis: { label: { show: false } },
                data: data.value?.categoryRatio ?? [],
            },
        ],
    }));
</script>

<style scoped lang="scss">
    .dashboard {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    /* 指标卡 */
    .stat-cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;

        .stat-card {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px 22px;

            .icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 52px;
                height: 52px;
                border-radius: 14px;
                flex-shrink: 0;
            }
            .info {
                min-width: 0;

                .label {
                    font-size: 13px;
                    color: $inkColor3;
                }
                .value {
                    margin-top: 6px;
                    font-size: 26px;
                    font-weight: 600;
                    line-height: 1.1;
                    color: $inkColor;

                    .unit {
                        margin-left: 2px;
                        font-size: 12px;
                        font-weight: 400;
                        color: $inkColor3;
                    }
                }
                .trend {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    margin-top: 6px;
                    font-size: 12px;

                    &.up { color: $sucColor; }
                    &.down { color: $helpColor; }
                }
            }
        }
    }
    /* 待办条 */
    .todo-bar {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 22px;

        .label {
            font-size: 14px;
            font-weight: 500;
            color: $inkColor;
            padding-right: 14px;
            border-right: 1px solid $lineColor;
        }
        .todo {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            color: $inkColor2;
            background: #f7f8fa;
            transition: all 0.25s ease;

            b {
                font-size: 16px;
                color: $brandColor;
            }
            .el-icon { font-size: 12px; }
            &:hover {
                color: $brandColor;
                background: $brandColorSoft;
            }
            &.danger b { color: $helpColor; }
        }
    }
    /* 图表行 */
    .chart-row {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 16px;
    }
    .chart-card,
    .table-panel {
        padding: 20px 22px;

        .card-head {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            margin-bottom: 14px;

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
            .sub {
                margin-left: 10px;
                font-size: 12px;
                color: $inkColor3;
            }
            .more {
                display: inline-flex;
                align-items: center;
                gap: 2px;
                font-size: 13px;
                color: $inkColor3;

                .el-icon { font-size: 12px; }
                &:hover { color: $brandColor; }
            }
        }
    }
    /* 表格行 */
    .table-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }
    .top-list {
        display: flex;
        flex-direction: column;

        li {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 9px 0;
            border-bottom: 1px dashed $lineColor;

            &:last-child { border-bottom: none; }
            .rank {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                border-radius: 6px;
                font-size: 12px;
                color: $inkColor3;
                background: #f5f6f8;
                flex-shrink: 0;

                &.top1, &.top2, &.top3 {
                    color: #fff;
                    background: $brandGradient;
                }
            }
            img {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                object-fit: cover;
                background: #f5f6f8;
                flex-shrink: 0;
            }
            .info {
                flex: 1;
                min-width: 0;

                .name { font-size: 14px; color: $inkColor; }
                .cat { margin-top: 2px; font-size: 12px; color: $inkColor3; }
            }
            .nums {
                text-align: right;

                .sales { font-size: 12px; color: $inkColor3; }
                .amount { margin-top: 2px; font-size: 14px; font-weight: 500; color: $priceColor; }
            }
        }
    }
    .goods-cell {
        display: flex;
        align-items: center;
        gap: 10px;

        img {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            object-fit: cover;
            background: #f5f6f8;
            flex-shrink: 0;
        }
        .name { font-size: 13px; color: $inkColor; }
        .spec { margin-top: 2px; font-size: 12px; color: $inkColor3; }
    }
    .warn-num {
        color: $helpColor;
        font-weight: 600;
    }
</style>
