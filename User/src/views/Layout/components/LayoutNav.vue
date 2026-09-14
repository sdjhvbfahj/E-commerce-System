<template>
    <div class="LayoutNav">
        <div class="wrapper">
            <!-- 使用了pinia-plugin-persistedstate持久化, localStorage和pinia里面的数据是双向绑定的 -->
            <!-- 初始化/页面刷新时pinia会从localStorage读取数据, 所以手动删除以后pinia里面的数据也会为空, 从而实现token判断失败 -->
            <ul v-if="userStore?.userInfo?.token">
                <li>
                    <RouterLink to="/"><i class="iconfont icon-user-filling"></i>{{ userStore?.userInfo?.account || '小兔鲜用户' }}</RouterLink>
                </li>
                <li>
                    <el-popconfirm title="确定退出登录吗？" width="160" @confirm="exitLogin">
                        <template #reference>
                            <a href="javascript:;">退出登录</a>
                        </template>
                    </el-popconfirm>
                </li>
                <li><RouterLink to="/member/memberOrder">我的订单</RouterLink></li>
                <li><RouterLink to="/member/memberInfo">会员中心</RouterLink></li>
                <li><RouterLink to="/">帮助中心</RouterLink></li>
                <li><RouterLink to="/">关于我们</RouterLink></li>
                <li><RouterLink to="/"><i class="iconfont icon-mobile-phone"></i>手机版</RouterLink></li>
            </ul>
            <ul v-else>
                <li><RouterLink to="/login">请先登录</RouterLink></li>
                <li><RouterLink to="/login">免费注册</RouterLink></li>
                <li><RouterLink to="/">我的订单</RouterLink></li>
                <li><RouterLink to="/">会员中心</RouterLink></li>
                <li><RouterLink to="/">帮助中心</RouterLink></li>
                <li><RouterLink to="/">关于我们</RouterLink></li>
                <li><RouterLink to="/"><i class="iconfont icon-mobile-phone"></i>手机版</RouterLink></li>
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
        height: 53px;
        background-color: #333;
    }
    .wrapper {
        width: 1240px;
        margin: 0px auto;
        height: 100%;
    }
    ul {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    a {
        display: inline-block;
        font-size: 14px;
        line-height: 1;
        color: #cdcdcd;
        padding: 0px 15px;
        border-right: 2px solid #ccc;
        &:hover {
            color: $xtxColor;
        }
    }
    li:last-child a {
        border-right: none;
    }
</style>

<!-- 设置气泡确认框样式 -->
<style lang="scss">
    .el-popconfirm__action {
        text-align: center;
    }
</style>