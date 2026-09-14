<template>
    <!-- 首屏：整块轮播，左侧分类悬浮在轮播上（原来的样子，配色用新的） -->
    <div class="container wrapper">
        <HomeCategory/>
        <HomeBanner/>
    </div>
    <!-- 中间两个板块 -->
    <div class="mid">
        <div class="wrapper">
            <HomeNew/>
            <HomeHot/>
        </div>
    </div>
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
    .mid {
        padding-top: 20px;

        .wrapper {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
    }
</style>
