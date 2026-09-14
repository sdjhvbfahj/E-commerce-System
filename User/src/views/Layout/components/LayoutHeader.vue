<template>
    <div class="LayoutHeader">
        <div class="wrapper">
            <!-- logo -->
            <div class="logo">
                <h1><RouterLink to="/">621电商 · 好物优选 快速直达</RouterLink></h1>
            </div>
            <!-- 搜索：新排版把它放大到中间，带热词 -->
            <div class="search">
                <div class="search-box">
                    <i class="iconfont icon-sousuo"></i>
                    <input type="text" v-model="keyword" placeholder="搜一搜：车厘子 / 蓝牙耳机 / 瑜伽垫" @keyup.enter="doSearch">
                    <button type="button" @click="doSearch">搜索</button>
                </div>
                <div class="hotwords">
                    <span class="label">热门</span>
                    <RouterLink v-for="item in hotwords" :key="item.name" :to="item.path">{{ item.name }}</RouterLink>
                </div>
            </div>
            <!-- 购物车 -->
            <HeaderCart/>
        </div>
    </div>
    <!-- 分类导航单独一行（原来是挤在头部一行的） -->
    <div class="LayoutNavBar">
        <div class="wrapper">
            <LayoutHeaderUI/>
        </div>
    </div>
</template>

<script setup lang="ts" name="LayoutHeader">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import LayoutHeaderUI from './LayoutHeaderUI.vue';
    import HeaderCart from './HeaderCart.vue'

    const router = useRouter();
    const keyword = ref('');

    // 热门搜索词：直接跳到搜索结果页
    const hotwords = ['车厘子', '蓝牙耳机', '瑜伽垫', '收纳箱'].map((word) => ({
        name: word,
        path: `/search?keyword=${encodeURIComponent(word)}`,
    }));

    /**
     * 搜索：直接把关键词交给搜索结果页，
     * 那边会同时匹配商品名、分类名、卖点和品牌（见 mock 的 /search 接口）
     */
    function doSearch() {
        const value = keyword.value.trim();
        if (!value) return;
        router.push({ path: '/search', query: { keyword: value } });
    }
</script>

<style scoped lang="scss">
    .LayoutHeader {
        width: 100%;
        height: 104px;
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
        width: 210px;
        height: 72px;
        background-image: url(@/assets/images/logo.svg);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: left center;
    }
    /* 搜索区 */
    .search {
        flex: 1;
        max-width: 620px;
        margin: 0 40px;
    }
    .search-box {
        display: flex;
        align-items: center;
        height: 46px;
        padding-left: 18px;
        border-radius: 23px;
        background: #f5f6f8;
        border: 1px solid transparent;
        transition: all 0.25s;

        .iconfont {
            font-size: 18px;
            color: $inkColor3;
        }
        input {
            flex: 1;
            height: 100%;
            margin: 0 12px;
            background: transparent;
            font-size: 14px;
            color: $inkColor;
        }
        button {
            height: 46px;
            padding: 0 28px;
            border: none;
            cursor: pointer;
            border-radius: 23px;
            font-size: 15px;
            color: #fff;
            background: $brandColor;
            transition: background 0.25s;

            &:hover {
                background: $brandColorDark;
            }
        }
        &:focus-within {
            background: #fff;
            border-color: $brandColor;
            box-shadow: 0 0 0 3px rgba(239, 95, 42, 0.12);
        }
    }
    .hotwords {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 8px;
        padding-left: 18px;
        font-size: 12px;

        .label {
            margin-right: 10px;
            color: $inkColor3;
        }
        a {
            margin-right: 14px;
            color: $inkColor2;

            &:hover {
                color: $brandColor;
            }
        }
    }
    /* 分类导航行 */
    .LayoutNavBar {
        width: 100%;
        height: 56px;
        background-color: #fff;
        border-bottom: 1px solid $lineColor;
    }
    .LayoutNavBar .wrapper {
        display: flex;
        align-items: center;
        height: 100%;
    }
</style>
