<template>
    <div class="app-page">
        <div class="container">
            <!-- 面包屑 -->
            <div class="breadcrumb">
                <el-breadcrumb :separator-icon="ArrowRight">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>手机版</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <!-- 顶部下载区 -->
            <section class="hero">
                <div class="text">
                    <p class="badge">小兔鲜儿 App</p>
                    <h1>把整间超市<br>装进口袋</h1>
                    <p class="desc">
                        扫码下载 App，新人首单立减 20 元。<br>
                        支持订单实时跟踪、会员专属价与每日签到领积分。
                    </p>
                    <div class="download">
                        <div class="qr">
                            <img :src="qrcode" alt="下载二维码">
                            <span>手机扫码下载</span>
                        </div>
                        <div class="btns">
                            <a class="store" href="javascript:;" @click="tips">
                                苹果 App Store
                                <em>iOS 13.0 或更高版本</em>
                            </a>
                            <a class="store" href="javascript:;" @click="tips">
                                安卓应用市场
                                <em>Android 8.0 或更高版本</em>
                            </a>
                        </div>
                    </div>
                    <p class="tip">演示环境：按钮仅做展示，不会真的跳转下载</p>
                </div>

                <!-- 手机模型（纯 CSS 绘制，不依赖任何图片） -->
                <div class="phone">
                    <div class="screen">
                        <div class="statusbar">
                            <span>9:41</span>
                            <span class="dots">●●●</span>
                        </div>
                        <div class="app-header">
                            <i class="iconfont icon-sousuo"></i>
                            <div class="searchbar">搜一搜：车厘子</div>
                        </div>
                        <div class="banner">产地直采 · 48 小时到家</div>
                        <div class="grid">
                            <div class="tile" v-for="item in previewGoods" :key="item.name">
                                <div class="thumb" :style="{background: item.color}"></div>
                                <p class="name">{{ item.name }}</p>
                                <p class="price">{{ item.price }}</p>
                            </div>
                        </div>
                        <div class="tabbar">
                            <span class="on">首页</span>
                            <span>分类</span>
                            <span>购物车</span>
                            <span>我的</span>
                        </div>
                    </div>
                    <div class="notch"></div>
                </div>
            </section>

            <!-- 功能亮点 -->
            <section class="features">
                <h2>App 里能做的事</h2>
                <ul>
                    <li v-for="item in features" :key="item.title">
                        <i class="iconfont" :class="item.icon"></i>
                        <h4>{{ item.title }}</h4>
                        <p>{{ item.desc }}</p>
                    </li>
                </ul>
            </section>

            <!-- 底部引导 -->
            <section class="footer-cta">
                <div class="text">
                    <h3>不想下载？网页版一样能用</h3>
                    <p>购物车、订单、收货地址在 App 和网页之间是同步的，换设备也能接着买。</p>
                </div>
                <el-button type="primary" size="large" @click="router.push('/')">继续逛逛网页版</el-button>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts" name="AppDownload">
    import { useRouter } from 'vue-router'
    import { ElMessage } from 'element-plus'
    import { ArrowRight } from '@element-plus/icons-vue'
    import qrcode from '@/assets/images/qrcode.jpg'

    const router = useRouter();

    // 手机模型里展示的假商品（纯装饰）
    const previewGoods = [
        { name: '智利车厘子', price: '¥129.00', color: '#5dd1b4' },
        { name: '纯棉圆领T恤', price: '¥89.00', color: '#f5b8d8' },
        { name: '无线蓝牙耳机', price: '¥299.00', color: '#8cc6ff' },
        { name: '日式餐具套装', price: '¥129.00', color: '#ffd08a' },
    ];

    const features = [
        { icon: 'icon-3', title: '购物车实时同步', desc: '手机加入购物车，回到电脑上可以直接结算。' },
        { icon: 'icon-countdown_timer', title: '订单实时跟踪', desc: '支付、发货、派送每个节点都有提醒，不用反复刷新。' },
        { icon: 'icon-favorite-filling', title: '会员专属价', desc: 'App 内下单享会员价，每日签到还能领积分抵现。' },
        { icon: 'icon-duihua', title: '在线客服秒回', desc: '售后问题直接在 App 里发起，处理进度随时可查。' },
    ];

    function tips() {
        ElMessage({ message: '演示环境：这里仅做展示，不会真的跳转下载', type: 'info' });
    }
</script>

<style scoped lang="scss">
    .app-page {
        padding-top: 20px;
    }
    .breadcrumb {
        padding: 5px 0 15px;
    }
    /* 顶部下载区 */
    .hero {
        display: flex;
        align-items: center;
        gap: 60px;
        padding: 50px 60px;
        border-radius: 4px;
        background: linear-gradient(120deg, #f0faf7 0%, #ffffff 55%);
        overflow: hidden;

        .text {
            flex: 1;

            .badge {
                display: inline-block;
                padding: 4px 14px;
                font-size: 13px;
                color: $xtxColor;
                background: #dff5ef;
                border-radius: 14px;
            }
            h1 {
                margin-top: 18px;
                font-size: 40px;
                line-height: 1.35;
                font-weight: 600;
                color: #333;
            }
            .desc {
                margin-top: 18px;
                font-size: 15px;
                line-height: 28px;
                color: #666;
            }
            .download {
                display: flex;
                align-items: center;
                gap: 24px;
                margin-top: 30px;

                .qr {
                    text-align: center;

                    img {
                        width: 120px;
                        height: 120px;
                        object-fit: cover;
                        border: 1px solid #eee;
                        border-radius: 6px;
                        background: #fff;
                        padding: 4px;
                    }
                    span {
                        display: block;
                        margin-top: 8px;
                        font-size: 12px;
                        color: #999;
                    }
                }
                .btns {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .store {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    width: 200px;
                    height: 56px;
                    padding: 0 18px;
                    border-radius: 8px;
                    background: #333;
                    color: #fff;
                    font-size: 15px;
                    transition: opacity 0.3s;

                    em {
                        margin-top: 2px;
                        font-size: 11px;
                        font-style: normal;
                        color: #bbb;
                    }
                    &:hover {
                        opacity: 0.86;
                    }
                }
            }
            .tip {
                margin-top: 16px;
                font-size: 12px;
                color: #bbb;
            }
        }
    }
    /* 手机模型 */
    .phone {
        position: relative;
        width: 290px;
        height: 560px;
        flex-shrink: 0;
        margin-right: 20px;
        border-radius: 34px;
        padding: 12px;
        background: #2b2b2b;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);

        .notch {
            position: absolute;
            left: 50%;
            top: 12px;
            transform: translateX(-50%);
            width: 96px;
            height: 20px;
            border-radius: 0 0 12px 12px;
            background: #2b2b2b;
            z-index: 2;
        }
        .screen {
            width: 100%;
            height: 100%;
            border-radius: 24px;
            background: #f5f5f5;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .statusbar {
            display: flex;
            justify-content: space-between;
            padding: 8px 16px 4px;
            font-size: 11px;
            color: #666;

            .dots {
                letter-spacing: 2px;
                font-size: 8px;
            }
        }
        .app-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 14px 12px;

            .iconfont {
                font-size: 15px;
                color: #27ba9b;
            }
            .searchbar {
                flex: 1;
                height: 30px;
                line-height: 30px;
                padding: 0 12px;
                border-radius: 15px;
                background: #fff;
                font-size: 12px;
                color: #bbb;
            }
        }
        .banner {
            margin: 0 14px;
            height: 74px;
            border-radius: 10px;
            background: linear-gradient(120deg, #27ba9b 0%, #1dc779 100%);
            color: #fff;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: 1px;
        }
        .grid {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            padding: 12px 8px;

            .tile {
                width: 50%;
                padding: 6px;
                text-align: center;

                .thumb {
                    height: 78px;
                    border-radius: 8px;
                }
                .name {
                    margin-top: 6px;
                    font-size: 11px;
                    color: #666;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .price {
                    font-size: 12px;
                    color: $priceColor;
                }
            }
        }
        .tabbar {
            display: flex;
            justify-content: space-around;
            height: 44px;
            align-items: center;
            background: #fff;
            font-size: 11px;
            color: #999;

            .on {
                color: #27ba9b;
            }
        }
    }
    /* 功能亮点 */
    .features {
        margin-top: 20px;
        background-color: #fff;
        border-radius: 4px;
        padding: 40px;

        h2 {
            font-size: 24px;
            font-weight: 400;
            color: #333;
            text-align: center;
        }
        ul {
            display: flex;
            gap: 20px;
            margin-top: 32px;

            li {
                flex: 1;
                padding: 26px 22px;
                border: 1px solid #f2f2f2;
                border-radius: 6px;
                transition: all 0.3s;

                .iconfont {
                    font-size: 28px;
                    color: $xtxColor;
                }
                h4 {
                    margin-top: 14px;
                    font-size: 16px;
                    font-weight: 400;
                    color: #333;
                }
                p {
                    margin-top: 10px;
                    font-size: 13px;
                    line-height: 23px;
                    color: #999;
                }
                &:hover {
                    border-color: $xtxColor;
                }
            }
        }
    }
    /* 底部引导 */
    .footer-cta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0;
        padding: 28px 40px;
        background-color: #fff;
        border-radius: 4px;

        h3 {
            font-size: 20px;
            font-weight: 400;
            color: #333;
        }
        p {
            margin-top: 8px;
            font-size: 14px;
            color: #999;
        }
    }
</style>
