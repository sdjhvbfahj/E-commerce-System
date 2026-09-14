<template>
    <section class="register-section">
        <div class="wrapper">
            <nav>
                <a href="javascript:;">账号注册</a>
                <span class="entry">已有账号？<RouterLink to="/login">直接登录</RouterLink></span>
            </nav>
            <div class="account-box">
                <div class="form">
                    <el-form label-position="right" label-width="76px" status-icon :model="ruleForm" :rules="rules" ref="submitForm">
                        <el-form-item label="账号" prop="account">
                            <el-input v-model="ruleForm.account" placeholder="请输入账号"/>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="ruleForm.password" type="password" show-password placeholder="6-20 位字符"/>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="confirmPassword">
                            <el-input v-model="ruleForm.confirmPassword" type="password" show-password placeholder="请再次输入密码"/>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="ruleForm.mobile" placeholder="选填，用于接收物流通知"/>
                        </el-form-item>
                        <el-form-item label-width="22px" prop="agree">
                            <el-checkbox size="large" v-model="ruleForm.agree">我已同意隐私条款和服务条款</el-checkbox>
                        </el-form-item>
                        <el-button size="large" class="!ml-0 subBtn" :plain="true" @click="formSubmit">立即注册</el-button>
                        <!-- 假数据演示提示 -->
                        <p class="mock-tip">演示环境：账号可任意填写，密码 6-20 位即可注册成功</p>
                    </el-form>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts" name="RegisterSection">
    import { reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import type { FormRules } from 'element-plus'
    import { ElMessage } from 'element-plus'
    import { getRegisterAPI } from '@/apis/user.ts'

    const router = useRouter();

    interface RuleFormItem {
        account: string,
        password: string,
        confirmPassword: string,
        mobile: string,
        agree: boolean
    }
    // 表单数据对象
    const ruleForm = reactive<RuleFormItem>({
        account: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        agree: false
    });

    // 确认密码校验
    const confirmValidator = (rule:any, value:string, callback:any) => {
        if(!value) {
            callback(new Error('请再次输入密码'));
        } else if(value !== ruleForm.password) {
            callback(new Error('两次输入的密码不一致'));
        } else {
            callback();
        }
    }
    // 手机号选填，填了就必须合法
    const mobileValidator = (rule:any, value:string, callback:any) => {
        if(!value) {
            callback();
        } else if(!/^1[3-9]\d{9}$/.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    }
    // 协议校验
    const agreeValidator = (rule:any, value:boolean, callback:any) => {
        if(value) {
            callback();
        } else {
            callback(new Error('请勾选注册协议'));
        }
    }
    // 规则数据对象
    const rules = reactive<FormRules<RuleFormItem>>({
        account: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
        ],
        confirmPassword: [
            { validator: confirmValidator, trigger: 'blur' }
        ],
        mobile: [
            { validator: mobileValidator, trigger: 'blur' }
        ],
        agree: [
            { validator: agreeValidator }
        ]
    });

    const submitForm = ref();
    function formSubmit() {
        submitForm.value.validate(async (value:boolean) => {
            if(!value) {
                return;
            }
            try {
                await getRegisterAPI({
                    account: ruleForm.account,
                    password: ruleForm.password,
                    mobile: ruleForm.mobile
                });
                ElMessage({
                    message: '注册成功，请登录',
                    type: 'success'
                });
                setTimeout(() => {
                    router.replace({ path: '/login' });
                }, 1200);
            } catch(error) {}
        });
    }
</script>

<style scoped lang="scss">
    .register-section {
        background: url('@/assets/images/login-bg.png') no-repeat center / cover;
        height: 640px;
        position: relative;
        .wrapper {
            width: 420px;
            background: #fff;
            position: absolute;
            left: 50%;
            top: 40px;
            transform: translate3d(30px, 0, 0);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            nav {
                font-size: 14px;
                height: 55px;
                margin-bottom: 20px;
                border-bottom: 1px solid #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 30px;
                a {
                    flex: 1;
                    line-height: 1;
                    display: inline-block;
                    font-size: 18px;
                    position: relative;
                }
                .entry {
                    font-size: 13px;
                    color: #999;
                    a {
                        display: inline;
                        font-size: 13px;
                        color: $xtxColor;
                    }
                }
            }
        }
        .account-box {
            .form {
                padding: 0 20px 20px 20px;
            }
        }
        .subBtn {
            background: $xtxColor;
            width: 100%;
            color: #fff;
        }
        .mock-tip {
            margin-top: 12px;
            font-size: 12px;
            color: #999;
            text-align: center;
        }
    }
</style>
