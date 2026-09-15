<template>
    <div class="page goods-edit">
        <!-- 页头 -->
        <div class="page-head es-card">
            <div class="head-left">
                <el-button class="back" circle @click="router.back()"><el-icon><ArrowLeft /></el-icon></el-button>
                <div>
                    <h2>{{ isEdit ? '编辑商品' : '新增商品' }}</h2>
                    <p class="sub">{{ isEdit ? `商品编号 ${goods.id} · 上架状态：${goods.status === 1 ? '已上架' : '已下架'}` : '填写商品信息后即可在用户端上架销售' }}</p>
                </div>
            </div>
            <div class="head-right">
                <el-button @click="router.back()">取消</el-button>
                <el-button type="primary" :loading="saving" v-permission="isEdit ? 'goods:update' : 'goods:create'" @click="save">
                    <el-icon><Check /></el-icon>保存
                </el-button>
            </div>
        </div>

        <div class="form-body">
            <!-- 基本信息 -->
            <div class="form-card es-card">
                <div class="card-head"><h3>基本信息</h3></div>
                <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
                    <el-form-item label="商品名称" prop="name">
                        <el-input v-model="form.name" maxlength="40" show-word-limit placeholder="请输入商品名称" />
                    </el-form-item>
                    <el-form-item label="商品卖点" prop="desc">
                        <el-input v-model="form.desc" maxlength="60" show-word-limit placeholder="一句话卖点，展示在商品列表与详情页" />
                    </el-form-item>
                    <el-form-item label="商品分类" prop="catId">
                        <div class="cat-selects">
                            <el-select v-model="form.catId" placeholder="一级分类" style="width: 180px" @change="onCatChange" :disabled="isEdit">
                                <el-option v-for="item in categoryTree" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select>
                            <el-select v-model="form.subId" placeholder="二级分类" style="width: 180px" :disabled="isEdit">
                                <el-option v-for="item in subOptions" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select>
                        </div>
                        <p class="form-tip" v-if="isEdit">演示环境的分类、品牌创建后不允许更换</p>
                    </el-form-item>
                    <el-form-item label="所属品牌" prop="brandId">
                        <el-select v-model="form.brandId" placeholder="请选择品牌" style="width: 180px" :disabled="isEdit">
                            <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 价格库存 -->
            <div class="form-card es-card">
                <div class="card-head">
                    <h3>价格与库存</h3>
                    <span class="sub">改价后用户端商品价格立即生效</span>
                </div>
                <el-form :model="form" :rules="rules" label-width="90px">
                    <el-form-item label="售价" prop="price">
                        <el-input-number v-model="form.price" :min="0.01" :precision="2" :step="10" controls-position="right" style="width: 180px" />
                        <span class="form-tip inline">元</span>
                    </el-form-item>
                    <el-form-item label="划线价" prop="oldPrice">
                        <el-input-number v-model="form.oldPrice" :min="0" :precision="2" :step="10" controls-position="right" style="width: 180px" />
                        <span class="form-tip inline">元，填 0 表示不展示划线价</span>
                    </el-form-item>
                </el-form>

                <!-- SKU 表（编辑已有商品时只读展示） -->
                <template v-if="isEdit && goods.skus?.length">
                    <el-divider content-position="left">规格与 SKU（{{ goods.skus.length }} 个）</el-divider>
                    <el-table :data="goods.skus" size="small" border>
                        <el-table-column prop="id" label="SKU 编号" width="170" />
                        <el-table-column label="规格">
                            <template #default="{ row }">
                                {{ row.specs.map((spec: any) => `${spec.name}：${spec.valueName}`).join('　') }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="price" label="售价" width="100" />
                        <el-table-column prop="inventory" label="库存" width="90" />
                    </el-table>
                </template>
            </div>

            <!-- 商品图集 -->
            <div class="form-card es-card" v-if="isEdit">
                <div class="card-head">
                    <h3>商品图集</h3>
                    <span class="sub">演示环境的商品图为离线生成，不支持重新上传</span>
                </div>
                <div class="pic-list">
                    <div class="pic" v-for="(pic, index) in goods.mainPictures" :key="pic">
                        <img :src="pic">
                        <span class="badge" v-if="index === 0">主图</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="GoodsEdit">
    import { computed, onMounted, reactive, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import type { FormInstance, FormRules } from 'element-plus'
    import { ElMessage } from 'element-plus'
    import {
        createAdminGoodsAPI,
        getAdminGoodsByIdAPI,
        getBrandListAPI,
        getCategoryTreeAPI,
        updateAdminGoodsAPI,
    } from '@/apis/goods.ts'

    const route = useRoute();
    const router = useRouter();

    const formRef = ref<FormInstance>();
    const saving = ref(false);
    const goods = ref<any>({});
    const categoryTree = ref<any[]>([]);
    const brandList = ref<any[]>([]);

    const isEdit = computed(() => Boolean(route.params.id));

    const form = reactive({
        name: '',
        desc: '',
        catId: '',
        catName: '',
        subId: '',
        subName: '',
        brandId: '',
        price: 0,
        oldPrice: 0,
    });

    const rules = reactive<FormRules>({
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        catId: [{ required: true, message: '请选择一级分类', trigger: 'change' }],
        subId: [{ required: true, message: '请选择二级分类', trigger: 'change' }],
        brandId: [{ required: true, message: '请选择品牌', trigger: 'change' }],
        price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
    });

    const subOptions = computed<any[]>(() => categoryTree.value.find((item: any) => item.id === form.catId)?.children ?? []);

    function onCatChange(catId: string) {
        form.subId = '';
        form.catName = categoryTree.value.find((item) => item.id === catId)?.name ?? '';
    }

    async function getDetail() {
        const result = await getAdminGoodsByIdAPI(String(route.params.id)) as any;
        goods.value = result.result;
        form.name = result.result.name;
        form.desc = result.result.desc;
        form.catId = result.result.catId;
        form.catName = result.result.catName;
        form.subId = result.result.subId;
        form.brandId = result.result.brandId;
        form.price = Number(result.result.price);
        form.oldPrice = Number(result.result.oldPrice);
    }

    async function getOptions() {
        const [cats, brands] = await Promise.all([getCategoryTreeAPI(), getBrandListAPI()] as any[]);
        categoryTree.value = cats.result;
        brandList.value = brands.result;
    }

    async function save() {
        const valid = await formRef.value?.validate().catch(() => false);
        if (!valid) return;
        saving.value = true;
        try {
            if (isEdit.value) {
                await updateAdminGoodsAPI(goods.value.id, {
                    name: form.name,
                    desc: form.desc,
                    price: String(form.price),
                    oldPrice: String(form.oldPrice),
                });
                ElMessage.success('商品已保存');
            } else {
                const sub = subOptions.value.find((item) => item.id === form.subId);
                await createAdminGoodsAPI({
                    name: form.name,
                    desc: form.desc,
                    catId: form.catId,
                    catName: form.catName,
                    subId: form.subId,
                    subName: sub?.name ?? '',
                    brandId: form.brandId,
                    price: String(form.price),
                    oldPrice: String(form.oldPrice),
                });
                ElMessage.success('商品已创建并上架');
            }
            router.replace('/goods/list');
        } finally {
            saving.value = false;
        }
    }

    onMounted(async () => {
        await getOptions();
        if (isEdit.value) await getDetail();
    });
</script>

<style scoped lang="scss">
    .goods-edit {
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

            .back {
                width: 38px;
                height: 38px;
            }
            h2 {
                font-size: 18px;
                font-weight: 600;
                color: $inkColor;
            }
            .sub {
                margin-top: 4px;
                font-size: 13px;
                color: $inkColor3;
            }
        }
    }
    .form-body {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }
    .form-card {
        padding: 20px 24px 24px;

        .card-head {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            margin-bottom: 18px;

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
                font-size: 12px;
                color: $inkColor3;
            }
        }
    }
    .cat-selects {
        display: flex;
        gap: 10px;
    }
    .form-tip {
        margin-top: 4px;
        font-size: 12px;
        color: $inkColor3;

        &.inline {
            margin: 0 0 0 10px;
        }
    }
    .pic-list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;

        .pic {
            position: relative;
            width: 110px;
            height: 110px;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid $lineColor;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                background: #f5f6f8;
            }
            .badge {
                position: absolute;
                left: 0;
                top: 0;
                padding: 2px 8px;
                font-size: 11px;
                color: #fff;
                background: rgba(239, 95, 42, 0.92);
                border-radius: 0 0 8px 0;
            }
        }
    }
</style>
