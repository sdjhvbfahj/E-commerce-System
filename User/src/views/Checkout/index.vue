<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->
        <CheckoutAddress :curAddress :checkInfo :reviseCurAddress :addNewAddress :getOrderInfo/>
        <!-- 商品信息 -->
        <CheckoutGoodsInfo :checkInfo/>
        <!-- 剩余配送信息 -->
        <CheckoutPaySettings :checkInfo :curAddress/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Checkout">
    import {useCheckout} from './composables/useCheckout'
    import CheckoutAddress from './components/CheckoutAddress.vue'
    import CheckoutGoodsInfo from './components/CheckoutGoodsInfo.vue'
    import CheckoutPaySettings from './components/CheckoutPaySettings.vue'
    const {checkInfo, curAddress, reviseCurAddress, getOrderInfo, addNewAddress} = useCheckout();
</script>

<style scoped lang="scss">
    .xtx-pay-checkout-page {
        margin-top: 20px;
        .wrapper {
            background: #fff;
            padding: 0 20px;
        }
    }
</style>