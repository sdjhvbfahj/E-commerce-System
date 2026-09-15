<template>
    <div class="login-page">
        <!-- 左侧品牌区 -->
        <div class="brand-panel">
            <div class="brand">
                <span class="badge">621</span>
                <div class="txt">
                    <p class="name">621电商</p>
                    <p class="sub">运营管理端</p>
                </div>
            </div>
            <h1>把生意管起来</h1>
            <p class="slogan">商品 · 库存 · 订单 · 退款 · 内容 · 会员 · 权限</p>
            <ul class="points">
                <li><el-icon><DataAnalysis /></el-icon>实时经营数据，一眼看清今天的单量与成交</li>
                <li><el-icon><GoodsFilled /></el-icon>商品上下架、改价，改完用户端立刻生效</li>
                <li><el-icon><Box /></el-icon>库存预警 + 出入库流水，不超卖也不压货</li>
                <li><el-icon><Lock /></el-icon>按角色分配菜单与按钮权限，操作全程留痕</li>
            </ul>
            <p class="copyright">© 621电商 · 好物优选 快速直达</p>
        </div>

        <!-- 右侧登录表单 -->
        <div class="form-panel">
            <div class="form-card">
                <h2>账号登录</h2>
                <p class="tip">演示环境：选一个下面的角色，密码 6 位以上即可登录</p>

                <el-form ref="formRef" :model="form" :rules="rules" size="large" @keyup.enter="submit">
                    <el-form-item prop="username">
                        <el-input v-model="form.username" placeholder="请输入账号" clearable>
                            <template #prefix><el-icon><User /></el-icon></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="form.password" type="password" show-password placeholder="请输入密码">
                            <template #prefix><el-icon><Lock /></el-icon></template>
                        </el-input>
                    </el-form-item>
                    <el-button class="submit" type="primary" size="large" :loading="loading" @click="submit">
                        登 录
                    </el-button>
                </el-form>

                <div class="demo-accounts">
                    <p class="label">演示账号（点击自动填入，密码统一 123456）</p>
                    <div class="accounts">
                        <button
                            v-for="item in demoAccounts"
                            :key="item.username"
                            type="button"
                            :class="{ active: form.username === item.username }"
                            @click="pick(item)"
                        >
                            <span class="name">{{ item.label }}</span>
                            <span class="account">{{ item.username }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Login">
    import { reactive, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import type { FormInstance, FormRules } from 'element-plus'
    import { ElMessage } from 'element-plus'
    import { useUserStore } from '@/stores/userStore.ts'

    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();

    // 演示角色（和 mock 里的管理员账号一一对应）
    const demoAccounts = [
        { label: '超级管理员', username: 'admin', desc: '全部权限' },
        { label: '商品运营', username: 'oper01', desc: '商品/内容' },
        { label: '库存管理员', username: 'stock01', desc: '库存/流水' },
        { label: '订单客服', username: 'cs01', desc: '订单/退款' },
        { label: '财务', username: 'fin01', desc: '打款/日志' },
    ];

    const formRef = ref<FormInstance>();
    const loading = ref(false);
    const form = reactive({ username: 'admin', password: '123456' });

    const rules = reactive<FormRules>({
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '密码长度为 6-20 位', trigger: 'blur' },
        ],
    });

    function pick(item: { username: string }) {
        form.username = item.username;
        form.password = '123456';
    }

    async function submit() {
        const valid = await formRef.value?.validate().catch(() => false);
        if (!valid) return;
        loading.value = true;
        try {
            const result = await userStore.login(form.username.trim(), form.password);
            ElMessage({ message: `欢迎回来，${result.adminInfo.realName}`, type: 'success' });
            const redirect = toText(route.query.redirect);
            router.replace(redirect || '/dashboard');
        } catch {
            /* 失败提示由 mock 客户端抛出，页面只管兜底 */
        } finally {
            loading.value = false;
        }
    }

    function toText(value: unknown) {
        return typeof value === 'string' ? value : '';
    }
</script>

<style scoped lang="scss">
    .login-page {
        display: flex;
        height: 100%;
        min-height: 640px;
    }
    /* 左侧品牌区 */
    .brand-panel {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        padding: 60px 70px;
        color: #fff;
        background:
            radial-gradient(680px 340px at 82% 14%, rgba(255, 255, 255, 0.2), transparent 70%),
            radial-gradient(520px 280px at 8% 88%, rgba(255, 255, 255, 0.12), transparent 70%),
            linear-gradient(120deg, #ff9a5c 0%, #ef5f2a 52%, #d8431a 100%);

        .brand {
            position: absolute;
            left: 70px;
            top: 40px;
            display: flex;
            align-items: center;
            gap: 12px;

            .badge {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 44px;
                height: 44px;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 700;
                color: #ef5f2a;
                background: #fff;
            }
            .name {
                font-size: 20px;
                font-weight: 600;
                letter-spacing: 1px;
            }
            .sub {
                font-size: 12px;
                opacity: 0.85;
            }
        }
        h1 {
            font-size: 44px;
            font-weight: 700;
            letter-spacing: 3px;
        }
        .slogan {
            margin-top: 16px;
            font-size: 16px;
            letter-spacing: 2px;
            opacity: 0.92;
        }
        .points {
            margin-top: 44px;
            display: flex;
            flex-direction: column;
            gap: 18px;

            li {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 15px;
                opacity: 0.96;

                .el-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 34px;
                    height: 34px;
                    border-radius: 10px;
                    font-size: 16px;
                    color: #fff;
                    background: rgba(255, 255, 255, 0.18);
                }
            }
        }
        .copyright {
            position: absolute;
            left: 70px;
            bottom: 30px;
            font-size: 12px;
            opacity: 0.7;
        }
    }
    /* 右侧表单 */
    .form-panel {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
        background-color: $bgColor;
    }
    .form-card {
        width: 420px;
        padding: 40px 40px 30px;
        border-radius: 18px;
        background: #fff;
        box-shadow: 0 18px 48px rgba(35, 40, 56, 0.1);

        h2 {
            font-size: 24px;
            font-weight: 600;
            color: $inkColor;
        }
        .tip {
            margin: 10px 0 26px;
            font-size: 13px;
            color: $inkColor3;
        }
        .submit {
            width: 100%;
            height: 46px;
            margin-top: 4px;
            border: none;
            border-radius: 23px;
            font-size: 16px;
            letter-spacing: 6px;
            color: #fff;
            background: $brandGradient;
            box-shadow: $shadowBrand;
        }
        .demo-accounts {
            margin-top: 26px;
            padding-top: 20px;
            border-top: 1px dashed $lineColor;

            .label {
                font-size: 12px;
                color: $inkColor3;
            }
            .accounts {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 12px;

                button {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    padding: 7px 12px;
                    border: 1px solid $lineColor;
                    border-radius: 10px;
                    background: #fafbfc;
                    cursor: pointer;
                    transition: all 0.25s ease;

                    .name {
                        font-size: 12px;
                        color: $inkColor;
                    }
                    .account {
                        font-size: 11px;
                        color: $inkColor3;
                    }
                    &:hover {
                        border-color: $brandColor;
                        color: $brandColor;
                    }
                    &.active {
                        border-color: $brandColor;
                        background: $brandColorSoft;

                        .name {
                            color: $brandColor;
                            font-weight: 500;
                        }
                    }
                }
            }
        }
    }
</style>
