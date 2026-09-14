<template>
    <div class="cart wrapper">
        <CartList/>
    </div>
</template>

<script setup lang="ts" name="Cart">
    import CartList from './components/CartList.vue'
</script>

<style scoped lang="scss">
    .wrapper {
        width: 1240px;
        margin: 0px auto;
    }
</style>