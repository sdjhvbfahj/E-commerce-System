<template>
    <div class="HomeNew">
        <HomePanel title="新鲜好物" subtitle="新鲜出炉 品质靠谱" more-path="/topic">
            <ul>
                <li v-for="item in newList" :key="item.id">
                    <RouterLink :to="`/detail/${item.id}`">
                        <div class="pic">
                            <img :src="item.picture">
                            <span class="badge">新品</span>
                        </div>
                        <h3 class="ellipsis">{{ item.name }}</h3>
                        <p class="price">￥<i>{{ item.price }}</i></p>
                    </RouterLink>
                </li>
            </ul>
        </HomePanel>
    </div>
</template>

<script setup lang="ts" name="HomeNew">
    import HomePanel from './HomeNewPanel.vue'
    import {getNewAPI, type NewItem} from '@/apis/home.ts'
    import {ref, onMounted} from 'vue'
    // 定义ref数据, 用于接收goods数据
    let newList = ref<NewItem[]>([]);
    async function getNew() {
        const result = await getNewAPI() as any;
        newList.value = result.result;
    }
    onMounted(() => {
        getNew();
    })
</script>

<style scoped lang="scss">
    ul {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;

        li {
            a {
                display: block;
                padding: 12px;
                border-radius: 14px;
                border: 1px solid #f0f1f4;
                background: #fafbfc;
                transition: all 0.3s ease;

                .pic {
                    position: relative;
                    border-radius: 10px;
                    overflow: hidden;
                    background: #f0f1f4;

                    img {
                        display: block;
                        width: 100%;
                        aspect-ratio: 1 / 1;
                        object-fit: cover;
                        transition: transform 0.5s ease;
                    }
                    .badge {
                        position: absolute;
                        left: 10px;
                        top: 10px;
                        padding: 2px 10px;
                        border-radius: 10px;
                        font-size: 12px;
                        color: #fff;
                        background: $brandGradient;
                        box-shadow: 0 4px 10px rgba(239, 95, 42, 0.3);
                    }
                }
                h3 {
                    margin-top: 14px;
                    font-size: 15px;
                    font-weight: 400;
                    color: $inkColor;
                }
                .price {
                    margin-top: 6px;
                    color: $priceColor;
                    font-size: 16px;

                    i {
                        font-size: 20px;
                        font-style: normal;
                        font-weight: 500;
                    }
                }
                &:hover {
                    background: #fff;
                    border-color: transparent;
                    box-shadow: 0 10px 26px rgba(35, 40, 56, 0.1);
                    transform: translateY(-4px);

                    .pic img {
                        transform: scale(1.05);
                    }
                }
            }
        }
    }
</style>
