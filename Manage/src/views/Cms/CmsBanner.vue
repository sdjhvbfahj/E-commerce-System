<template>
    <div class="page cms-banner">
        <div class="table-card">
            <div class="toolbar">
                <div class="toolbar-left">
                    轮播图管理
                    <span class="count">共 {{ list.length }} 张 · 首页 {{ homeCount }} 张 / 分类页 {{ cateCount }} 张，停用后用户端立即隐藏</span>
                </div>
                <div class="toolbar-right" v-permission="'cms:update'">
                    <el-button type="primary" @click="openEdit()"><el-icon><Plus /></el-icon>新增轮播图</el-button>
                </div>
            </div>

            <el-table :data="list" v-loading="loading">
                <el-table-column label="预览图" width="240">
                    <template #default="{ row }">
                        <el-image
                            :src="row.imgUrl"
                            :preview-src-list="[row.imgUrl]"
                            preview-teleported
                            fit="cover"
                            class="banner-pic"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="标题 / 副标题" min-width="240">
                    <template #default="{ row }">
                        <p class="title">{{ row.title }}</p>
                        <p class="slogan">{{ row.slogan }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="展示位置" width="110">
                    <template #default="{ row }">
                        <el-tag :type="row.distributionSite === 1 ? 'primary' : 'success'" effect="light" round>
                            {{ row.distributionSite === 1 ? '首页' : '分类页' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="80" />
                <el-table-column prop="hrefUrl" label="跳转地址" min-width="170" show-overflow-tooltip />
                <el-table-column label="上架状态" width="100">
                    <template #default="{ row }">
                        <el-switch :model-value="row.status === 1" v-permission="'cms:update'" @change="toggle(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="updatedAt" label="最后更新" width="170" />
                <el-table-column label="操作" width="130" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" v-permission="'cms:update'" @click="openEdit(row)">编辑</el-button>
                        <el-button link type="danger" v-permission="'cms:update'" @click="remove(row)">删除</el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="暂无轮播图" />
                </template>
            </el-table>
        </div>

        <!-- 新增 / 编辑弹窗 -->
        <el-dialog v-model="dialogVisible" :title="editForm.id ? '编辑轮播图' : '新增轮播图'" width="560" :close-on-click-modal="false">
            <div class="banner-preview" v-if="editForm.title">
                <img :src="previewImg" alt="预览">
                <span class="badge">效果预览</span>
            </div>
            <el-form :model="editForm" label-width="90px">
                <el-form-item label="主标题" required>
                    <el-input v-model="editForm.title" maxlength="20" show-word-limit placeholder="如：居家焕新季" />
                </el-form-item>
                <el-form-item label="副标题" required>
                    <el-input v-model="editForm.slogan" maxlength="30" show-word-limit placeholder="如：收纳 · 清洁 · 厨房 一站配齐" />
                </el-form-item>
                <el-form-item label="跳转地址" required>
                    <el-select v-model="editForm.hrefUrl" placeholder="请选择跳转的分类" style="width: 100%">
                        <el-option
                            v-for="item in categoryTree"
                            :key="item.id"
                            :label="`${item.name}（${item.goodsCount} 件商品）`"
                            :value="`/category/${item.id}`"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="展示位置">
                    <el-radio-group v-model="editForm.distributionSite">
                        <el-radio-button :value="1">首页轮播</el-radio-button>
                        <el-radio-button :value="2">分类页轮播</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="editForm.sort" :min="1" :max="10" controls-position="right" style="width: 140px" />
                    <span class="tip">数字越小越靠前</span>
                </el-form-item>
                <el-form-item label="上架状态">
                    <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="saving" v-permission="'cms:update'" @click="save">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="CmsBanner">
    import { computed, onMounted, reactive, ref } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { deleteBannerAPI, getBannerListAPI, saveBannerAPI, toggleBannerAPI } from '@/apis/admin.ts'
    import { getCategoryTreeAPI } from '@/apis/goods.ts'
    import { image } from '@/mock/utils/image'

    const loading = ref(false);
    const saving = ref(false);
    const list = ref<any[]>([]);
    const categoryTree = ref<any[]>([]);
    const dialogVisible = ref(false);

    const editForm = reactive({
        id: '',
        title: '',
        slogan: '',
        hrefUrl: '',
        distributionSite: 1,
        sort: 1,
        status: 1,
    });

    const homeCount = computed(() => list.value.filter((item) => item.distributionSite === 1).length);
    const cateCount = computed(() => list.value.filter((item) => item.distributionSite === 2).length);
    /** 标题变化时实时重绘一张同款假图做预览 */
    const previewImg = computed(() =>
        image(editForm.title, { width: 1240, height: 500, seed: 666, subLabel: editForm.slogan }),
    );

    async function getList() {
        loading.value = true;
        try {
            const result = await getBannerListAPI() as any;
            list.value = result.result;
        } finally {
            loading.value = false;
        }
    }

    async function getCategories() {
        const result = await getCategoryTreeAPI() as any;
        categoryTree.value = result.result;
    }

    function openEdit(row?: any) {
        editForm.id = row?.id ?? '';
        editForm.title = row?.title ?? '';
        editForm.slogan = row?.slogan ?? '';
        editForm.hrefUrl = row?.hrefUrl ?? '';
        editForm.distributionSite = row?.distributionSite ?? 1;
        editForm.sort = row?.sort ?? 1;
        editForm.status = row?.status ?? 1;
        dialogVisible.value = true;
    }

    async function save() {
        if (!editForm.title.trim()) {
            ElMessage.warning('请输入主标题');
            return;
        }
        if (!editForm.slogan.trim()) {
            ElMessage.warning('请输入副标题');
            return;
        }
        if (!editForm.hrefUrl) {
            ElMessage.warning('请选择跳转地址');
            return;
        }
        saving.value = true;
        try {
            await saveBannerAPI(editForm.id || undefined, { ...editForm });
            ElMessage.success('轮播图已保存');
            dialogVisible.value = false;
            getList();
        } finally {
            saving.value = false;
        }
    }

    async function toggle(row: any) {
        await toggleBannerAPI(row.id);
        ElMessage.success(row.status === 1 ? '已停用' : '已启用');
        getList();
    }

    async function remove(row: any) {
        try {
            await ElMessageBox.confirm(`确定删除「${row.title}」吗？删除后不可恢复。`, '删除轮播图', {
                type: 'warning',
                confirmButtonText: '删除',
                cancelButtonText: '取消',
            });
        } catch {
            return;
        }
        await deleteBannerAPI(row.id);
        ElMessage.success('删除成功');
        getList();
    }

    onMounted(() => {
        getList();
        getCategories();
    });
</script>

<style scoped lang="scss">
    .banner-pic {
        width: 200px;
        height: 74px;
        border-radius: 8px;
        overflow: hidden;
    }
    .title {
        font-size: 14px;
        color: $inkColor;
    }
    .slogan {
        margin-top: 4px;
        font-size: 12px;
        color: $inkColor3;
    }
    .banner-preview {
        position: relative;
        margin-bottom: 18px;
        border-radius: 12px;
        overflow: hidden;

        img {
            display: block;
            width: 100%;
            height: 130px;
            object-fit: cover;
        }
        .badge {
            position: absolute;
            right: 10px;
            top: 10px;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 12px;
            color: #fff;
            background: rgba(35, 40, 56, 0.6);
        }
    }
    .tip {
        margin-left: 10px;
        font-size: 12px;
        color: $inkColor3;
    }
</style>
