<template>
    <div class="SubCategoryGoods">
        <div class="head">
            <p class="label">排序方式</p>
            <el-tabs v-model="requestData.sortField" class="demo-tabs" @tab-change="tabChange">
                <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
                <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
                <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
            </el-tabs>
        </div>
        <!-- 无线加载v-infinite-scroll -->
        <div class="goods" v-infinite-scroll="road" :infinite-scroll-disabled="disabled">
            <ul>
                <li v-for="item in subCategoryList.items" :key="item.id">
                    <GoodsItem :goods="item"/>
                </li>
            </ul>
            <el-empty v-if="disabled && !subCategoryList.items?.length" description="这个分类下暂时没有商品" />
        </div>
    </div>
</template>

<script setup lang="ts" name="SubCategoryGoods">
    import GoodsItem from '@/components/GoodsItem.vue'
    import {useSubCategoryStore} from '@/stores/subCategoryStore.ts'
    import {storeToRefs} from 'pinia'
    import {getSubCategoryAPI} from '@/apis/subCategory.ts'
    import {ref} from 'vue'
    const disabled = ref(false);
    const SubCategoryStore = useSubCategoryStore();
    const {subCategoryList, requestData} = storeToRefs(SubCategoryStore);
    function tabChange() {
        // 切换排序以后重置页数
        requestData.value.page = 1; 
        // 渲染新数据到页面
        SubCategoryStore.getSubCategory();
    }
    async function road() {
        requestData.value.page++;
        const result = await getSubCategoryAPI(requestData.value) as any;
        if(result.result.page >= result.result.pages) {
            disabled.value = true;
        }
        subCategoryList.value.items = [...subCategoryList.value.items || [], ...result.result.items];
    }
</script>

<style scoped lang="scss">
    .SubCategoryGoods {
        background-color: #fff;
        border-radius: 16px;
        box-shadow: $shadowSm;
        padding: 18px 26px 30px;

        .head {
            display: flex;
            align-items: center;
            border-bottom: 1px solid $lineColor;

            .label {
                margin-right: 12px;
                font-size: 13px;
                color: $inkColor3;
            }
            .demo-tabs {
                flex: 1;

                :deep(.el-tabs__header) {
                    margin: 0;
                }
                :deep(.el-tabs__nav-wrap::after) {
                    display: none;
                }
                :deep(.el-tabs__item) {
                    height: 54px;
                    line-height: 54px;
                    font-size: 14px;
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
        }
        .goods {
            width: 100%;
            margin-top: 22px;

            ul {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 16px;

                li {
                    :deep(a) {
                        display: block;
                        position: relative;
                        top: 0px;
                        padding: 16px 24px 22px;
                        text-align: center;
                        border-radius: 14px;
                        background: #fafbfc;
                        transition: all 0.3s ease;

                        &:hover {
                            top: -4px;
                            background: #fff;
                            box-shadow: 0 12px 26px rgba(35, 40, 56, 0.1);
                        }
                    }
                    :deep(a .info h4) {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                    :deep(a .info p) {
                        color: $inkColor3;
                        font-size: 13px;
                    }
                }
            }
        }
    }
</style>
