<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
    <!-- 商品区块 -->
     <ul class="goods">
        <li v-for="goods in hotList" :key="goods.id">
            <GoodsItem :goods="goods"/>
        </li>
    </ul>
  </div>
</template>

<script setup lang="ts" name="DetailHot">
    import {useDetailHot} from '../composables/useDetail.ts'
    import {computed} from 'vue'
    const {type} = defineProps(['type']);
    const {hotList} = useDetailHot(type);
    const TypeItem = {
        1: '24小时热销榜',
        2: '周热销榜'
    }
    // 因为使用props接收的数据不确定, 所以1.使用computed, 返回响应式数据 2.使用数组的形式来获取对象的值
    // 3.使用as keyof typeof TypeItem(as-断言, keyof-取出对象键名, typeof-判断是否是由该复杂类型创建)
    const title = computed(() => TypeItem[type as keyof typeof TypeItem] || '24小时热销榜');
</script>

<style scoped lang="scss">
.goods-hot {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(35, 40, 56, 0.06);

    h3 {
        height: 60px;
        background: $brandGradient;
        color: #fff;
        font-size: 17px;
        line-height: 60px;
        padding-left: 22px;
        font-weight: 500;
        letter-spacing: 0.5px;
    }
    .goods {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 8px 8px 12px;
        background: #fff;

        li {
            width: 100%;
            padding: 14px 0;
            border-bottom: 1px dashed $lineColor;

            &:last-child {
                border-bottom: none;
            }
            :deep(a) {
                position: relative;
                top: 0px;
                display: block;
                text-align: center;
                transition: all 0.4s ease;
                background-color: #fff;
                border-radius: 12px;
                padding: 8px 0;

                &:hover {
                    background-color: #fafbfc;
                    transform: translateY(-4px);
                }
            }
            :deep(a .pic img) {
                width: 160px;
                height: 160px;
            }
            :deep(a .info h4) {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            :deep(a .info p) {
                color: $inkColor3;
                font-size: 13px;
            }
        }
    }
}
</style>
