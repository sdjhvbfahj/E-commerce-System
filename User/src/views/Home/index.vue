<template>
    <!-- 首屏：整块轮播，左侧分类悬浮在轮播上（原来的样子，配色用新的） -->
    <div class="container wrapper">
        <HomeCategory/>
        <HomeBanner/>
    </div>
    <!-- 下面每个板块都是「整块白底 + 内层 wrapper 居中」 -->
    <HomeNew/>
    <HomeHot/>
    <HomeBrand/>
    <HomeTopic/>
    <HomeProduct/>
</template>

<script setup lang="ts" name="Home">
    import HomeCategory from './components/HomeCategory.vue'
    import HomeBanner from './components/HomeBanner.vue'
    import HomeProduct from './components/HomeProduct.vue'
    import HomeTopic from './components/HomeTopic.vue'
    import HomeBrand from './components/HomeBrand.vue'
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
