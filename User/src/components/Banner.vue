<template>
    <div class="banner">
        <div class="block text-center" m="t-4">
            <el-carousel trigger="click" height="500px">
            <el-carousel-item v-for="item in bannerList" :key="item.id">
                <RouterLink :to="item.hrefUrl">
                    <img :src="item.imgUrl">
                </RouterLink>
            </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script setup lang="ts" name="Banner">
    defineProps(['bannerList']);
</script>

<style scoped lang="scss">
    .banner {
        position: absolute;
        z-index: 1;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 500px;
        a {
            display: block;
            width: 100%;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    :deep(.el-carousel__arrow--left) {
        left: 260px;
    }
</style>