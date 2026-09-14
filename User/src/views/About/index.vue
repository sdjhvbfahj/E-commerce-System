<template>
    <div class="about-page">
        <div class="container">
            <!-- 面包屑 -->
            <div class="breadcrumb">
                <el-breadcrumb :separator-icon="ArrowRight">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>关于我们</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <!-- 品牌头图 -->
            <section class="hero">
                <img :src="aboutData?.cover" alt="小兔鲜儿">
                <div class="mask">
                    <h1>{{ aboutData?.name }}</h1>
                    <p class="slogan">{{ aboutData?.slogan }}</p>
                    <p class="intro">{{ aboutData?.intro }}</p>
                </div>
            </section>

            <!-- 数据 -->
            <section class="stats">
                <div class="stat" v-for="item in aboutData?.stats" :key="item.label">
                    <p class="value">{{ item.value }}</p>
                    <p class="label">{{ item.label }}</p>
                </div>
            </section>

            <!-- 品牌故事 -->
            <section class="story">
                <div class="text">
                    <h2>{{ aboutData?.story?.title }}</h2>
                    <p v-for="(paragraph, index) in aboutData?.story?.paragraphs" :key="index">{{ paragraph }}</p>
                </div>
                <div class="pic">
                    <img :src="aboutData?.story?.picture" alt="品牌故事">
                </div>
            </section>

            <!-- 我们坚持什么 -->
            <section class="values">
                <h2>我们坚持什么</h2>
                <ul>
                    <li v-for="item in aboutData?.values" :key="item.title">
                        <i class="iconfont" :class="item.icon"></i>
                        <h4>{{ item.title }}</h4>
                        <p>{{ item.desc }}</p>
                    </li>
                </ul>
            </section>

            <!-- 发展历程 -->
            <section class="milestones">
                <h2>发展历程</h2>
                <ul>
                    <li v-for="item in aboutData?.milestones" :key="item.year">
                        <span class="year">{{ item.year }}</span>
                        <div class="dot"></div>
                        <div class="content">
                            <h4>{{ item.title }}</h4>
                            <p>{{ item.desc }}</p>
                        </div>
                    </li>
                </ul>
            </section>

            <!-- 联系我们 -->
            <section class="contact">
                <h2>联系我们</h2>
                <ul>
                    <li>
                        <span class="label">公司地址</span>
                        <span class="value">{{ aboutData?.contact?.address }}</span>
                    </li>
                    <li>
                        <span class="label">服务热线</span>
                        <span class="value">{{ aboutData?.contact?.phone }}</span>
                    </li>
                    <li>
                        <span class="label">商务邮箱</span>
                        <span class="value">{{ aboutData?.contact?.email }}</span>
                    </li>
                    <li>
                        <span class="label">服务时间</span>
                        <span class="value">{{ aboutData?.contact?.time }}</span>
                    </li>
                </ul>
                <div class="actions">
                    <el-button type="primary" size="large" @click="router.push('/topic')">看看正在进行的活动</el-button>
                    <el-button size="large" @click="router.push('/help')">去帮助中心</el-button>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts" name="About">
    import { onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { ArrowRight } from '@element-plus/icons-vue'
    import { getAboutAPI } from '@/apis/content.ts'

    const router = useRouter();
    const aboutData = ref<any>();

    async function getAboutData() {
        const result = await getAboutAPI() as any;
        aboutData.value = result.result;
    }

    onMounted(() => {
        getAboutData();
    });
</script>

<style scoped lang="scss">
    .about-page {
        padding-top: 20px;
    }
    .breadcrumb {
        padding: 5px 0 15px;
    }
    /* 头图 */
    .hero {
        position: relative;
        height: 420px;
        border-radius: 4px;
        overflow: hidden;
        background: #dff3ee;

        > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .mask {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.42);
            color: #fff;
            text-align: center;

            h1 {
                font-size: 46px;
                font-weight: 700;
                letter-spacing: 6px;
                text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
            }
            .slogan {
                margin-top: 14px;
                font-size: 20px;
                letter-spacing: 2px;
            }
            .intro {
                margin-top: 18px;
                max-width: 620px;
                font-size: 14px;
                line-height: 26px;
                opacity: 0.9;
            }
        }
    }
    /* 数据 */
    .stats {
        display: flex;
        margin-top: 20px;
        background-color: #fff;
        border-radius: 4px;
        padding: 34px 0;

        .stat {
            flex: 1;
            text-align: center;
            border-right: 1px solid #f0f0f0;

            &:last-child {
                border-right: none;
            }
            .value {
                font-size: 32px;
                color: $xtxColor;
                font-weight: 600;
                line-height: 1;
            }
            .label {
                margin-top: 12px;
                font-size: 14px;
                color: #999;
            }
        }
    }
    /* 品牌故事 */
    .story {
        display: flex;
        gap: 40px;
        margin-top: 20px;
        background-color: #fff;
        border-radius: 4px;
        padding: 44px 40px;

        .text {
            flex: 1;

            h2 {
                font-size: 24px;
                font-weight: 400;
                color: #333;
                margin-bottom: 20px;
            }
            p {
                font-size: 15px;
                line-height: 32px;
                color: #666;
                margin-bottom: 14px;
                text-indent: 2em;
            }
        }
        .pic {
            width: 460px;
            flex-shrink: 0;
            border-radius: 4px;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                min-height: 340px;
                object-fit: cover;
            }
        }
    }
    /* 价值观 */
    .values {
        margin-top: 20px;
        background-color: #fff;
        border-radius: 4px;
        padding: 44px 40px 50px;

        h2 {
            font-size: 24px;
            font-weight: 400;
            color: #333;
            text-align: center;
        }
        ul {
            display: flex;
            gap: 20px;
            margin-top: 36px;

            li {
                flex: 1;
                text-align: center;
                padding: 30px 22px;
                background: #fafafa;
                border-radius: 6px;
                transition: all 0.3s;

                .iconfont {
                    font-size: 34px;
                    color: $xtxColor;
                }
                h4 {
                    margin-top: 14px;
                    font-size: 17px;
                    font-weight: 400;
                    color: #333;
                }
                p {
                    margin-top: 12px;
                    font-size: 13px;
                    line-height: 24px;
                    color: #999;
                    text-align: left;
                }
                &:hover {
                    background: #f0faf7;
                    transform: translateY(-4px);
                }
            }
        }
    }
    /* 发展历程 */
    .milestones {
        margin-top: 20px;
        background-color: #fff;
        border-radius: 4px;
        padding: 44px 40px;

        h2 {
            font-size: 24px;
            font-weight: 400;
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        ul {
            position: relative;
            padding-left: 200px;

            &::before {
                content: '';
                position: absolute;
                left: 219px;
                top: 10px;
                bottom: 10px;
                width: 1px;
                background: #e8e8e8;
            }
            li {
                position: relative;
                display: flex;
                align-items: flex-start;
                padding: 16px 0;

                .year {
                    position: absolute;
                    left: -200px;
                    width: 180px;
                    text-align: right;
                    font-size: 22px;
                    font-weight: 600;
                    color: $xtxColor;
                    line-height: 26px;
                }
                .dot {
                    position: absolute;
                    left: 14px;
                    top: 22px;
                    width: 11px;
                    height: 11px;
                    border-radius: 50%;
                    background: #fff;
                    border: 3px solid $xtxColor;
                }
                .content {
                    padding-left: 60px;

                    h4 {
                        font-size: 17px;
                        font-weight: 400;
                        color: #333;
                    }
                    p {
                        margin-top: 6px;
                        font-size: 14px;
                        line-height: 24px;
                        color: #999;
                    }
                }
            }
        }
    }
    /* 联系我们 */
    .contact {
        margin-top: 20px;
        background-color: #fff;
        border-radius: 4px;
        padding: 44px 40px 50px;

        h2 {
            font-size: 24px;
            font-weight: 400;
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        ul {
            display: flex;
            flex-wrap: wrap;

            li {
                width: 50%;
                display: flex;
                align-items: center;
                padding: 14px 0;

                .label {
                    width: 90px;
                    color: #999;
                    font-size: 14px;
                }
                .value {
                    color: #333;
                    font-size: 15px;
                }
            }
        }
        .actions {
            margin-top: 26px;
            text-align: center;
        }
    }
</style>
