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
    h3 {
        height: 70px;
        background: $helpColor;
        color: #fff;
        font-size: 18px;
        line-height: 70px;
        padding-left: 25px;
        font-weight: normal;
    }
    .goods {
        display: flex;
        flex-direction: column;
        width: 100%;
        li {
            width: 280px;
            height: 340px;
            margin-top: 10px;
            :deep(a) {
                position: relative;
                top: 0px;
                padding: 15px 40px;
                text-align: center;
                transition: all 0.7s;
                background-color: #fff;
                border: 2px solid #fff;
                &:hover {
                    border: 2px solid $xtxColor;
                }
            }
            :deep(a .pic img) {
                width: 200px;
                height: 200px;
            }
            :deep(a .info h4) {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            :deep(a .info p) {
                color: #999;
                font-size: 14px;
            }
        }
    }
}
</style>