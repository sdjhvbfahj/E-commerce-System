<template>
    <div class="help-page">
        <div class="container">
            <!-- 面包屑 -->
            <div class="breadcrumb">
                <el-breadcrumb :separator-icon="ArrowRight">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>帮助中心</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="currentSection">{{ currentSection.name }}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <div class="layout">
                <!-- 左侧栏目 -->
                <aside class="aside">
                    <h3>帮助中心</h3>
                    <ul class="menu">
                        <li v-for="item in sections" :key="item.id">
                            <a href="javascript:;" :class="{active: item.id === activeId}" @click="switchSection(item.id)">
                                {{ item.name }}
                                <i class="iconfont icon-jinru"></i>
                            </a>
                        </li>
                    </ul>
                    <div class="contact">
                        <p class="title">没找到想要的答案？</p>
                        <p class="phone">{{ helpData?.servicePhone }}</p>
                        <p class="time">{{ helpData?.serviceTime }}</p>
                        <el-button type="primary" size="small" @click="router.push('/about')">联系我们</el-button>
                    </div>
                </aside>

                <!-- 右侧内容 -->
                <main class="main">
                    <!-- 热门问题 -->
                    <div class="hot">
                        <span class="label">热门搜索</span>
                        <a href="javascript:;" v-for="item in helpData?.hotLines" :key="item" @click="hotSearch(item)">{{ item }}</a>
                    </div>

                    <!-- 搜索框 -->
                    <div class="search">
                        <el-input v-model="keyword" :placeholder="`在「${currentSection?.name || '帮助中心'}」中搜索`" clearable>
                            <template #prefix>
                                <i class="iconfont icon-sousuo"></i>
                            </template>
                        </el-input>
                    </div>

                    <h2>{{ currentSection?.name }}</h2>
                    <p class="desc">{{ currentSection?.desc }}</p>

                    <!-- 问答列表 -->
                    <el-collapse v-if="filteredArticles.length" v-model="activeNames" class="faq">
                        <el-collapse-item v-for="item in filteredArticles" :key="item.id" :name="item.id">
                            <template #title>
                                <span class="q">{{ item.question }}</span>
                            </template>
                            <p class="a">{{ item.answer }}</p>
                        </el-collapse-item>
                    </el-collapse>

                    <!-- 友情链接 -->
                    <div class="links" v-if="currentSection?.links?.length">
                        <a class="link-card" v-for="item in currentSection.links" :key="item.name" :href="item.url">
                            <h4>{{ item.name }}</h4>
                            <p>{{ item.desc }}</p>
                            <span class="go">去看看<i class="iconfont icon-jinru"></i></span>
                        </a>
                    </div>

                    <!-- 空状态 -->
                    <el-empty v-if="!filteredArticles.length && !currentSection?.links?.length" description="没有找到相关的问题，换个关键词试试" />

                    <!-- 服务承诺 -->
                    <div class="promise">
                        <div class="item" v-for="item in promises" :key="item.title">
                            <i class="iconfont" :class="item.icon"></i>
                            <div>
                                <h4>{{ item.title }}</h4>
                                <p>{{ item.desc }}</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Help">
    import { computed, onMounted, ref, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { ArrowRight } from '@element-plus/icons-vue'
    import { getHelpAPI } from '@/apis/content.ts'

    interface HelpArticle { id: string; question: string; answer: string }
    interface HelpLink { name: string; desc: string; url: string }
    interface HelpSection { id: string; name: string; desc: string; articles: HelpArticle[]; links?: HelpLink[] }
    interface HelpData {
        sections: HelpSection[]
        hotLines: string[]
        servicePhone: string
        serviceTime: string
    }

    const route = useRoute();
    const router = useRouter();

    const helpData = ref<HelpData>();
    const activeId = ref('help');
    const keyword = ref('');
    const activeNames = ref<string[]>([]);

    // 服务承诺，和首页底部保持一致
    const promises = [
        { icon: 'icon-queren-', title: '七天无理由退换', desc: '签收后 7 天内可申请退换货' },
        { icon: 'icon-dw', title: '破损包赔', desc: '生鲜与易碎品破损无需寄回' },
        { icon: 'icon-countdown_timer', title: '48 小时发货', desc: '现货商品支付后 24 小时内发出' },
        { icon: 'icon-duihua', title: '在线客服', desc: '周一至周日 8:00-18:00 在线' },
    ];

    const sections = computed(() => helpData.value?.sections ?? []);
    const currentSection = computed(() => sections.value.find((item) => item.id === activeId.value));
    const filteredArticles = computed(() => {
        const list = currentSection.value?.articles ?? [];
        const kw = keyword.value.trim();
        if (!kw) return list;
        return list.filter((item) => item.question.includes(kw) || item.answer.includes(kw));
    });

    /** 切换栏目（同步到地址栏，方便直接分享链接） */
    function switchSection(id: string) {
        activeId.value = id;
        keyword.value = '';
        activeNames.value = [];
        router.replace({ path: '/help', query: { type: id } });
    }

    function hotSearch(text: string) {
        keyword.value = text.replace(/[？?]/g, '');
    }

    async function getHelpData() {
        const result = await getHelpAPI() as any;
        helpData.value = result.result;
        // 地址栏带 type 时定位到对应栏目，否则默认第一个
        const type = (route.query.type as string) || sections.value[0]?.id || 'help';
        activeId.value = sections.value.some((item) => item.id === type) ? type : sections.value[0]?.id || 'help';
    }

    onMounted(() => {
        getHelpData();
    });

    // 支持从 footer 的不同链接直接跳到对应栏目
    watch(() => route.query.type, (value) => {
        if (typeof value === 'string' && sections.value.some((item) => item.id === value)) {
            activeId.value = value;
            keyword.value = '';
        }
    });
</script>

<style scoped lang="scss">
    .help-page {
        padding-top: 20px;
    }
    .breadcrumb {
        padding: 5px 0 15px;
    }
    .layout {
        display: flex;
        gap: 20px;
        padding-bottom: 20px;
    }
    /* 左侧栏目 */
    .aside {
        width: 240px;
        flex-shrink: 0;
        background-color: #fff;
        border-radius: 4px;
        padding-bottom: 20px;
        height: fit-content;

        h3 {
            font-size: 18px;
            font-weight: 400;
            padding: 22px 30px 14px;
            border-bottom: 1px solid #f5f5f5;
            color: #333;
        }
        .menu {
            padding: 10px 0;

            a {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 30px;
                line-height: 46px;
                font-size: 15px;
                color: #666;

                .iconfont {
                    font-size: 13px;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                &:hover,
                &.active {
                    color: $xtxColor;
                    background: #f3fbf9;

                    .iconfont {
                        opacity: 1;
                    }
                }
            }
        }
        .contact {
            margin: 10px 20px 0;
            padding: 18px 16px;
            background: #f0faf7;
            border-radius: 4px;
            text-align: center;

            .title {
                font-size: 13px;
                color: #666;
            }
            .phone {
                margin-top: 6px;
                font-size: 20px;
                color: $xtxColor;
                font-weight: 600;
            }
            .time {
                margin: 4px 0 12px;
                font-size: 12px;
                color: #999;
            }
        }
    }
    /* 右侧内容 */
    .main {
        flex: 1;
        min-width: 0;
        background-color: #fff;
        border-radius: 4px;
        padding: 24px 30px 34px;

        .hot {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            padding-bottom: 16px;
            border-bottom: 1px dashed #eee;

            .label {
                font-size: 13px;
                color: #999;
            }
            a {
                font-size: 13px;
                color: #666;
                padding: 4px 10px;
                background: #f5f5f5;
                border-radius: 12px;

                &:hover {
                    color: #fff;
                    background: $xtxColor;
                }
            }
        }
        .search {
            width: 420px;
            margin-top: 20px;

            :deep(.iconfont) {
                font-size: 16px;
                color: #999;
            }
        }
        h2 {
            margin-top: 26px;
            font-size: 24px;
            font-weight: 400;
            color: #333;
        }
        .desc {
            margin-top: 8px;
            font-size: 14px;
            color: #999;
        }
        .faq {
            margin-top: 20px;
            border-top: none;

            :deep(.el-collapse-item__header) {
                height: auto;
                min-height: 52px;
                line-height: 24px;
                padding: 14px 0;
                font-size: 15px;
                border-bottom: 1px solid #f5f5f5;
            }
            :deep(.el-collapse-item__wrap) {
                border-bottom: 1px solid #f5f5f5;
            }
            .q {
                color: #333;
            }
            .a {
                padding: 4px 0 18px;
                font-size: 14px;
                line-height: 26px;
                color: #666;
            }
            :deep(.el-collapse-item__header.is-active .q) {
                color: $xtxColor;
            }
        }
        .links {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-top: 22px;

            .link-card {
                width: 250px;
                padding: 20px;
                border: 1px solid #f0f0f0;
                border-radius: 4px;
                transition: all 0.3s;

                h4 {
                    font-size: 16px;
                    font-weight: 400;
                    color: #333;
                }
                p {
                    margin-top: 8px;
                    font-size: 13px;
                    color: #999;
                    line-height: 22px;
                    min-height: 44px;
                }
                .go {
                    font-size: 13px;
                    color: $xtxColor;

                    .iconfont {
                        font-size: 12px;
                        margin-left: 2px;
                    }
                }
                &:hover {
                    border-color: $xtxColor;
                    box-shadow: 0 4px 12px rgba(39, 186, 155, 0.12);
                }
            }
        }
        .promise {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            padding: 22px 24px;
            background: #fafafa;
            border-radius: 4px;

            .item {
                display: flex;
                align-items: center;
                gap: 12px;

                .iconfont {
                    font-size: 26px;
                    color: $xtxColor;
                }
                h4 {
                    font-size: 15px;
                    font-weight: 400;
                    color: #333;
                }
                p {
                    margin-top: 4px;
                    font-size: 12px;
                    color: #999;
                }
            }
        }
    }
</style>
