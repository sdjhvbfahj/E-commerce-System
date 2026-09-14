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
                background: transparent;
            }
        }
        .info {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            margin-top: 10px;
            width: 100%;
            height: 70px;
            h4 {
                font-size: 16px;
                line-height: 19px;
                font-weight: 400;
            }
            p {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                font-size: 16px;
                line-height: 19px;
                margin-top: 5px;
                color: #666;
            }
        }
        .price {
            color: $priceColor;
            font-size: 20px;
            span {
                font-size: 22px;
            }
        }
    }
</style>