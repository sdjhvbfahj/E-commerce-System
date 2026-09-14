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
    import { ElMessage } from 'element-plus'
    import LayoutHeaderUI from './LayoutHeaderUI.vue';
    import HeaderCart from './HeaderCart.vue'
    import { useCategoryStore } from '@/stores/categoryStore'
    import { catIdOf } from '@/mock/data/ids'

    const router = useRouter();
    const categoryStore = useCategoryStore();
    const keyword = ref('');

    // 热词直接指向真实分类，点了就能用
    const hotwords = [
        { name: '车厘子', path: `/category/${catIdOf(1)}` },
        { name: '蓝牙耳机', path: `/category/${catIdOf(6)}` },
        { name: '瑜伽垫', path: `/category/${catIdOf(7)}` },
        { name: '母婴', path: `/category/${catIdOf(3)}` },
    ];

    /**
     * 项目里没有搜索接口，这里按分类名做一次本地匹配后跳到对应分类页，
     * 匹配不到就给个提示，避免点了搜索没有任何反馈
     */
    function doSearch() {
        const value = keyword.value.trim();
        if (!value) return;
        const cat = categoryStore.categoryList.find(
            (item) => item.name.includes(value) || value.includes(item.name)
        );
        if (cat) {
            router.push(`/category/${cat.id}`);
            return;
        }
        for (const item of categoryStore.categoryList) {
            const sub = (item.children ?? []).find(
                (child) => child.name.includes(value) || value.includes(child.name)
            );
            if (sub) {
                router.push(`/category/sub/${sub.id}`);
                return;
            }
        }
        ElMessage({ message: `没有找到与「${value}」相关的分类，换个关键词试试`, type: 'info' });
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
