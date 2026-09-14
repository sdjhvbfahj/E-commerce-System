<template>
    <div class="LayoutFooter">
            <div class="top">
                <div class="wrapper">
                    <ul>
                        <li>
                            <h4>客户服务</h4>
                            <div class="content">
                                <div class="left">
                                    <i class="iconfont icon-duihua"></i>
                                    <span>在线客服</span>
                                </div>
                                <div class="right">
                                    <i class="iconfont icon-wentifankui"></i>
                                    <span>问题反馈</span>
                                </div>
                            </div>
                        </li>
                        <li>
                            <h4>关注我们</h4>
                            <div class="content">
                                <div class="left">
                                    <i class="iconfont icon-weixin"></i>
                                    <span>公众号</span>
                                </div>
                                <div class="right">
                                    <i class="iconfont icon-xinlangweibo"></i>
                                    <span>微博</span>
                                </div>
                            </div>
                        </li>
                        <li>
                            <h4>下载APP</h4>
                            <div class="content">
                                <div class="left"></div>
                                <div class="right">
                                    <p>扫描二维码</p>
                                    <p>立马下载APP</p>
                                    <a href="javascript:;">下载页面</a>
                                </div>
                            </div>
                        </li>
                        <li>
                            <h4>服务热线</h4>
                            <div class="content">
                                <p>400-0000-000</p>
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
                            <li><span>价格亲民</span></li>
                            <li><span>物流快捷</span></li>
                            <li><span>品质新鲜</span></li>
                        </ul>
                    </div>
                    <div class="copyright">
                        <ul>
                            <li><a href="javascript:;">关于我们</a></li>
                            <li><a href="javascript:;">帮助中心</a></li>
                            <li><a href="javascript:;">售后服务</a></li>
                            <li><a href="javascript:;">配送与验收</a></li>
                            <li><a href="javascript:;">商务合作</a></li>
                            <li><a href="javascript:;">搜索推荐</a></li>
                            <li><a href="javascript:;">友情链接</a></li>
                        </ul>
                        <span>Copyright © 小兔鲜</span>
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
        height: 638px;
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
        border-right: 1px solid #dedede;
    }
    .top ul li:last-child {
        border-right: none;
    }
    .top ul li h4 {
        font-size: 18px;
        color: #999;
        margin-bottom: 30px;
        font-weight: 400;
    }
    .top ul li .content {
        justify-content: center;
        display: flex;
    }
    .top ul li:first-child .content .left,
    .top ul li:nth-child(2) .content .left,
    .top ul li:first-child .content .right,
    .top ul li:nth-child(2) .content .right,
    .top ul li:nth-child(3) .content .left {
        width: 90px;
        height: 90px;
        border: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        color: #999;
    }
    .top ul li:first-child .content .right,
    .top ul li:nth-child(2) .content .right {
        margin-left: 10px;
    }
    .top ul li:first-child .content .left .iconfont,
    .top ul li:nth-child(2) .content .left .iconfont,
    .top ul li:first-child .content .right .iconfont,
    .top ul li:nth-child(2) .content .right .iconfont {
        font-size: 46px;
    }
    .top ul li:nth-child(3) .content .left {
        background-image: url(@/assets/images/qrcode.jpg);
        background-repeat: no-repeat;
        background-size: contain;
    }
    .top ul li:nth-child(3) .content .right {
        margin-left: 10px;
    }
    .top ul li:nth-child(3) .content .right p {
        color: #999;
        font-size: 14px;
        line-height: 24px;
    }
    .top ul li:nth-child(3) .content .right a {
        display: block;
        width: 106px;
        height: 34px;
        line-height: 34px;
        background-color: $xtxColor;
        color: #fff;
    }
    .top ul li:nth-child(4) .content {
        flex-direction: column;
        height: 90px;
    }
    .top ul li:nth-child(4) .content p {
        font-size: 22px;
        color: #666;
    }
    .top ul li:nth-child(4) .content span {
        font-size: 15px;
        color: #999;
    }
    .bottom {
        width: 100%;
        height: 348px;
        background-color: #333;
    }
    .bottom .service {
        width: 100%;
        height: 178px;
        border-bottom: 1px solid #565656;
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
        flex: 1;
    }
    .bottom .service ul li span {
        font-size: 28px;
        color: #fff;
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
        border-right: 1px solid #999;
        padding: 0px 10px;
    }
    .bottom .copyright ul li a {
        font-size: 15px;
        color: #999;
    }
    .bottom .copyright span {
        margin-top: 10px;
        font-size: 15px;
        color: #999;
    }
</style>