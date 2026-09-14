<template>
    <div class="LayoutHeader">
        <div class="wrapper">
            <!-- logo -->
            <div class="logo">
                <h1><RouterLink to="/">小兔鲜儿</RouterLink></h1>
            </div>
            <LayoutHeaderUI/>
            <!-- 搜索 -->
            <div class="search">
                <i class="iconfont icon-sousuo"></i>
                <input type="text" placeholder="搜一搜">
            </div>
            <!-- 购物车 -->
            <HeaderCart/>
        </div>
    </div>
</template>

<script setup lang="ts" name="LayoutHeader">
    import LayoutHeaderUI from './LayoutHeaderUI.vue';
    import HeaderCart from './HeaderCart.vue'
</script>

<style scoped lang="scss">
    .LayoutHeader {
        width: 100%;
        height: 132px;
        background-color: #fff;
    }
    .wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 1240px;
        margin: 0px auto;
        height: 100%;
    }
    .logo h1 a {
        font-size: 0px;
        display: block;
        width: 200px;
        height: 88px;
        background-image: url(@/assets/images/logo.png);
        background-size: contain;
        background-repeat: no-repeat;
    }
    .search {
        display: flex;
        border-bottom: 2px solid #f4f4f4;
        width: 170px;
        height: 28px;
    }
    .search .iconfont {
        color: #333;
        font-size: 22px;
    }
    .search input {
        margin-left: 6px;
        width: 0px;
        flex: 1;
        border: 0px;
        outline: none;
    }
    .search input::placeholder {
        color: #ccc;
        font-size: 14px;
    }
</style>