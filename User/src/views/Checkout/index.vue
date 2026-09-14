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
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);
            padding: 0 28px 10px;
        }
    }
</style>