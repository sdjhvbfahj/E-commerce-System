<template>
    <div class="page not-found">
        <div class="box es-card">
            <span class="code">404</span>
            <div class="info">
                <h2>页面走丢了</h2>
                <p>你访问的地址不存在，可能已被移除或链接有误。</p>
                <div class="actions">
                    <el-button type="primary" @click="router.replace('/dashboard')">回数据概览</el-button>
                    <el-button @click="router.back()">返回上一页</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="NotFound">
    import { useRouter } from 'vue-router'

    const router = useRouter();
</script>

<style scoped lang="scss">
    .not-found {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 120px);
    }
    .box {
        display: flex;
        align-items: center;
        gap: 50px;
        padding: 50px 70px;

        .code {
            font-size: 84px;
            font-weight: 700;
            line-height: 1;
            letter-spacing: 6px;
            color: $brandColor;
            opacity: 0.28;
        }
        h2 {
            font-size: 22px;
            font-weight: 600;
            color: $inkColor;
        }
        p {
            margin-top: 10px;
            font-size: 14px;
            color: $inkColor3;
        }
        .actions {
            margin-top: 26px;
            display: flex;
            gap: 10px;
        }
    }
</style>
