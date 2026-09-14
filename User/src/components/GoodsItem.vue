<template>
    <RouterLink :to="`/detail/${goods.id}`">
        <div class="pic">
            <img v-img-lazy="goods.picture">
        </div>
        <div class="info">
            <h4>{{ goods.name }}</h4>
            <p>{{ goods.desc }}</p>
        </div>
        <p class="price">¥<span>{{ goods.price }}</span></p>
    </RouterLink>
</template>

<script setup lang="ts" name="GoodsItem">
    defineProps({goods:{
        type: Object,
        default: () => {}
    }})
</script>

<style scoped lang="scss">
    a {
        display: block;
        width: 100%;
        height: 100%;

        .pic {
            display: flex;
            justify-content: center;

            img {
                width: 160px;
                height: 160px;
                border-radius: 12px;
                object-fit: cover;
                background: #f5f6f8;
            }
        }
        .info {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            margin-top: 10px;
            width: 100%;
            height: 68px;

            h4 {
                font-size: 15px;
                line-height: 19px;
                font-weight: 400;
                color: $inkColor;
            }
            p {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                font-size: 13px;
                line-height: 19px;
                margin-top: 5px;
                color: $inkColor3;
            }
        }
        .price {
            color: $priceColor;
            font-size: 17px;
            font-weight: 500;

            span {
                font-size: 20px;
            }
        }
    }
</style>
