<template>
    <div class="SubCategoryGoods">
        <el-tabs v-model="requestData.sortField" class="demo-tabs" @tab-change="tabChange">
            <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
            <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
            <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
        </el-tabs>
        <!-- 无线加载v-infinite-scroll -->
        <div class="goods" v-infinite-scroll="road" :infinite-scroll-disabled="disabled">
            <ul>
                <li v-for="item in subCategoryList.items" :key="item.id">
                    <GoodsItem :goods="item"/>
                </li>
            </ul>
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
        padding: 10px 25px;
        .demo-tabs > .el-tabs__content {
            padding: 32px;
            color: #6b778c;
            font-size: 32px;
            font-weight: 600;
        }
        .goods {
            width: 100%;
            margin-top: 20px;
            ul {
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                li {
                    margin: 0px 9px;
                    width: 220px;
                    height: 300px;
                    :deep(a) {
                        position: relative;
                        top: 0px;
                        padding: 15px 30px;
                        text-align: center;
                        transition: all 0.3s;
                        &:hover {
                            top: -3px;
                            box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.2);
                        }
                    }
                    :deep(a .info h4) {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                    :deep(a .info p) {
                        color: #999;
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>