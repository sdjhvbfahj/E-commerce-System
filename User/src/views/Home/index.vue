<template>
    <div class="container wrapper">
        <HomeCategory/>
        <HomeBanner/>
    </div>
    <HomeNew/>
    <HomeHot/>
    <HomeProduct/>
</template>

<script setup lang="ts" name="Home">
    import HomeCategory from './components/HomeCategory.vue'
    import HomeBanner from './components/HomeBanner.vue'
    import HomeProduct from './components/HomeProduct.vue'
    import HomeHot from './components/HomeHot.vue'
    import HomeNew from './components/HomeNew.vue';
</script>

<style scoped lang="scss">
    .wrapper {
            width: 1240px;
            margin: 0px auto;
        }
    .container {
        position: relative;
    }
</style>