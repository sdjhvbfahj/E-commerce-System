<template>
    <div class="brand-page">
        <div class="container">
            <!-- 面包屑 -->
            <div class="breadcrumb">
                <el-breadcrumb :separator-icon="ArrowRight">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>品牌专区</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <!-- 头部说明 -->
            <div class="intro">
                <h2>品牌专区</h2>
                <p>每一个品牌都由我们亲自试用过。不做最全的货架，只留下值得推荐的那几个。</p>
            </div>

            <!-- 品牌列表 -->
            <ul class="brand-list">
                <li v-for="brand in brandList" :key="brand.id">
                    <div class="head">
                        <img class="logo" :src="brand.logo" :alt="brand.name">
                        <div class="name">
                            <h3>{{ brand.name }}</h3>
                            <p class="en">{{ brand.nameEn }}</p>
                        </div>
                        <span class="count">{{ brand.goodsCount }} 件在售</span>
                    </div>

                    <p class="desc">{{ brand.desc }}</p>

                    <!-- 代表商品 -->
                    <div class="goods">
                        <RouterLink v-for="goods in brand.goods" :key="goods.id" :to="`/detail/${goods.id}`">
                            <img v-img-lazy="goods.picture" :alt="goods.name">
                            <p class="g-name ellipsis">{{ goods.name }}</p>
                            <p class="g-price">¥{{ goods.price }}</p>
                        </RouterLink>
                    </div>

                    <div class="actions">
                        <span class="cat">主营分类：{{ brand.catName }}</span>
                        <el-button type="primary" plain size="small" @click="router.push(`/category/${brand.catId}`)">
                            查看全部商品<i class="iconfont icon-jinru"></i>
                        </el-button>
                    </div>
                </li>
            </ul>

            <!-- 合作入口 -->
            <div class="cooperation">
                <div class="text">
                    <h3>想和我们一起做点事？</h3>
                    <p>供货、渠道分销、品牌联名、内容合作，都欢迎来聊。</p>
                </div>
                <div class="btns">
                    <el-button type="primary" size="large" @click="router.push({ path: '/help', query: { type: 'business' } })">商务合作</el-button>
                    <el-button size="large" @click="router.push('/about')">了解我们</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Brand">
    import { onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { ArrowRight } from '@element-plus/icons-vue'
    import { getBrandAPI } from '@/apis/content.ts'

    const router = useRouter();
    const brandList = ref<any[]>([]);

    async function getBrandList() {
        const result = await getBrandAPI() as any;
        brandList.value = result.result;
    }

    onMounted(() => {
        getBrandList();
    });
</script>

<style scoped lang="scss">
    .brand-page {
        padding-top: 20px;
    }
    .breadcrumb {
        padding: 5px 0 15px;
    }
    .intro {
        background-color: #fff;
        border-radius: 4px;
        padding: 30px 40px;

        h2 {
            font-size: 26px;
            font-weight: 400;
            color: #333;
        }
        p {
            margin-top: 10px;
            font-size: 14px;
            color: #999;
        }
    }
    .brand-list {
        margin-top: 20px;

        > li {
            background-color: #fff;
            border-radius: 4px;
            padding: 28px 32px 24px;
            margin-bottom: 16px;
            transition: box-shadow 0.3s;

            &:hover {
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            }
        }
        .head {
            display: flex;
            align-items: center;

            .logo {
                width: 56px;
                height: 56px;
                border-radius: 8px;
                object-fit: cover;
            }
            .name {
                flex: 1;
                margin-left: 16px;

                h3 {
                    font-size: 20px;
                    font-weight: 400;
                    color: #333;
                }
                .en {
                    margin-top: 4px;
                    font-size: 12px;
                    color: #bbb;
                    letter-spacing: 1px;
                }
            }
            .count {
                font-size: 13px;
                color: $xtxColor;
                background: #f0faf7;
                padding: 4px 12px;
                border-radius: 12px;
            }
        }
        .desc {
            margin: 14px 0 0;
            font-size: 14px;
            line-height: 24px;
            color: #666;
        }
        .goods {
            display: flex;
            gap: 14px;
            margin-top: 18px;
            padding-top: 18px;
            border-top: 1px dashed #f0f0f0;

            a {
                width: 150px;
                text-align: center;
                padding: 10px;
                border-radius: 4px;
                transition: all 0.3s;

                img {
                    width: 110px;
                    height: 110px;
                    object-fit: cover;
                    border-radius: 4px;
                }
                .g-name {
                    margin-top: 10px;
                    font-size: 13px;
                    color: #666;
                }
                .g-price {
                    margin-top: 4px;
                    font-size: 15px;
                    color: $priceColor;
                }
                &:hover {
                    background: #f7fbfa;
                }
            }
        }
        .actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 20px;

            .cat {
                font-size: 13px;
                color: #999;
            }
            .iconfont {
                font-size: 12px;
                margin-left: 2px;
            }
        }
    }
    .cooperation {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0;
        padding: 34px 40px;
        border-radius: 4px;
        background: linear-gradient(90deg, #27ba9b 0%, #1dc779 100%);
        color: #fff;

        h3 {
            font-size: 22px;
            font-weight: 400;
        }
        p {
            margin-top: 8px;
            font-size: 14px;
            opacity: 0.9;
        }
        .btns {
            display: flex;
            gap: 12px;
            flex-shrink: 0;

            :deep(.el-button--primary) {
                background: #fff;
                border-color: #fff;
                color: $xtxColor;

                &:hover {
                    background: #fff;
                    border-color: #fff;
                    color: $xtxColor;
                    opacity: 0.88;
                }
            }
            :deep(.el-button--default) {
                background: transparent;
                border-color: rgba(255, 255, 255, 0.6);
                color: #fff;

                &:hover {
                    background: rgba(255, 255, 255, 0.14);
                    border-color: #fff;
                    color: #fff;
                }
            }
        }
    }
</style>
