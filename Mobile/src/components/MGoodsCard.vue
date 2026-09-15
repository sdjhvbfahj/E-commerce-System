<template>
    <view class="g-card" :class="`g-card--${mode}`" hover-class="g-card--press" @click="goDetail">
        <image class="g-card__pic" :src="item.picture" mode="aspectFill" />
        <view class="g-card__body">
            <text class="g-card__name m-ellipsis-2">{{ item.name }}</text>
            <text v-if="mode === 'row'" class="g-card__desc m-ellipsis">{{ item.desc }}</text>
            <view class="g-card__foot">
                <text class="m-price">
                    <text class="m-price__symbol">¥</text>
                    <text class="m-price__num">{{ item.price }}</text>
                </text>
                <text class="g-card__sales">{{ sales }} 人付款</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    /**
     * 商品卡片
     * - mode="grid"：两列网格用（首页楼层 / 列表页）
     * - mode="row"：横向单列用（搜索结果、订单里的推荐）
     */
    import { computed } from 'vue'
    import { salesText } from '@/utils/format.ts'

    interface GoodsLike {
        id: string
        name: string
        picture: string
        price?: string
        desc?: string
        orderNum?: number
    }

    const props = withDefaults(
        defineProps<{
            item: GoodsLike
            mode?: 'grid' | 'row'
        }>(),
        { mode: 'grid' }
    )

    const sales = computed(() => salesText(props.item.orderNum))

    function goDetail() {
        uni.navigateTo({ url: `/pages/goods/index?id=${props.item.id}` })
    }
</script>

<style scoped lang="scss">
    .g-card {
        background: #fff;
        border-radius: $radiusMd;
        overflow: hidden;

        &--press {
            opacity: 0.9;
        }

        &--grid {
            width: 100%;
            padding-bottom: $gapSm;

            .g-card__pic {
                background: #f2f3f6;
            }

            .g-card__pic {
                width: 100%;
                height: 0;
                padding-bottom: 100%; /* 正方形，和用户端一致 */
                display: block;
            }

            .g-card__pic {
                /* uni 的 image 不能直接等高，用 aspectFill + 固定高度更稳 */
                height: 330rpx;
                padding-bottom: 0;
            }
        }

        &--row {
            display: flex;
            gap: $gapMd;
            padding: $gapMd;

            .g-card__pic {
                width: 200rpx;
                height: 200rpx;
                border-radius: $radiusSm;
                flex-shrink: 0;
            }

            .g-card__body {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
        }
    }

    .g-card__body {
        padding: $gapMd $gapMd 0;

        .g-card--row & {
            padding: 0;
        }
    }

    .g-card__name {
        font-size: $fsBase;
        line-height: 1.4;
        color: $inkColor;
        max-height: 76rpx;
    }

    .g-card__desc {
        margin-top: $gapXs;
        color: $inkColor3;
        font-size: $fsSm;
    }

    .g-card__foot {
        margin-top: $gapSm;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: $gapSm;
    }

    .g-card__sales {
        color: $inkColor3;
        font-size: $fsXs;
        flex-shrink: 0;
    }
</style>
