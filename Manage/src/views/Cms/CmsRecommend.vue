<template>
    <div class="page cms-recommend" v-loading="loading">
        <el-alert
            class="head-tip"
            type="info"
            :closable="false"
            show-icon
            title="推荐位与热榜会直接决定用户端首页、商品详情页展示什么商品，保存后立即生效"
        />

        <div class="slot-grid">
            <div class="slot-card es-card" v-for="slot in slots" :key="slot.id">
                <div class="slot-head">
                    <div>
                        <h3>{{ slot.name }}</h3>
                        <p class="desc">{{ slot.desc }}</p>
                    </div>
                    <el-switch :model-value="slot.status === 1" v-permission="'cms:update'" @change="toggleStatus(slot)" />
                </div>

                <ul class="goods-list">
                    <li class="goods-item" v-for="goods in slot.goods" :key="goods.id">
                        <img :src="goods.picture">
                        <p class="name ellipsis">{{ goods.name }}</p>
                        <p class="price">¥{{ goods.price }}</p>
                        <el-icon class="remove" v-permission="'cms:update'" @click="removeGoods(slot, goods.id)"><CircleCloseFilled /></el-icon>
                    </li>
                    <li class="goods-item add" v-if="slot.goods.length < (isHot(slot) ? 6 : 4)" v-permission="'cms:update'" @click="openPicker(slot)">
                        <el-icon><Plus /></el-icon>
                        <span>添加商品</span>
                    </li>
                </ul>

                <div class="slot-foot">
                    <span class="time">更新于 {{ slot.updatedAt }}</span>
                    <el-button size="small" v-permission="'cms:update'" @click="openPicker(slot)">
                        <el-icon><Sort /></el-icon>调整商品
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 商品选择器 -->
        <el-dialog v-model="pickerVisible" :title="`调整「${current?.name}」`" width="720" :close-on-click-modal="false">
            <el-input
                v-model="pickerQuery.keyword"
                placeholder="搜索商品名称"
                clearable
                @input="searchGoods"
            >
                <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
            <el-table
                ref="pickerTableRef"
                :data="pickerGoods"
                height="360"
                class="picker-table"
                @selection-change="(rows: any[]) => (pickerSelected = rows)"
            >
                <el-table-column type="selection" width="44" />
                <el-table-column label="商品" min-width="280">
                    <template #default="{ row }">
                        <div class="goods-cell">
                            <img :src="row.picture">
                            <div>
                                <p class="name ellipsis">{{ row.name }}</p>
                                <p class="cat">{{ row.catName }} · ¥{{ row.price }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="picker-tip">
                已选 <b>{{ pickerSelected.length }}</b> 件
                <span class="limit">（{{ isHot(current) ? '热榜需要 3-6 件' : '推荐位最多 4 件' }}）</span>
            </div>
            <template #footer>
                <el-button @click="pickerVisible = false">取消</el-button>
                <el-button type="primary" :loading="saving" v-permission="'cms:update'" @click="savePicker">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="CmsRecommend">
    import { nextTick, onMounted, reactive, ref } from 'vue'
    import { ElMessage } from 'element-plus'
    import { getHotListAPI, getSlotListAPI, updateHotAPI, updateSlotAPI } from '@/apis/admin.ts'
    import { getAdminGoodsAPI } from '@/apis/goods.ts'

    const loading = ref(false);
    const saving = ref(false);
    const slots = ref<any[]>([]);
    const pickerVisible = ref(false);
    const current = ref<any>(null);
    const pickerGoods = ref<any[]>([]);
    const pickerSelected = ref<any[]>([]);
    const pickerTableRef = ref();
    const pickerQuery = reactive({ keyword: '' });

    function isHot(slot: any) {
        return slot?.id?.startsWith('hot-');
    }

    async function getList() {
        loading.value = true;
        try {
            const [slotResult, hotResult] = await Promise.all([getSlotListAPI(), getHotListAPI()] as any[]);
            slots.value = [...slotResult.result, ...hotResult.result];
        } finally {
            loading.value = false;
        }
    }

    async function searchGoods() {
        const result = await getAdminGoodsAPI({ page: 1, pageSize: 20, keyword: pickerQuery.keyword }) as any;
        pickerGoods.value = result.result.items;
    }

    async function openPicker(slot: any) {
        current.value = slot;
        pickerQuery.keyword = '';
        pickerVisible.value = true;
        await searchGoods();
        // 默认勾选已在推荐位里的商品
        await nextTick();
        pickerTableRef.value?.clearSelection();
        slot.goods.forEach((goods: any) => {
            const row = pickerGoods.value.find((item) => item.id === goods.id);
            if (row) pickerTableRef.value?.toggleRowSelection(row, true);
        });
    }

    async function savePicker() {
        if (!current.value) return;
        const max = isHot(current.value) ? 6 : 4;
        const min = isHot(current.value) ? 3 : 1;
        if (pickerSelected.value.length > max) {
            ElMessage.warning(`最多只能选择 ${max} 件商品`);
            return;
        }
        if (pickerSelected.value.length < min) {
            ElMessage.warning(`至少需要 ${min} 件商品`);
            return;
        }
        saving.value = true;
        try {
            const api = isHot(current.value) ? updateHotAPI : updateSlotAPI;
            await api(current.value.id, {
                goodsIds: pickerSelected.value.map((item) => item.id),
                status: current.value.status,
            });
            ElMessage.success('已保存，用户端展示已更新');
            pickerVisible.value = false;
            getList();
        } finally {
            saving.value = false;
        }
    }

    async function removeGoods(slot: any, goodsId: string) {
        const next = slot.goods.filter((item: any) => item.id !== goodsId).map((item: any) => item.id);
        if (next.length < (isHot(slot) ? 3 : 1)) {
            ElMessage.warning(`至少保留 ${isHot(slot) ? 3 : 1} 件商品`);
            return;
        }
        const api = isHot(slot) ? updateHotAPI : updateSlotAPI;
        await api(slot.id, { goodsIds: next, status: slot.status });
        ElMessage.success('已移除');
        getList();
    }

    async function toggleStatus(slot: any) {
        const api = isHot(slot) ? updateHotAPI : updateSlotAPI;
        await api(slot.id, { goodsIds: slot.goodsIds, status: slot.status === 1 ? 0 : 1 });
        ElMessage.success(slot.status === 1 ? '已停用' : '已启用');
        getList();
    }

    onMounted(() => {
        getList();
        searchGoods();
    });
</script>

<style scoped lang="scss">
    .head-tip {
        margin-bottom: 14px;
        border-radius: 10px;
    }
    .slot-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 14px;
    }
    .slot-card {
        padding: 20px 22px;

        .slot-head {
            display: flex;
            align-items: flex-start;
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
            .desc {
                margin-top: 6px;
                font-size: 12px;
                color: $inkColor3;
            }
        }
    }
    .goods-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;

        .goods-item {
            position: relative;
            padding: 10px;
            text-align: center;
            border: 1px solid $lineColor;
            border-radius: 12px;
            background: #fafbfc;

            img {
                width: 100%;
                aspect-ratio: 1 / 1;
                border-radius: 8px;
                object-fit: cover;
                background: #f5f6f8;
            }
            .name {
                margin-top: 8px;
                font-size: 12px;
                color: $inkColor;
            }
            .price {
                margin-top: 3px;
                font-size: 13px;
                font-weight: 500;
                color: $priceColor;
            }
            .remove {
                position: absolute;
                right: -6px;
                top: -6px;
                font-size: 18px;
                color: #c8ccd4;
                cursor: pointer;
                background: #fff;
                border-radius: 50%;
                transition: color 0.25s ease;

                &:hover {
                    color: $helpColor;
                }
            }
            &.add {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                min-height: 140px;
                border: 1px dashed #d9dce3;
                background: #fff;
                color: $inkColor3;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.25s ease;

                .el-icon { font-size: 22px; }
                &:hover {
                    color: $brandColor;
                    border-color: $brandColor;
                }
            }
        }
    }
    .slot-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 14px;

        .time {
            font-size: 12px;
            color: $inkColor3;
        }
    }
    .goods-cell {
        display: flex;
        align-items: center;
        gap: 10px;

        img {
            width: 42px;
            height: 42px;
            border-radius: 8px;
            object-fit: cover;
            background: #f5f6f8;
            flex-shrink: 0;
        }
        .name { font-size: 13px; color: $inkColor; }
        .cat { margin-top: 2px; font-size: 12px; color: $inkColor3; }
    }
    .picker-tip {
        padding: 10px 2px 0;
        font-size: 13px;
        color: $inkColor2;

        b { color: $brandColor; }
        .limit { margin-left: 6px; font-size: 12px; color: $inkColor3; }
    }
</style>
