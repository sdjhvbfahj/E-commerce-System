<template>
    <h3 class="box-title">商品信息</h3>
    <div class="box-body">
        <table class="goods">
        <thead>
            <tr>
            <th width="520">商品信息</th>
            <th width="170">单价</th>
            <th width="170">数量</th>
            <th width="170">小计</th>
            <th width="170">实付</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="i in checkInfo?.goods" :key="i.id">
            <td>
                <a href="javascript:;" class="info">
                <img :src="i.picture" alt="">
                <div class="right">
                    <p>{{ i.name }}</p>
                    <p>{{ i.attrsText }}</p>
                </div>
                </a>
            </td>
            <td>&yen;{{ i.price }}</td>
            <td>{{ i.count }}</td>
            <td>&yen;{{ i.totalPrice }}</td>
            <td>&yen;{{ i.totalPayPrice }}</td>
            </tr>
        </tbody>
        </table>
    </div>
</template>

<script setup lang="ts" name="CheckoutGoodsInfo">
    defineProps(['checkInfo']);
</script>

<style scoped lang="scss">
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }

    .goods {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;

        .info {
            display: flex;
            text-align: left;

            img {
                width: 70px;
                height: 70px;
                margin-right: 20px;
            }

            .right {
                line-height: 24px;

            p {
                &:last-child {
                    color: #999;
                }
            }
            }
        }

        tr {
            th {
                background: #f5f5f5;
                font-weight: normal;
            }

            td,
            th {
                text-align: center;
                padding: 20px;
                border-bottom: 1px solid #f5f5f5;

                &:first-child {
                    border-left: 1px solid #f5f5f5;
                }

                &:last-child {
                    border-right: 1px solid #f5f5f5;
                }
            }
        }
    }
</style>