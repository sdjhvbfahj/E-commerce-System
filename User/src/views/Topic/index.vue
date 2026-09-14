<template>
    <div class="topic-page">
        <div class="container">
            <!-- 面包屑 -->
            <div class="breadcrumb">
                <el-breadcrumb :separator-icon="ArrowRight">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>专题活动</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <!-- 头部 -->
            <div class="intro">
                <h2>专题活动</h2>
                <p>换季焕新、厨房升级、通勤装备……我们把同一类需求里的好物挑出来放在一起，省得你反复纠结。</p>
            </div>

            <!-- 专题列表 -->
            <ul class="topic-list">
                <li v-for="topic in topicList" :key="topic.id">
                    <RouterLink class="cover" :to="topic.href">
                        <img v-img-lazy="topic.cover" :alt="topic.title">
                        <span class="tag">{{ topic.tag }}</span>
                    </RouterLink>

                    <div class="content">
                        <h3>{{ topic.title }}</h3>
                        <p class="subtitle">{{ topic.subtitle }}</p>
                        <p class="desc">{{ topic.desc }}</p>

                        <div class="goods">
                            <RouterLink v-for="goods in topic.goods" :key="goods.id" :to="`/detail/${goods.id}`">
                                <img v-img-lazy="goods.picture" :alt="goods.name">
                                <p class="g-name ellipsis">{{ goods.name }}</p>
                                <p class="g-price">¥{{ goods.price }}</p>
                            </RouterLink>
                        </div>

                        <div class="actions">
                            <el-button type="primary" @click="router.push(topic.href)">
                                进入专场<i class="iconfont icon-jinru"></i>
                            </el-button>
                            <span class="tip">专场内商品均参与活动</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts" name="Topic">
    import { onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { ArrowRight } from '@element-plus/icons-vue'
    import { getTopicAPI } from '@/apis/content.ts'

    const router = useRouter();
    const topicList = ref<any[]>([]);

    async function getTopicList() {
        const result = await getTopicAPI() as any;
        topicList.value = result.result;
    }

    onMounted(() => {
        getTopicList();
    });
</script>

<style scoped lang="scss">
    .topic-page {
        padding-top: 20px;
    }
    .breadcrumb {
        padding: 5px 0 15px;
    }
    .intro {
        background-color: #fff;
        border-radius: 4px;
        padding: 30px 40px;

        h2 {
            font-size: 26px;
            font-weight: 400;
            color: #333;
        }
        p {
            margin-top: 10px;
            font-size: 14px;
            color: #999;
        }
    }
    .topic-list {
        margin-top: 20px;

        > li {
            display: flex;
            gap: 28px;
            background-color: #fff;
            border-radius: 4px;
            padding: 24px;
            margin-bottom: 18px;
            transition: box-shadow 0.3s;

            &:hover {
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);

                .cover img {
                    transform: scale(1.04);
                }
            }
        }
        .cover {
            position: relative;
            width: 380px;
            height: 240px;
            flex-shrink: 0;
            border-radius: 4px;
            overflow: hidden;
            background: #eee;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.5s;
            }
            .tag {
                position: absolute;
                left: 12px;
                top: 12px;
                padding: 4px 12px;
                font-size: 12px;
                color: #fff;
                background: rgba(39, 186, 155, 0.92);
                border-radius: 12px;
            }
        }
        .content {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;

            h3 {
                font-size: 22px;
                font-weight: 400;
                color: #333;
            }
            .subtitle {
                margin-top: 6px;
                font-size: 14px;
                color: $xtxColor;
            }
            .desc {
                margin-top: 10px;
                font-size: 14px;
                line-height: 24px;
                color: #999;
            }
            .goods {
                display: flex;
                gap: 12px;
                margin-top: 16px;

                a {
                    width: 128px;
                    text-align: center;
                    padding: 8px;
                    border-radius: 4px;
                    transition: background 0.3s;

                    img {
                        width: 96px;
                        height: 96px;
                        object-fit: cover;
                        border-radius: 4px;
                    }
                    .g-name {
                        margin-top: 8px;
                        font-size: 12px;
                        color: #666;
                    }
                    .g-price {
                        margin-top: 4px;
                        font-size: 14px;
                        color: $priceColor;
                    }
                    &:hover {
                        background: #f7fbfa;
                    }
                }
            }
            .actions {
                display: flex;
                align-items: center;
                gap: 14px;
                margin-top: auto;
                padding-top: 18px;

                .iconfont {
                    font-size: 12px;
                    margin-left: 2px;
                }
                .tip {
                    font-size: 12px;
                    color: #bbb;
                }
            }
        }
    }
</style>
