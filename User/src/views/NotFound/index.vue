<template>
    <div class="not-found">
        <div class="container">
            <div class="box">
                <!-- 插画 -->
                <div class="pic">
                    <img :src="noneImg" alt="页面不存在">
                    <span class="code">404</span>
                </div>
                <!-- 文案 -->
                <div class="info">
                    <h2>哎呀，这个页面走丢了</h2>
                    <p class="desc">
                        你访问的地址可能已经被移走或者删除了，<br>
                        不如回首页逛逛，或者去帮助中心找找答案？
                    </p>
                    <div class="path">
                        <span>出错地址：</span>
                        <i>{{ route.fullPath }}</i>
                    </div>
                    <div class="actions">
                        <el-button type="primary" size="large" @click="router.replace('/')">返回首页</el-button>
                        <el-button size="large" @click="router.replace('/help')">去帮助中心</el-button>
                    </div>
                </div>
            </div>
            <!-- 推荐 -->
            <div class="recommend">
                <h3>猜你可能想去</h3>
                <ul>
                    <li v-for="item in links" :key="item.path">
                        <RouterLink :to="item.path">
                            <span>{{ item.name }}</span>
                            <i class="iconfont icon-jinru"></i>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="NotFound">
    import { useRoute, useRouter } from 'vue-router'
    import noneImg from '@/assets/images/none.png'

    const route = useRoute();
    const router = useRouter();

    // 兜底页也给几个入口，避免用户卡在这里
    const links = [
        { name: '返回首页', path: '/' },
        { name: '全部分类', path: '/category/1005000' },
        { name: '我的订单', path: '/member/memberOrder' },
        { name: '帮助中心', path: '/help' },
    ];
</script>

<style scoped lang="scss">
    .not-found {
        padding: 40px 0 20px;
    }
    .box {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 60px;
        min-height: 480px;
        background-color: #fff;
        border-radius: 4px;
        padding: 60px 40px;
    }
    .pic {
        position: relative;
        flex-shrink: 0;
        width: 320px;
        height: 320px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #f0faf7;

        img {
            width: 200px;
            height: 200px;
            object-fit: contain;
            background: transparent;
        }
        .code {
            position: absolute;
            left: 50%;
            bottom: 18px;
            transform: translateX(-50%);
            font-size: 40px;
            font-weight: 700;
            line-height: 1;
            letter-spacing: 6px;
            color: $xtxColor;
            opacity: 0.35;
        }
    }
    .info {
        max-width: 520px;

        h2 {
            font-size: 28px;
            font-weight: 400;
            color: #333;
        }
        .desc {
            margin-top: 16px;
            font-size: 16px;
            line-height: 30px;
            color: #999;
        }
        .path {
            margin-top: 18px;
            padding: 10px 14px;
            background: #f7f7f7;
            border-radius: 4px;
            font-size: 13px;
            color: #666;
            word-break: break-all;

            i {
                color: $helpColor;
            }
        }
        .actions {
            margin-top: 30px;
        }
    }
    .recommend {
        margin-top: 20px;
        background-color: #fff;
        border-radius: 4px;
        padding: 24px 40px 30px;

        h3 {
            font-size: 18px;
            font-weight: 400;
            color: #333;
            margin-bottom: 18px;
        }
        ul {
            display: flex;
            gap: 16px;

            li a {
                display: flex;
                align-items: center;
                gap: 6px;
                height: 48px;
                padding: 0 22px;
                border: 1px solid #e4e4e4;
                border-radius: 4px;
                color: #666;
                transition: all 0.3s;

                .iconfont {
                    font-size: 13px;
                }
                &:hover {
                    border-color: $xtxColor;
                    color: $xtxColor;
                }
            }
        }
    }
</style>
