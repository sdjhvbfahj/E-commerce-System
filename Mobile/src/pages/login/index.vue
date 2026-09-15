<template>
    <view class="login m-page">
        <view class="login__brand">
            <view class="login__mark">
                <text>621</text>
            </view>
            <text class="login__title">621 电商</text>
            <text class="login__slogan">好物优选 · 快速直达</text>
        </view>

        <view class="login__form m-card">
            <view class="field">
                <text class="field__label">账号</text>
                <input class="field__input" v-model="account" type="text" placeholder="手机号 / 账号" placeholder-class="ph" />
            </view>
            <view class="field">
                <text class="field__label">密码</text>
                <input
                    class="field__input"
                    v-model="password"
                    :password="!showPassword"
                    type="text"
                    placeholder="至少 6 位"
                    placeholder-class="ph"
                    @confirm="submit"
                />
            </view>

            <view class="login__row">
                <view class="login__toggle" @click="showPassword = !showPassword">
                    <view class="dot" :class="{ 'dot--on': showPassword }"></view>
                    <text>显示密码</text>
                </view>
                <text class="login__forget" @click="forget">忘记密码？</text>
            </view>

            <view class="m-btn login__submit" :class="{ 'm-btn--disabled': submitting }" hover-class="m-btn--press" @click="submit">
                <text>{{ submitting ? '登录中…' : '登录' }}</text>
            </view>

            <text class="login__note">演示环境：任意账号 + 6 位以上密码即可登录</text>
        </view>

        <view class="login__demo">
            <text class="login__demo-title">快速体验</text>
            <view class="login__chips">
                <view v-for="item in DEMO_ACCOUNTS" :key="item.account" class="chip" hover-class="chip--press" @click="fill(item)">
                    <text>{{ item.label }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { onLoad } from '@dcloudio/uni-app'
    import { useUserStore } from '@/stores/userStore.ts'
    import { toast } from '@/utils/auth.ts'

    const DEMO_ACCOUNTS = [
        { label: '13800008899', account: '13800008899' },
        { label: '186****2233', account: '18612342233' },
        { label: 'demo_user', account: 'demo_user' },
    ]

    const userStore = useUserStore()

    const account = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const submitting = ref(false)
    const redirect = ref('')

    function fill(item: { account: string }) {
        account.value = item.account
        password.value = '123456'
    }

    function forget() {
        uni.showModal({
            title: '忘记密码',
            content: '演示环境不提供找回密码，直接用 6 位以上任意密码登录即可。',
            showCancel: false,
        })
    }

    async function submit() {
        if (!account.value.trim()) {
            toast('请输入账号')
            return
        }
        if (password.value.length < 6) {
            toast('密码至少 6 位')
            return
        }
        if (submitting.value) return
        submitting.value = true
        try {
            await userStore.getLogin({ account: account.value.trim(), password: password.value })
            toast('登录成功', 'success')
            setTimeout(() => {
                const pages = getCurrentPages()
                if (redirect.value) {
                    uni.redirectTo({ url: redirect.value })
                } else if (pages.length > 1) {
                    uni.navigateBack()
                } else {
                    uni.switchTab({ url: '/pages/mine/index' })
                }
            }, 500)
        } catch (error: any) {
            toast(error?.response?.data?.message ?? '登录失败，请重试')
        } finally {
            submitting.value = false
        }
    }

    onLoad((query) => {
        redirect.value = query?.redirect ? decodeURIComponent(String(query.redirect)) : ''
    })
</script>

<style scoped lang="scss">
    .login {
        min-height: 100vh;
        background: linear-gradient(180deg, #fff6f2 0%, $bgColor 42%);
        padding: 0 $pagePadding $gapLg;
    }

    .login__brand {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 80rpx 0 56rpx;
    }

    .login__mark {
        width: 128rpx;
        height: 128rpx;
        border-radius: 36rpx;
        background: $brandGradient;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 12rpx 28rpx rgba(239, 95, 42, 0.28);

        text {
            color: #fff;
            font-size: 46rpx;
            font-weight: 700;
            letter-spacing: 2rpx;
        }
    }

    .login__title {
        margin-top: $gapMd;
        font-size: 40rpx;
        font-weight: 600;
        color: $inkColor;
        letter-spacing: 2rpx;
    }

    .login__slogan {
        margin-top: 8rpx;
        font-size: $fsSm;
        color: $inkColor3;
    }

    .login__form {
        padding: $gapLg $gapMd $gapMd;
    }

    .field {
        display: flex;
        align-items: center;
        gap: $gapMd;
        height: 104rpx;
        border-bottom: 1px solid $lineColor;
    }

    .field__label {
        width: 96rpx;
        flex-shrink: 0;
        color: $inkColor2;
        font-size: $fsBase;
    }

    .field__input {
        flex: 1;
        min-width: 0;
        font-size: $fsBase;
        color: $inkColor;
    }

    .ph {
        color: $inkColor3;
    }

    .login__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $gapMd 0 $gapLg;
    }

    .login__toggle {
        display: flex;
        align-items: center;
        gap: 10rpx;
        font-size: $fsSm;
        color: $inkColor3;
    }

    .dot {
        width: 28rpx;
        height: 28rpx;
        border-radius: 50%;
        border: 2rpx solid #ccd0d9;
        position: relative;

        &--on {
            border-color: $brandColor;

            &::after {
                content: '';
                position: absolute;
                left: 6rpx;
                top: 6rpx;
                width: 12rpx;
                height: 12rpx;
                border-radius: 50%;
                background: $brandColor;
            }
        }
    }

    .login__forget {
        font-size: $fsSm;
        color: $inkColor3;
    }

    .login__submit {
        width: 100%;
    }

    .login__note {
        display: block;
        margin-top: $gapMd;
        text-align: center;
        font-size: $fsXs;
        color: $inkColor3;
    }

    .login__demo {
        margin-top: $gapLg;
    }

    .login__demo-title {
        font-size: $fsSm;
        color: $inkColor3;
    }

    .login__chips {
        margin-top: $gapSm;
        display: flex;
        flex-wrap: wrap;
        gap: $gapSm;
    }

    .chip {
        padding: 0 $gapMd;
        height: 60rpx;
        display: flex;
        align-items: center;
        border-radius: 30rpx;
        background: #fff;
        border: 1px solid $lineColor;
        color: $inkColor2;
        font-size: $fsSm;

        &--press {
            background: #f4f5f8;
        }
    }
</style>
