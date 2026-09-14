<template>
    <div class="LayoutNav">
        <div class="wrapper">
            <!-- 左侧欢迎语（原来没有，新排版加上） -->
            <p class="welcome">
                <i class="iconfont icon-tip"></i>
                欢迎来到 <b>621 电商</b>，产地直采 · 好物优选
            </p>
            <!-- 使用了pinia-plugin-persistedstate持久化, localStorage和pinia里面的数据是双向绑定的 -->
            <!-- 初始化/页面刷新时pinia会从localStorage读取数据, 所以手动删除以后pinia里面的数据也会为空, 从而实现token判断失败 -->
            <ul v-if="userStore?.userInfo?.token">
                <li>
                    <RouterLink to="/member/memberInfo"><i class="iconfont icon-user-filling"></i>{{ userStore?.userInfo?.account || '621电商用户' }}</RouterLink>
                </li>
                <li>
                    <el-popconfirm title="确定退出登录吗？" width="160" @confirm="exitLogin">
                        <template #reference>
                            <a href="javascript:;">退出登录</a>
                        </template>
                    </el-popconfirm>
                </li>
                <li><RouterLink to="/member/memberOrder">我的订单</RouterLink></li>
                <li><RouterLink to="/member/memberAddress">地址管理</RouterLink></li>
                <li><RouterLink to="/help">帮助中心</RouterLink></li>
                <li><RouterLink to="/about">关于我们</RouterLink></li>
                <li><RouterLink to="/app"><i class="iconfont icon-mobile-phone"></i>手机版</RouterLink></li>
            </ul>
            <ul v-else>
                <li><RouterLink to="/login">请先登录</RouterLink></li>
                <li><RouterLink to="/register">免费注册</RouterLink></li>
                <li><RouterLink to="/login">我的订单</RouterLink></li>
                <li><RouterLink to="/help">帮助中心</RouterLink></li>
                <li><RouterLink to="/about">关于我们</RouterLink></li>
                <li><RouterLink to="/app"><i class="iconfont icon-mobile-phone"></i>手机版</RouterLink></li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts" name="LayoutNav">
    import {useUserStore} from '@/stores/userStore.ts'
    import {useRouter} from 'vue-router'
    import {useCartStore} from '@/stores/cartStore.ts'
    const router = useRouter();
    const userStore = useUserStore();
    const cartStore = useCartStore();
    // 退出登录函数
    function exitLogin() {
        userStore.deleteLoginInfo();
        cartStore.clearCart();
        router.replace({path: '/login'});
    }
</script>

<style scoped lang="scss">
    .LayoutNav {
        width: 100%;
        height: 42px;
        background: linear-gradient(90deg, #232838 0%, #2e3346 60%, #343a50 100%);
    }
    .wrapper {
        width: 1240px;
        margin: 0px auto;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .welcome {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #8b90a2;

        .iconfont {
            margin-right: 6px;
            font-size: 14px;
            color: $brandColor;
        }
        b {
            margin: 0 4px;
            font-weight: 500;
            color: #fff;
        }
    }
    ul {
        height: 100%;
        display: flex;
        align-items: center;
    }
    li {
        display: flex;
        align-items: center;

        // 用细竖线做分隔，比原来的 2px 灰线更轻
        & + li::before {
            content: '';
            width: 1px;
            height: 12px;
            background: rgba(255, 255, 255, 0.16);
        }
    }
    a {
        display: inline-block;
        font-size: 13px;
        line-height: 1;
        color: #b6bac9;
        padding: 0px 14px;

        .iconfont {
            margin-right: 4px;
            font-size: 13px;
        }
        &:hover {
            color: $brandColor;
        }
    }
</style>

<!-- 设置气泡确认框样式 -->
<style lang="scss">
    .el-popconfirm__action {
        text-align: center;
    }
</style>
