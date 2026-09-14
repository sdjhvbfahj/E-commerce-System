<template>
  <div class="xtx-pay-page">
    <div class="container">
        <!-- 付款信息 -->
        <PayInfo :payInfo :getOrderInfo/>
        <!-- 付款方式 -->
        <PayType :payInfo/>
    </div>
  </div>
</template>

<script setup lang="ts" name="Pay">
    import PayInfo from './components/PayInfo.vue'
    import PayType from './components/PayType.vue'
    import {getOrderInfoAPI} from '@/apis/pay.ts'
    import type {OrderDetails} from '@/apis/pay.ts'
    import {ref} from 'vue'
    // 获得订单详细信息
    const payInfo = ref<OrderDetails>({} as OrderDetails);
    async function getOrderInfo(id:string) {
        const result = await getOrderInfoAPI(id) as any;
        payInfo.value = result.result;
    }
</script>

<style scoped lang="scss">
    .xtx-pay-page {
        margin-top: 20px;
    }
</style>