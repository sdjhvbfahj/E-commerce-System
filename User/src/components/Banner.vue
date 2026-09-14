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
    /* 原来是绝对定位铺满一层，现在改成正常流式 + 圆角，跟着新的两栏首屏走 */
    .banner {
        position: relative;
        width: 100%;
        height: 500px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(35, 40, 56, 0.1);

        .block {
            width: 100%;
            height: 100%;
        }
        a {
            display: block;
            width: 100%;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        /* 圆角内再收一层，避免轮播条的直角露出来 */
        :deep(.el-carousel) {
            border-radius: 16px;
            overflow: hidden;
        }
        :deep(.el-carousel__indicators--horizontal) {
            bottom: 16px;
        }
        /* 指示器换成小胶囊，配合新配色 */
        :deep(.el-carousel__indicator button) {
            width: 22px;
            height: 4px;
            border-radius: 2px;
            background-color: rgba(255, 255, 255, 0.55);
        }
        :deep(.el-carousel__indicator.is-active button) {
            background-color: #fff;
        }
    }
    :deep(.el-carousel__arrow) {
        width: 40px;
        height: 40px;
        background-color: rgba(35, 40, 56, 0.35);

        &:hover {
            background-color: rgba(35, 40, 56, 0.6);
        }
    }
    :deep(.el-carousel__arrow--left) {
        left: 16px;
    }
</style>
