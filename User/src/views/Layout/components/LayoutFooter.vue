<template>
    <div class="LayoutFooter">
        <div class="top">
            <div class="wrapper">
                <ul class="features">
                    <!-- 客户服务 -->
                    <li>
                        <div class="ico"><i class="iconfont icon-duihua"></i></div>
                        <h4>客户服务</h4>
                        <p class="desc">有问题随时找我们</p>
                        <div class="chips">
                            <RouterLink to="/help">在线客服</RouterLink>
                            <RouterLink to="/help?type=service">问题反馈</RouterLink>
                        </div>
                    </li>
                    <!-- 关注我们 -->
                    <li>
                        <div class="ico"><i class="iconfont icon-weixin"></i></div>
                        <h4>关注我们</h4>
                        <p class="desc">新品与优惠第一时间知道</p>
                        <div class="chips">
                            <a href="javascript:;"><i class="iconfont icon-weixin"></i>公众号</a>
                            <a href="javascript:;"><i class="iconfont icon-xinlangweibo"></i>微博</a>
                        </div>
                    </li>
                    <!-- 下载 APP -->
                    <li class="app">
                        <div class="qr"></div>
                        <div class="app-info">
                            <h4>下载 App</h4>
                            <p>扫描二维码</p>
                            <p>立马下载 App</p>
                            <RouterLink class="btn" to="/app">下载页面</RouterLink>
                        </div>
                    </li>
                    <!-- 服务热线 -->
                    <li>
                        <div class="ico"><i class="iconfont icon-mobile-phone"></i></div>
                        <h4>服务热线</h4>
                        <p class="phone">400-0000-000</p>
                        <p class="desc">周一至周日 8:00-18:00</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="bottom">
            <div class="wrapper">
                <div class="service">
                    <ul>
                        <li><i class="iconfont icon-queren-"></i><span>价格亲民</span></li>
                        <li><i class="iconfont icon-queren-"></i><span>物流快捷</span></li>
                        <li><i class="iconfont icon-queren-"></i><span>品质新鲜</span></li>
                        <li><i class="iconfont icon-queren-"></i><span>破损包赔</span></li>
                    </ul>
                </div>
                <div class="copyright">
                    <ul>
                        <li><RouterLink to="/about">关于我们</RouterLink></li>
                        <li><RouterLink to="/help?type=help">帮助中心</RouterLink></li>
                        <li><RouterLink to="/help?type=service">售后服务</RouterLink></li>
                        <li><RouterLink to="/help?type=delivery">配送与验收</RouterLink></li>
                        <li><RouterLink to="/help?type=business">商务合作</RouterLink></li>
                        <li><RouterLink to="/help?type=search">搜索推荐</RouterLink></li>
                        <li><RouterLink to="/help?type=links">友情链接</RouterLink></li>
                    </ul>
                    <span>Copyright © 621电商 · 好物优选 快速直达</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="LayoutFooter">

</script>

<style scoped lang="scss">
    .LayoutFooter {
        margin-top: 24px;
        width: 100%;
    }
    .wrapper {
        width: 1240px;
        margin: 0px auto;
    }
    /* 顶部服务区 */
    .top {
        width: 100%;
        background-color: #fff;
    }
    .features {
        display: flex;
        align-items: stretch;
        padding: 40px 0;

        > li {
            flex: 1;
            padding: 0 34px;
            position: relative;

            /* 用细虚线分隔，比原来的实线更轻 */
            & + li::before {
                content: '';
                position: absolute;
                left: 0;
                top: 6px;
                bottom: 6px;
                width: 1px;
                background: $lineColor;
            }
        }
        .ico {
            width: 52px;
            height: 52px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: $brandColorSoft;

            .iconfont {
                font-size: 24px;
                color: $brandColor;
            }
        }
        h4 {
            margin-top: 16px;
            font-size: 17px;
            font-weight: 500;
            color: $inkColor;
        }
        .desc {
            margin-top: 6px;
            font-size: 13px;
            color: $inkColor3;
        }
        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 16px;

            a {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                height: 32px;
                padding: 0 14px;
                border-radius: 16px;
                font-size: 13px;
                color: $inkColor2;
                background: #f5f6f8;
                transition: all 0.25s;

                .iconfont {
                    font-size: 13px;
                }
                &:hover {
                    color: #fff;
                    background: $brandColor;
                }
            }
        }
        /* 下载 App 这一列特殊处理 */
        .app {
            display: flex;
            align-items: center;
            gap: 18px;
        }
        .qr {
            width: 104px;
            height: 104px;
            flex-shrink: 0;
            border-radius: 12px;
            background-image: url(@/assets/images/qrcode.jpg);
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            border: 1px solid $lineColor;
        }
        .app-info {
            h4 {
                margin-top: 0;
            }
            p {
                margin-top: 4px;
                font-size: 13px;
                color: $inkColor3;
            }
            .btn {
                display: inline-block;
                margin-top: 12px;
                height: 34px;
                line-height: 34px;
                padding: 0 20px;
                border-radius: 17px;
                font-size: 13px;
                color: #fff;
                background: $brandGradient;
                box-shadow: $shadowBrand;
            }
        }
        .phone {
            margin-top: 8px;
            font-size: 22px;
            font-weight: 600;
            color: $brandColor;
            letter-spacing: 0.5px;
        }
    }
    /* 底部深色区 */
    .bottom {
        width: 100%;
        background: linear-gradient(90deg, #232838 0%, #2e3346 60%, #343a50 100%);
    }
    .service {
        padding: 30px 0 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        ul {
            display: flex;
            align-items: center;

            li {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;

                .iconfont {
                    width: 22px;
                    height: 22px;
                    line-height: 22px;
                    text-align: center;
                    border-radius: 50%;
                    font-size: 12px;
                    color: #fff;
                    background: $brandColor;
                }
                span {
                    font-size: 16px;
                    color: #e8eaef;
                }
            }
        }
    }
    .copyright {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px 0 34px;

        ul {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;

            li {
                padding: 0 12px;
                position: relative;

                & + li::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 1px;
                    height: 11px;
                    background: rgba(255, 255, 255, 0.16);
                }
                a {
                    font-size: 13px;
                    color: #9ba0b0;

                    &:hover {
                        color: $brandColor;
                    }
                }
            }
        }
        > span {
            margin-top: 14px;
            font-size: 13px;
            color: #767c8e;
        }
    }
</style>
