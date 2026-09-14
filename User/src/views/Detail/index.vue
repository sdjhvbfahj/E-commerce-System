<template>
    <div class="xtx-goods-page">
        <div class="container">
            <DetailBreadcrumb :detailList/>
            <!-- 商品信息 -->
            <div class="info-container">
                <div>
                    <!-- GoodsInfo -->
                    <DetailGoodsInfo :detailList/>
                    <!-- GoodsFooter -->
                    <DetailGoodsFooter :detailList/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Detail">
    import DetailBreadcrumb from './components/DetailBreadcrumb.vue'
    import {useDetail} from './composables/useDetail.ts'
    import DetailGoodsInfo from './components/DetailGoodsInfo.vue'
    import DetailGoodsFooter from './components/DetailGoodsFooter.vue'
    const {detailList} = useDetail();
</script>

<style scoped lang='scss'>

</style>