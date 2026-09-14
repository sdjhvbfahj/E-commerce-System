<template>
    <div class="HomeNew">
        <HomePanel title="新鲜好物" subtitle="新鲜出炉 品质靠谱">
            <ul>
                <li v-for="item in newList" :key="item.id">
                    <RouterLink :to="`/detail/${item.id}`">
                        <img :src="item.picture">
                        <h3>{{ item.name }}</h3>
                        <p>￥<i>{{ item.price }}</i></p>
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
    // 定义用来存放新鲜好物数据的变量
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
                background-color: #f0f9f4;
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
                    color: $priceColor;
                    i {
                        font-size: 22px;
                    }
                }
                &:hover {
                    top: -6px;
                    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.2);
                }
            }
        }
    }
</style>