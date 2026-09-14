<template>
    <div class="HomeHot">
        <HomePanel title="人气推荐" subtitle="人气爆款 不容错过" more-path="/brand">
            <ul>
                <li v-for="(item, index) in hotList" :key="item.id">
                    <RouterLink :to="`/detail/${item.id}`">
                        <div class="pic">
                            <img v-img-lazy="item.picture">
                            <span class="badge">HOT {{ index + 1 }}</span>
                        </div>
                        <h3 class="ellipsis">{{ item.title }}</h3>
                        <p class="alt ellipsis">{{ item.alt }}</p>
                    </RouterLink>
                </li>
            </ul>
        </HomePanel>
    </div>
</template>

<script setup lang="ts" name="HomeHot">
    import HomePanel from './HomeNewPanel.vue'
    import {getHotAPI, type HotItem} from '@/apis/home.ts'
    import {ref, onMounted} from 'vue'
    // 定义用来存放人气推荐数据的变量
    let hotList = ref<HotItem[]>([]);
    async function getNew() {
        const result = await getHotAPI() as any;
        hotList.value = result.result;
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
                        background: rgba(35, 40, 56, 0.72);
                        backdrop-filter: blur(4px);
                    }
                }
                h3 {
                    margin-top: 14px;
                    font-size: 15px;
                    font-weight: 400;
                    color: $inkColor;
                }
                .alt {
                    margin-top: 6px;
                    font-size: 13px;
                    color: $inkColor3;
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
