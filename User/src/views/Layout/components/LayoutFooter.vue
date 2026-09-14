<template>
    <div class="LayoutFooter">
        <div class="top">
            <div class="wrapper">
                <ul>
                    <!-- 客户服务：两个都有对应页面，可点击 -->
                    <li>
                        <h4>客户服务</h4>
                        <div class="content">
                            <RouterLink class="tile" to="/help">
                                <i class="iconfont icon-duihua"></i>
                                <span>在线客服</span>
                            </RouterLink>
                            <RouterLink class="tile" to="/help?type=service">
                                <i class="iconfont icon-wentifankui"></i>
                                <span>问题反馈</span>
                            </RouterLink>
                        </div>
                    </li>
                    <!-- 关注我们：目前没有落地页，只做 hover 变色，不跳转 -->
                    <li>
                        <h4>关注我们</h4>
                        <div class="content">
                            <div class="tile">
                                <i class="iconfont icon-weixin"></i>
                                <span>公众号</span>
                            </div>
                            <div class="tile">
                                <i class="iconfont icon-xinlangweibo"></i>
                                <span>微博</span>
                            </div>
                        </div>
                    </li>
                    <!-- 下载APP -->
                    <li>
                        <h4>下载APP</h4>
                        <div class="content">
                            <RouterLink class="qr" to="/app" title="前往下载页"></RouterLink>
                            <div class="app-info">
                                <p>扫描二维码</p>
                                <p>立马下载APP</p>
                                <RouterLink to="/app">下载页面</RouterLink>
                            </div>
                        </div>
                    </li>
                    <!-- 服务热线 -->
                    <li>
                        <h4>服务热线</h4>
                        <div class="content">
                            <p class="phone">400-0000-000</p>
                            <span>周一至周日 8:00-18:00</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="bottom">
            <div class="wrapper">
                <div class="service">
                    <ul>
                        <!-- 三个图标各不相同：价格标签 / 物流车 / 新鲜叶子 -->
                        <li>
                            <svg class="s-ico" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.83 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/>
                                <circle cx="7.6" cy="7.6" r="1.5" />
                            </svg>
                            <span>价格亲民</span>
                        </li>
                        <li>
                            <svg class="s-ico" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M2.5 6.5h11v9h-11z"/>
                                <path d="M13.5 9.5h4l3 3v3h-7z"/>
                                <circle cx="6.5" cy="17.5" r="1.9"/>
                                <circle cx="17" cy="17.5" r="1.9"/>
                            </svg>
                            <span>物流快捷</span>
                        </li>
                        <li>
                            <svg class="s-ico" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M4.5 19.5c-1-8 4-13.5 15-13.5 1 9-5 13.5-15 13.5Z"/>
                                <path d="M8.5 15.5c2.6-2.6 5.6-4 9-4.6"/>
                            </svg>
                            <span>品质新鲜</span>
                        </li>
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
        margin-top: 20px;
        width: 100%;
    }
    .wrapper {
        width: 1240px;
        margin: 0px auto;
        height: 100%;
    }
    .top {
        width: 100%;
        height: 290px;
        background-color: #fff;
    }
    .top ul {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .top ul li {
        flex: 1;
        height: 200px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-right: 1px solid $lineColor;

        &:last-child {
            border-right: none;
        }
    }
    .top ul li h4 {
        font-size: 18px;
        color: $inkColor3;
        margin-bottom: 24px;
        font-weight: 400;
    }
    .top ul li .content {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    /* 图标方块：内容居中 + hover 变色（有链接的会跳转，没链接的只变色） */
    .tile {
        width: 96px;
        height: 96px;
        margin: 0 5px;
        border: 1px solid $lineColor;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: $inkColor2;
        transition: all 0.25s ease;

        .iconfont {
            font-size: 30px;
            line-height: 1;
            color: $inkColor3;
            transition: color 0.25s ease;
        }
        span {
            font-size: 13px;
            line-height: 1;
        }
        &:hover {
            border-color: $brandColor;
            color: $brandColor;

            .iconfont {
                color: $brandColor;
            }
        }
        /* 只有能跳转的才给手型和上浮反馈 */
        &[href]:hover {
            background-color: $brandColorSoft;
            transform: translateY(-2px);
            box-shadow: 0 8px 18px rgba(239, 95, 42, 0.18);
        }
    }
    /* 二维码 */
    .qr {
        width: 96px;
        height: 96px;
        margin-right: 14px;
        flex-shrink: 0;
        border: 1px solid $lineColor;
        border-radius: 10px;
        overflow: hidden;
        background-image: url(@/assets/images/qrcode.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        transition: all 0.25s ease;

        &:hover {
            border-color: $brandColor;
            transform: translateY(-2px);
            box-shadow: 0 8px 18px rgba(239, 95, 42, 0.18);
        }
    }
    .app-info {
        text-align: left;

        p {
            font-size: 14px;
            line-height: 24px;
            color: $inkColor3;
        }
        a {
            display: inline-block;
            margin-top: 4px;
            width: 96px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 15px;
            font-size: 13px;
            color: #fff;
            background-color: $brandColor;
            transition: background 0.25s;

            &:hover {
                background-color: $brandColorDark;
            }
        }
    }
    .phone {
        font-size: 22px;
        color: $inkColor;
    }
    .top ul li:last-child .content {
        flex-direction: column;
    }
    .top ul li:last-child .content span {
        margin-top: 6px;
        font-size: 14px;
        color: $inkColor3;
    }
    /* ---------- 底部深色区 ---------- */
    .bottom {
        width: 100%;
        height: 348px;
        background: linear-gradient(90deg, #232838 0%, #2e3346 60%, #343a50 100%);
    }
    .bottom .service {
        width: 100%;
        height: 178px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .bottom .service ul {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .bottom .service ul li {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        flex: 1;

        /* 三个图标各不相同，用内联 SVG 画（项目里的 iconfont 只有 21 个字形，
           没有价格/物流/叶子这三个），线稿风格 + 主色描边 */
        .s-ico {
            width: 40px;
            height: 40px;
            flex-shrink: 0;
            fill: none;
            stroke: $brandColor;
            stroke-width: 1.7;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        span {
            font-size: 28px;
            color: #fff;
        }
    }
    .bottom .copyright {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 170px;
    }
    .bottom .copyright ul {
        margin-top: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    .bottom .copyright ul li {
        border-right: 1px solid rgba(255, 255, 255, 0.16);
        padding: 0px 10px;

        &:last-child {
            border-right: none;
        }
    }
    .bottom .copyright ul li a {
        font-size: 15px;
        color: #9ba0b0;

        &:hover {
            color: $brandColor;
        }
    }
    .bottom .copyright span {
        margin-top: 10px;
        font-size: 15px;
        color: #9ba0b0;
    }
</style>
