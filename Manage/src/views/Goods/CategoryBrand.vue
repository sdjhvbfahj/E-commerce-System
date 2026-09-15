<template>
    <div class="page category-brand">
        <div class="table-card">
            <el-tabs v-model="activeTab" class="cb-tabs">
                <!-- 分类 -->
                <el-tab-pane label="商品分类" name="category">
                    <div class="toolbar">
                        <div class="toolbar-left">
                            分类结构
                            <span class="count">共 {{ categoryTree.length }} 个一级分类 / {{ subTotal }} 个二级分类 · 演示环境的分类由商品数据自动聚合</span>
                        </div>
                    </div>
                    <el-table :data="categoryTree" row-key="id" border default-expand-all v-loading="loading">
                        <el-table-column prop="name" label="分类名称" min-width="220" />
                        <el-table-column prop="id" label="分类编号" width="130" />
                        <el-table-column prop="goodsCount" label="商品数" width="100" />
                        <el-table-column prop="onShelfCount" label="在售数" width="100">
                            <template #default="{ row }">
                                <span :class="{ 'warn-num': row.onShelfCount === 0 }">{{ row.onShelfCount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="在售占比" min-width="180">
                            <template #default="{ row }">
                                <el-progress :percentage="percent(row.onShelfCount, row.goodsCount)" :stroke-width="8" />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 品牌 -->
                <el-tab-pane label="品牌管理" name="brand">
                    <div class="toolbar">
                        <div class="toolbar-left">
                            品牌列表
                            <span class="count">共 {{ brandList.length }} 个品牌 · 点击右侧「编辑」维护品牌名称与介绍</span>
                        </div>
                    </div>
                    <el-table :data="brandList" v-loading="loading">
                        <el-table-column label="品牌" min-width="220">
                            <template #default="{ row }">
                                <div class="brand-cell">
                                    <img :src="row.logo">
                                    <div>
                                        <p class="name">{{ row.name }}<span class="en">{{ row.nameEn }}</span></p>
                                        <p class="cat">主营：{{ row.catName }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="desc" label="品牌介绍" min-width="260" show-overflow-tooltip />
                        <el-table-column prop="goodsCount" label="商品数" width="90" />
                        <el-table-column prop="onShelfCount" label="在售数" width="90" />
                        <el-table-column label="操作" width="90" fixed="right">
                            <template #default="{ row }">
                                <el-button link type="primary" v-permission="'category:update'" @click="openEdit(row)">编辑</el-button>
                            </template>
                        </el-table-column>
                        <template #empty>
                            <el-empty description="暂无品牌数据" />
                        </template>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 品牌编辑弹窗 -->
        <el-dialog v-model="dialogVisible" title="编辑品牌" width="480" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px">
                <el-form-item label="品牌名称" required>
                    <el-input v-model="editForm.name" maxlength="20" show-word-limit placeholder="请输入品牌名称" />
                </el-form-item>
                <el-form-item label="品牌介绍">
                    <el-input v-model="editForm.desc" type="textarea" :rows="3" maxlength="100" show-word-limit placeholder="一句话介绍这个品牌" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="saving" @click="save">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="CategoryBrand">
    import { computed, onMounted, reactive, ref } from 'vue'
    import { ElMessage } from 'element-plus'
    import { getBrandListAPI, getCategoryTreeAPI, updateBrandAPI } from '@/apis/goods.ts'

    const activeTab = ref('category');
    const loading = ref(false);
    const saving = ref(false);
    const categoryTree = ref<any[]>([]);
    const brandList = ref<any[]>([]);
    const dialogVisible = ref(false);
    const editForm = reactive({ id: '', name: '', desc: '' });

    const subTotal = computed(() => categoryTree.value.reduce((sum, item) => sum + (item.children?.length ?? 0), 0));

    function percent(part: number, total: number) {
        if (!total) return 0;
        return Math.round((part / total) * 100);
    }

    function openEdit(row: any) {
        if (!row) return;
        editForm.id = row.id;
        editForm.name = row.name;
        editForm.desc = row.desc;
        dialogVisible.value = true;
    }

    async function save() {
        if (!editForm.name.trim()) {
            ElMessage.warning('请输入品牌名称');
            return;
        }
        saving.value = true;
        try {
            await updateBrandAPI(editForm.id, { name: editForm.name.trim(), desc: editForm.desc });
            ElMessage.success('品牌信息已更新');
            dialogVisible.value = false;
            await getList();
        } finally {
            saving.value = false;
        }
    }

    async function getList() {
        loading.value = true;
        try {
            const [cats, brands] = await Promise.all([getCategoryTreeAPI(), getBrandListAPI()] as any[]);
            categoryTree.value = cats.result;
            brandList.value = brands.result;
        } finally {
            loading.value = false;
        }
    }

    onMounted(() => {
        getList();
    });
</script>

<style scoped lang="scss">
    .cb-tabs {
        :deep(.el-tabs__header) {
            margin-bottom: 16px;
        }
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
    .warn-num {
        color: $helpColor;
        font-weight: 600;
    }
    .brand-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            object-fit: cover;
            background: #f5f6f8;
            flex-shrink: 0;
        }
        .name {
            font-size: 14px;
            color: $inkColor;

            .en {
                margin-left: 6px;
                font-size: 11px;
                color: #b9bdcc;
                letter-spacing: 0.5px;
            }
        }
        .cat {
            margin-top: 3px;
            font-size: 12px;
            color: $inkColor3;
        }
    }
</style>
