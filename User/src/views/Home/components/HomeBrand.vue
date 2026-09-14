<template>
    <HomePanel title="热门品牌" subtitle="层层试用过的自有与合作品牌" more-path="/brand" plain>
        <ul class="brand-list">
            <li v-for="item in brandList" :key="item.id">
                <RouterLink :to="`/category/${item.catId}`">
                    <img :src="item.logo" :alt="item.name">
                    <div class="info">
                        <h3 class="ellipsis">{{ item.name }}</h3>
                        <p class="en ellipsis">{{ item.nameEn }}</p>
                        <p class="count">{{ item.goodsCount }} 件在售</p>
                    </div>
                </RouterLink>
            </li>
        </ul>
    </HomePanel>
</template>

<script setup lang="ts" name="HomeBrand">
    import HomePanel from './HomeNewPanel.vue'
    import {getBrandAPI} from '@/apis/content.ts'
    import {ref, onMounted} from 'vue'

    // 品牌数据（和「品牌专区」页共用同一个假接口）
    let brandList = ref<any[]>([]);
    async function getBrandList() {
        const result = await getBrandAPI() as any;
        brandList.value = result.result || [];
    }
    onMounted(() => {
        getBrandList();
    })
</script>

<style scoped lang="scss">
    .brand-list {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 16px;

        li {
            a {
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 16px;
                border-radius: 14px;
                background: #fff;
                box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);
                transition: all 0.3s ease;

                img {
                    width: 56px;
                    height: 56px;
                    flex-shrink: 0;
                    border-radius: 12px;
                    object-fit: cover;
                    background: #fff;
                }
                .info {
                    flex: 1;
                    min-width: 0;

                    h3 {
                        font-size: 15px;
                        font-weight: 500;
                        color: $inkColor;
                    }
                    .en {
                        margin-top: 3px;
                        font-size: 11px;
                        letter-spacing: 0.5px;
                        color: #b9bdcc;
                    }
                    .count {
                        margin-top: 6px;
                        font-size: 12px;
                        color: $brandColor;
                    }
                }
                &:hover {
                    box-shadow: 0 12px 28px rgba(35, 40, 56, 0.14);
                    transform: translateY(-4px);
                }
            }
        }
    }
</style>
