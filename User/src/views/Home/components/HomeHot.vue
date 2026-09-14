<template>
    <div class="HomeHot">
        <HomePanel title="人气推荐" subtitle="人气爆款 不容错过">
            <ul>
                <li v-for="item in hotList" :key="item.id">
                    <RouterLink :to="`/detail/${item.id}`">
                        <img v-img-lazy="item.picture">
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.alt }}</p>
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
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 406px;
        li {
            width: 306px;
            height: 100%;
            a {
                position: relative;
                top: 0px;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                height: 100%;
                background-color: #fff;
                transition: all 0.6s;
                img {
                    width: 306px;
                    height: 306px;
                }
                h3 {
                    text-align: center;
                    width: 100%;
                    font-size: 22px;
                    padding: 10px 16px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-weight: 400;
                }
                p {
                    color: #999;
                    font-size: 18px;
                }
                &:hover {
                    top: -6px;
                    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.2);
                }
            }
        }
    }
</style>