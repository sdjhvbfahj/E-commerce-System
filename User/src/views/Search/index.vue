<template>
    <div class="search-page">
        <div class="container">
            <!-- 面包屑 -->
            <div class="breadcrumb">
                <el-breadcrumb :separator-icon="ArrowRight">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>搜索结果</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <!-- 搜索条 + 结果统计 -->
            <div class="search-head">
                <div class="search-box">
                    <i class="iconfont icon-sousuo"></i>
                    <input
                        type="text"
                        v-model="inputKeyword"
                        placeholder="搜一搜：车厘子 / 收纳箱 / 蓝牙耳机"
                        @keyup.enter="search(inputKeyword)"
                    >
                    <button type="button" @click="search(inputKeyword)">搜索</button>
                </div>
                <p class="result-tip" v-if="keyword">
                    找到 <b>{{ result.counts }}</b> 件与「<i>{{ keyword }}</i>」相关的商品
                </p>
            </div>

            <!-- 命中的分类：一键跳过去 -->
            <div class="cat-hits" v-if="result.categories?.length">
                <span class="label">相关分类</span>
                <RouterLink
                    v-for="item in result.categories"
                    :key="item.id"
                    :to="item.href"
                    class="hit"
                >
                    <template v-if="item.parentName">{{ item.parentName }} · </template>{{ item.name }}
                    <i class="iconfont icon-jinru"></i>
                </RouterLink>
            </div>

            <!-- 结果列表 -->
            <div class="result-panel" v-if="result.items?.length">
                <ul class="goods">
                    <li v-for="item in result.items" :key="item.id">
                        <GoodsItem :goods="item"/>
                    </li>
                </ul>
                <div class="pager" v-if="result.pages > 1">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="result.counts"
                        :page-size="result.pageSize"
                        :current-page="result.page"
                        @current-change="changePage"
                    />
                </div>
            </div>

            <!-- 空状态 -->
            <div class="empty-panel" v-else>
                <el-empty :description="keyword ? `没有找到与「${keyword}」相关的商品` : '输入关键词，开始找好物'">
                    <div class="suggests" v-if="result.suggests?.length">
                        <span class="label">换个词试试</span>
                        <a href="javascript:;" v-for="word in result.suggests" :key="word" @click="search(word)">{{ word }}</a>
                    </div>
                    <div class="hot-cats">
                        <RouterLink v-for="item in hotCategories" :key="item.id" :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
                    </div>
                </el-empty>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Search">
    import { computed, onMounted, ref, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { ArrowRight } from '@element-plus/icons-vue'
    import { getSearchAPI } from '@/apis/search.ts'
    import { useCategoryStore } from '@/stores/categoryStore'

    const route = useRoute();
    const router = useRouter();
    const categoryStore = useCategoryStore();

    const inputKeyword = ref('');
    const result = ref<any>({ keyword: '', counts: 0, items: [], categories: [], suggests: [], page: 1, pages: 0, pageSize: 20 });
    const keyword = computed(() => (route.query.keyword as string) || '');
    // 兜底推荐分类（取导航里的前 8 个一级分类）
    const hotCategories = computed(() => categoryStore.categoryList.slice(0, 8));

    async function getSearchResult() {
        const res = await getSearchAPI({
            keyword: keyword.value,
            page: Number(route.query.page) || 1,
            pageSize: 20
        }) as any;
        result.value = res.result;
    }

    /** 发起搜索：把关键词写进地址栏，方便分享和刷新 */
    function search(word?: string) {
        const value = (word ?? inputKeyword.value).trim();
        if (!value) return;
        router.push({ path: '/search', query: { keyword: value } });
    }

    function changePage(page: number) {
        router.push({ path: '/search', query: { keyword: keyword.value, page: String(page) } });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onMounted(() => {
        inputKeyword.value = keyword.value;
        getSearchResult();
    });

    // 关键词或页码变了就重新查
    watch(() => [route.query.keyword, route.query.page], () => {
        inputKeyword.value = keyword.value;
        getSearchResult();
    });
</script>

<style scoped lang="scss">
    .search-page {
        padding: 20px 0 10px;
    }
    .breadcrumb {
        padding: 5px 0 15px;
    }
    /* 顶部搜索条 */
    .search-head {
        background-color: #fff;
        border-radius: 14px;
        box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);
        padding: 24px 30px;

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
                padding: 0 30px;
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
        .result-tip {
            margin-top: 16px;
            font-size: 14px;
            color: $inkColor2;

            b {
                padding: 0 3px;
                font-weight: 600;
                color: $brandColor;
            }
            i {
                font-style: normal;
                color: $inkColor;
            }
        }
    }
    /* 命中的分类 */
    .cat-hits {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;

        .label {
            font-size: 13px;
            color: $inkColor3;
        }
        .hit {
            display: inline-flex;
            align-items: center;
            height: 32px;
            padding: 0 14px;
            border-radius: 16px;
            font-size: 13px;
            color: $inkColor2;
            background: #fff;
            box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);
            transition: all 0.25s;

            .iconfont {
                margin-left: 4px;
                font-size: 12px;
            }
            &:hover {
                color: #fff;
                background: $brandColor;
            }
        }
    }
    /* 结果面板 */
    .result-panel {
        margin-top: 16px;
        background-color: #fff;
        border-radius: 14px;
        box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);
        padding: 26px 28px 10px;

        .goods {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 16px;

            li {
                :deep(a) {
                    display: block;
                    padding: 16px 24px 22px;
                    text-align: center;
                    border-radius: 14px;
                    background: #fafbfc;
                    transition: all 0.3s ease;

                    &:hover {
                        background: #fff;
                        box-shadow: 0 12px 26px rgba(35, 40, 56, 0.1);
                        transform: translateY(-4px);
                    }
                }
                :deep(a .info h4) {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                :deep(a .info p) {
                    color: $inkColor3;
                    font-size: 13px;
                }
            }
        }
        .pager {
            display: flex;
            justify-content: center;
            padding: 26px 0 16px;
        }
    }
    /* 空状态 */
    .empty-panel {
        margin-top: 16px;
        background-color: #fff;
        border-radius: 14px;
        box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);
        padding: 30px 20px 40px;

        .suggests {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 22px;

            .label {
                font-size: 13px;
                color: $inkColor3;
            }
            a {
                padding: 5px 14px;
                border-radius: 15px;
                font-size: 13px;
                color: $inkColor2;
                background: #f5f6f8;

                &:hover {
                    color: #fff;
                    background: $brandColor;
                }
            }
        }
        .hot-cats {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px;

            a {
                font-size: 13px;
                color: $brandColor;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
