<template>
    <div class="page goods-list">
        <!-- 查询区 -->
        <div class="query-card">
            <el-form :inline="true" :model="query" @submit.prevent>
                <el-form-item label="关键词">
                    <el-input
                        v-model="query.keyword"
                        placeholder="商品名称 / 卖点"
                        clearable
                        style="width: 220px"
                        @keyup.enter="search()"
                        @clear="search()"
                    />
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-select v-model="query.catId" placeholder="全部分类" clearable style="width: 160px" @change="search()">
                        <el-option v-for="item in categoryTree" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="上架状态">
                    <el-select v-model="query.status" placeholder="全部状态" clearable style="width: 140px" @change="search()">
                        <el-option label="已上架" :value="1" />
                        <el-option label="已下架" :value="0" />
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
                    商品列表
                    <span class="count">共 {{ total }} 件</span>
                    <template v-if="selected.length">
                        <el-divider direction="vertical" />
                        <span class="count">已选 {{ selected.length }} 件</span>
                    </template>
                </div>
                <div class="toolbar-right" v-permission="'goods:shelf'">
                    <el-button :disabled="!selected.length" @click="batchShelf(1)"><el-icon><Upload /></el-icon>批量上架</el-button>
                    <el-button :disabled="!selected.length" @click="batchShelf(0)"><el-icon><Download /></el-icon>批量下架</el-button>
                </div>
            </div>

            <el-table
                ref="tableRef"
                :data="list"
                v-loading="loading"
                @selection-change="(rows: any[]) => (selected = rows)"
            >
                <el-table-column type="selection" width="44" />
                <el-table-column label="商品" min-width="300">
                    <template #default="{ row }">
                        <div class="goods-cell">
                            <img :src="row.picture">
                            <div class="goods-info">
                                <p class="name ellipsis-2">{{ row.name }}</p>
                                <p class="desc ellipsis">{{ row.desc }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="分类" width="150">
                    <template #default="{ row }">
                        <p class="cat-name">{{ row.catName }}</p>
                        <p class="sub-name">{{ row.subName }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="brandName" label="品牌" width="110" />
                <el-table-column label="价格" width="130">
                    <template #default="{ row }">
                        <p class="price">¥{{ row.price }}</p>
                        <p class="old-price">¥{{ row.oldPrice }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="库存" width="110">
                    <template #default="{ row }">
                        <p class="stock-num" :class="{ warn: row.stockWarn }">{{ row.stockAvailable }}</p>
                        <p class="stock-label">{{ row.stockWarn ? '库存预警' : `共 ${row.stockTotal}` }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="salesCount" label="销量" width="80" />
                <el-table-column label="上架状态" width="100">
                    <template #header>
                        上架状态
                        <el-tooltip content="关闭开关商品会在用户端下架" placement="top">
                            <el-icon class="help"><QuestionFilled /></el-icon>
                        </el-tooltip>
                    </template>
                    <template #default="{ row }">
                        <el-switch
                            :model-value="row.status === 1"
                            :disabled="!hasPermission('goods:shelf')"
                            @change="toggleShelf(row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130" fixed="right">
                    <template #default="{ row }">
                        <el-button
                            link
                            type="primary"
                            v-permission="['goods:update', 'goods:detail']"
                            @click="router.push(`/goods/edit/${row.id}`)"
                        >编辑</el-button>
                        <el-button
                            link
                            type="danger"
                            v-permission="'goods:delete'"
                            :disabled="row.status === 1"
                            @click="remove(row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有找到符合条件的商品" />
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

<script setup lang="ts" name="GoodsList">
    import { onMounted, reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import {
        batchGoodsShelfAPI,
        deleteGoodsAPI,
        getAdminGoodsAPI,
        getCategoryTreeAPI,
        toggleGoodsShelfAPI,
    } from '@/apis/goods.ts'
    import { useUserStore } from '@/stores/userStore.ts'

    const router = useRouter();
    const userStore = useUserStore();

    const loading = ref(false);
    const list = ref<any[]>([]);
    const total = ref(0);
    const selected = ref<any[]>([]);
    const categoryTree = ref<any[]>([]);

    const query = reactive({
        page: 1,
        pageSize: 10,
        keyword: '',
        catId: '',
        status: undefined as number | undefined,
    });

    function hasPermission(code: string) {
        return userStore.hasPermission(code);
    }

    async function getList() {
        loading.value = true;
        try {
            const result = await getAdminGoodsAPI({ ...query }) as any;
            list.value = result.result.items;
            total.value = result.result.counts;
        } finally {
            loading.value = false;
        }
    }

    async function getCategoryTree() {
        const result = await getCategoryTreeAPI() as any;
        categoryTree.value = result.result;
    }

    function search() {
        query.page = 1;
        getList();
    }

    function reset() {
        query.keyword = '';
        query.catId = '';
        query.status = undefined;
        search();
    }

    async function toggleShelf(row: any) {
        try {
            await ElMessageBox.confirm(
                `确定要${row.status === 1 ? '下架' : '上架'}「${row.name}」吗？${row.status === 1 ? '下架后用户端将无法看到该商品' : '上架后用户端立即可见'}`,
                row.status === 1 ? '下架商品' : '上架商品',
                { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' },
            );
        } catch {
            return;
        }
        await toggleGoodsShelfAPI(row.id);
        ElMessage.success(`已${row.status === 1 ? '下架' : '上架'}`);
        getList();
    }

    async function batchShelf(status: 0 | 1) {
        try {
            await ElMessageBox.confirm(
                `确定要批量${status === 1 ? '上架' : '下架'}选中的 ${selected.value.length} 件商品吗？`,
                '批量操作',
                { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' },
            );
        } catch {
            return;
        }
        const result = await batchGoodsShelfAPI(selected.value.map((item) => item.id), status) as any;
        ElMessage.success(`已${status === 1 ? '上架' : '下架'} ${result.result.count} 件商品`);
        getList();
    }

    async function remove(row: any) {
        try {
            await ElMessageBox.confirm(`删除后不可恢复，确定删除「${row.name}」吗？`, '删除商品', {
                type: 'warning',
                confirmButtonText: '删除',
                cancelButtonText: '取消',
            });
        } catch {
            return;
        }
        await deleteGoodsAPI(row.id);
        ElMessage.success('删除成功');
        getList();
    }

    onMounted(() => {
        getList();
        getCategoryTree();
    });
</script>

<style scoped lang="scss">
    .goods-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
            width: 56px;
            height: 56px;
            border-radius: 10px;
            object-fit: cover;
            background: #f5f6f8;
            flex-shrink: 0;
        }
        .goods-info {
            min-width: 0;

            .name {
                font-size: 14px;
                color: $inkColor;
                line-height: 20px;
            }
            .desc {
                margin-top: 4px;
                font-size: 12px;
                color: $inkColor3;
            }
        }
    }
    .cat-name {
        font-size: 13px;
        color: $inkColor2;
    }
    .sub-name {
        margin-top: 3px;
        font-size: 12px;
        color: $inkColor3;
    }
    .price {
        font-size: 15px;
        font-weight: 500;
        color: $priceColor;
    }
    .old-price {
        margin-top: 2px;
        font-size: 12px;
        color: $inkColor3;
        text-decoration: line-through;
    }
    .stock-num {
        font-size: 15px;
        font-weight: 600;
        color: $inkColor;

        &.warn { color: $helpColor; }
    }
    .stock-label {
        margin-top: 2px;
        font-size: 12px;
        color: $inkColor3;
    }
    .help {
        vertical-align: -2px;
        margin-left: 2px;
        color: $inkColor3;
    }
</style>
