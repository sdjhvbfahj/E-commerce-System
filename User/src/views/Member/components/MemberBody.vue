<template>
    <div class="container">
        <div class="xtx-member-aside">
        <div class="user-manage">
            <h4>我的账户</h4>
            <div class="links">
                <RouterLink to="/member/memberInfo">个人中心</RouterLink>
                <RouterLink to="/member/memberAddress">地址管理</RouterLink>
            </div>
            <h4>交易管理</h4>
            <div class="links">
                <RouterLink to="/member/memberOrder">我的订单</RouterLink>
            </div>
        </div>
        </div>
        <div class="article">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts" name="MemberBody">
    import { useUserStore } from '@/stores/userStore'
    const userStore = useUserStore();
    userStore.getLikeList();
</script>


<style scoped lang="scss">
    .container {
        display: flex;
        gap: 20px;
        padding-top: 20px;

        .xtx-member-aside {
            width: 220px;
            flex-shrink: 0;
            border-radius: 16px;
            overflow: hidden;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);
            height: fit-content;

            .user-manage {
                background-color: #fff;
                padding-bottom: 12px;

                h4 {
                    font-size: 15px;
                    font-weight: 500;
                    color: $inkColor;
                    padding: 20px 24px 10px;

                    &:not(:first-child) {
                        margin-top: 8px;
                        border-top: 1px solid $lineColor;
                    }
                }

                .links {
                    padding: 0 12px;
                }

                a {
                    display: block;
                    line-height: 1;
                    padding: 13px 14px;
                    margin-bottom: 4px;
                    border-radius: 10px;
                    font-size: 14px;
                    color: $inkColor2;
                    position: relative;
                    transition: all 0.25s;

                    &:hover {
                        color: $brandColor;
                        background: $brandColorSoft;
                    }

                    &.active,
                    &.router-link-exact-active {
                        color: #fff;
                        background: $brandGradient;
                        box-shadow: 0 6px 14px rgba(239, 95, 42, 0.24);
                    }
                }
            }
        }

        .article {
            flex: 1;
            min-width: 0;
            background-color: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);
            overflow: hidden;
        }
    }
</style>