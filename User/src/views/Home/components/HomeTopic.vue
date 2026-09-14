<template>
    <HomePanel title="最新专题" subtitle="换季焕新 · 厨房升级 · 通勤装备" more-path="/topic" :plain=false>
        <ul class="topic-list">
            <li v-for="item in topicList" :key="item.id">
                <RouterLink :to="item.href">
                    <div class="cover">
                        <img v-img-lazy="item.cover">
                        <span class="tag">{{ item.tag }}</span>
                    </div>
                    <div class="text">
                        <h3 class="ellipsis">{{ item.title }}</h3>
                        <p class="subtitle ellipsis">{{ item.subtitle }}</p>
                        <p class="meta">
                            {{ item.goods.length }} 件好物，去逛逛
                            <i class="iconfont icon-jinru"></i>
                        </p>
                    </div>
                </RouterLink>
            </li>
        </ul>
    </HomePanel>
</template>

<script setup lang="ts" name="HomeTopic">
    import HomePanel from './HomeNewPanel.vue'
    import {getTopicAPI} from '@/apis/content.ts'
    import {ref, onMounted} from 'vue'

    // 专题数据（和「专题活动」页共用同一个假接口）
    let topicList = ref<any[]>([]);
    async function getTopicList() {
        const result = await getTopicAPI() as any;
        topicList.value = result.result || [];
    }
    onMounted(() => {
        getTopicList();
    })
</script>

<style scoped lang="scss">
    .topic-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;

        li {
            a {
                display: block;
                border-radius: 14px;
                overflow: hidden;
                background: #fff;
                box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);
                transition: all 0.3s ease;

                .cover {
                    position: relative;
                    overflow: hidden;
                    background: #f0f1f4;

                    img {
                        display: block;
                        width: 100%;
                        aspect-ratio: 16 / 9;
                        object-fit: cover;
                        transition: transform 0.5s ease;
                    }
                    .tag {
                        position: absolute;
                        left: 12px;
                        top: 12px;
                        padding: 3px 12px;
                        border-radius: 12px;
                        font-size: 12px;
                        color: #fff;
                        background: rgba(239, 95, 42, 0.92);
                    }
                }
                .text {
                    padding: 16px 18px 18px;

                    h3 {
                        font-size: 17px;
                        font-weight: 500;
                        color: $inkColor;
                    }
                    .subtitle {
                        margin-top: 6px;
                        font-size: 13px;
                        color: $inkColor3;
                    }
                    .meta {
                        margin-top: 12px;
                        font-size: 13px;
                        color: $brandColor;

                        .iconfont {
                            font-size: 12px;
                            margin-left: 2px;
                        }
                    }
                }
                &:hover {
                    box-shadow: 0 12px 28px rgba(35, 40, 56, 0.14);
                    transform: translateY(-4px);

                    .cover img {
                        transform: scale(1.05);
                    }
                }
            }
        }
    }
</style>
