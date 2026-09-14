<template>
    <Banner :bannerList/>
</template>

<script setup lang="ts" name="HomeBanner">
    import {onMounted} from 'vue'
    import {useBanner} from '@/composables/useBanner.ts'
    const {bannerList, getBanner} = useBanner();
    onMounted(() => {
        // 挂载完毕后调用封装函数, 获取banner数据
        getBanner();
    })
</script>

<style scoped lang="scss">
    
</style>