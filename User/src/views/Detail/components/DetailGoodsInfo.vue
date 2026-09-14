<template>
    <div class="goods-info">
        <div class="media">
            <!-- 图片预览区 -->
            <DetailImageView :detailList/>
            <!-- 统计数量 -->
            <ul class="goods-sales">
                <li>
                    <p>销量人气</p>
                    <p> {{ detailList.salesCount }}+ </p>
                    <p><i class="iconfont icon-task-filling"></i>销量人气</p>
                </li>
                <li>
                    <p>商品评价</p>
                    <p>{{ detailList.commentCount }}+</p>
                    <p><i class="iconfont icon-comment-filling"></i>查看评价</p>
                </li>
                <li>
                    <p>收藏人气</p>
                    <p>{{ detailList.collectCount }}+</p>
                    <p><i class="iconfont icon-favorite-filling"></i>收藏商品</p>
                </li>
                <li>
                    <p>品牌信息</p>
                    <!-- 使用??代替||, 不仅可以判断undefined和null, 还可以判断空字符串 -->
                    <p>{{ detailList.brand?.name ?? '空'}}</p>
                    <p><i class="iconfont icon-dynamic-filling"></i>品牌主页</p>
                </li>
            </ul>
        </div>
        <div class="spec">
            <!-- 商品信息区 -->
            <p class="g-name"> {{ detailList.name }} </p>
            <p class="g-desc">{{ detailList.desc }} </p>
            <p class="g-price">
                <span>{{ detailList.price }}</span>
                <span> {{ detailList.oldPrice }}</span>
            </p>
            <div class="g-service">
                <dl>
                    <dt>促销</dt>
                    <dd>12月好物放送，App领券购买直降120元</dd>
                </dl>
                <dl>
                    <dt>服务</dt>
                    <dd>
                        <span>无忧退货</span>
                        <span>快速退款</span>
                        <span>免费包邮</span>
                        <a href="javascript:;">了解详情</a>
                    </dd>
                </dl>
            </div>
            <!-- sku组件 -->
            <XtxSku :goods="detailList" @change="skuChange"/>
            <!-- 数据组件 -->
            <el-input-number v-model="count" :min="1"/>
            <!-- 按钮组件 -->
            <div>
                <el-button size="large" class="btn" @click="addCart">加入购物车</el-button>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts" name="DetailGoodsInfo">
    import DetailImageView from './DetailImageView.vue'
    import {ref} from 'vue'
    import {ElMessage} from 'element-plus'
    import {useCartStore} from '@/stores/cartStore.ts'
    const cartStore = useCartStore();
    const {detailList} = defineProps(['detailList']) as any;
    const count = ref(1);
    let skuObj = {} as any;
    const skuChange = (sku:any) => {
        skuObj = sku;
    }
    async function addCart() {
        if(skuObj.skuId) {
            cartStore.addCart({
                id: detailList.id,
                name: detailList.name,
                picture: detailList.mainPictures[0],
                price: detailList.price,
                count: count.value,
                skuId: skuObj.skuId,
                attrsText: skuObj.specsText,
                selected: true  // 商品是否选中
            });
            ElMessage({
                message: '加入购物车成功',
                type: 'success'
            });
        } else {
            ElMessage({
                message: '请选择规格!',
                type: 'warning'
            });
        }
    }
</script>

<style scoped lang="scss">
    .goods-info {
        min-height: 600px;
        background: #fff;
        display: flex;
        .media {
            width: 580px;
            height: 600px;
            padding: 30px 50px;
        }
        .spec {
            flex: 1;
            padding: 30px 30px 30px 0;
        }
    }
    .g-name {
        font-size: 22px;
    }
    .g-desc {
        color: #999;
        margin-top: 10px;
    }
    .g-price {
        margin-top: 10px;
        span {
            &::before {
                content: "¥";
                font-size: 14px;
            }
            &:first-child {
                color: $priceColor;
                margin-right: 10px;
                font-size: 22px;
            }
            &:last-child {
                color: #999;
                text-decoration: line-through;
                font-size: 16px;
            }
        }
    }
    .g-service {
        background: #f5f5f5;
        width: 500px;
        padding: 20px 10px 0 10px;
        margin-top: 10px;
        dl {
            padding-bottom: 20px;
            display: flex;
            align-items: center;
            dt {
                width: 50px;
                color: #999;
            }
            dd {
                color: #666;
                &:last-child {
                    span {
                        margin-right: 10px;
                        &::before {
                            content: "•";
                            color: $xtxColor;
                            margin-right: 2px;
                        }
                    }
                    a {
                        color: $xtxColor;
                    }
                }
            }
        }
    }
.goods-sales {
    display: flex;
    width: 400px;
    align-items: center;
    text-align: center;
    height: 140px;
    li {
        flex: 1;
        position: relative;
        ~li::after {
            position: absolute;
            top: 10px;
            left: 0;
            height: 60px;
            border-left: 1px solid #e4e4e4;
            content: "";
        }
        p {
            &:first-child {
                color: #999;
            }
            &:nth-child(2) {
                color: $priceColor;
                margin-top: 10px;
            }
            &:last-child {
                color: #666;
                margin-top: 10px;
                i {
                    color: $xtxColor;
                    font-size: 14px;
                    margin-right: 2px;
                }
                &:hover {
                    color: $xtxColor;
                    cursor: pointer;
                }
            }
        }
    }
}
.btn {
    margin-top: 20px;
}
</style>