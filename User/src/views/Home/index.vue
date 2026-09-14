<template>
    <!-- 首屏：左边分类（白卡片） + 右边轮播（原版是分类压在轮播上的绝对定位） -->
    <div class="hero">
        <div class="wrapper">
            <div class="hero-aside">
                <HomeCategory/>
            </div>
            <div class="hero-main">
                <HomeBanner/>
            </div>
        </div>
    </div>

    <!-- 中间商品区 -->
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
    .hero {
        padding-top: 22px;

        .wrapper {
            display: flex;
            align-items: stretch;
            gap: 18px;
        }
    }
    .hero-aside {
        width: 244px;
        flex-shrink: 0;
        position: relative;
        z-index: 2;
    }
    .hero-main {
        flex: 1;
        min-width: 0;
        position: relative;
        z-index: 1;
    }
    .mid {
        padding-top: 10px;

        .wrapper {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
    }
</style>
