<template>
    <div class="member-address">
        <div class="header">
            <h3>收货地址</h3>
            <el-button type="primary" @click="openForm(null)">新增收货地址</el-button>
        </div>

        <!-- 地址列表 -->
        <ul class="address-list" v-if="addressList.length">
            <li v-for="item in addressList" :key="item.id" :class="{active: item.isDefault === 0}">
                <div class="top">
                    <span class="receiver">{{ item.receiver }}</span>
                    <span class="contact">{{ item.contact }}</span>
                    <span class="tag" v-if="item.addressTags">{{ item.addressTags }}</span>
                    <span class="default" v-if="item.isDefault === 0">默认地址</span>
                </div>
                <p class="location">{{ item.fullLocation }}</p>
                <p class="detail">{{ item.address }}</p>
                <p class="postal" v-if="item.postalCode">邮编：{{ item.postalCode }}</p>
                <div class="actions">
                    <el-button link type="primary" @click="openForm(item)">
                        <i class="iconfont icon-bianji"></i>编辑
                    </el-button>
                    <el-button link type="primary" v-if="item.isDefault !== 0" @click="setDefault(item)">设为默认</el-button>
                    <el-button link type="danger" @click="remove(item)">
                        <i class="iconfont icon-shanchu"></i>删除
                    </el-button>
                </div>
            </li>
        </ul>

        <!-- 空状态 -->
        <el-empty v-else description="还没有收货地址，先添加一个吧">
            <el-button type="primary" @click="openForm(null)">新增收货地址</el-button>
        </el-empty>

        <p class="tip">
            <i class="iconfont icon-tip"></i>
            下单时会默认使用「默认地址」，你可以在结算页随时切换。
        </p>

        <!-- 新增 / 编辑弹框 -->
        <MemberAddressForm v-model="dialogVisible" :address="currentAddress" @success="getAddressList"/>
    </div>
</template>

<script setup lang="ts" name="MemberAddress">
    import { onMounted, ref } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import MemberAddressForm from './MemberAddressForm.vue'
    import { deleteAddressAPI, getAddressListAPI, reviseAddressAPI } from '@/apis/checkout.ts'
    import type { UserAddressesItem } from '@/apis/checkout.ts'

    const addressList = ref<UserAddressesItem[]>([]);
    const dialogVisible = ref(false);
    const currentAddress = ref<UserAddressesItem | null>(null);

    async function getAddressList() {
        const result = await getAddressListAPI() as any;
        addressList.value = result.result || [];
    }

    function openForm(item: UserAddressesItem | null) {
        currentAddress.value = item;
        dialogVisible.value = true;
    }

    // 设为默认（isDefault === 0 表示默认）
    async function setDefault(item: UserAddressesItem) {
        await reviseAddressAPI({ ...item, isDefault: 0 });
        ElMessage({ message: '已设为默认地址', type: 'success' });
        await getAddressList();
    }

    async function remove(item: UserAddressesItem) {
        try {
            await ElMessageBox.confirm(`确定删除「${item.receiver}」的这条收货地址吗？`, '删除地址', {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning'
            });
        } catch {
            return;
        }
        await deleteAddressAPI(item.id);
        ElMessage({ message: '地址已删除', type: 'success' });
        await getAddressList();
    }

    onMounted(() => {
        getAddressList();
    });
</script>

<style scoped lang="scss">
    .member-address {
        padding: 24px 30px 40px;

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 18px;
            border-bottom: 1px solid #f5f5f5;

            h3 {
                font-size: 20px;
                font-weight: 400;
                color: #333;
            }
        }
        .address-list {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-top: 20px;

            > li {
                position: relative;
                width: 450px;
                padding: 20px;
                border: 1px solid #ebebeb;
                border-radius: 4px;
                transition: all 0.3s;

                &.active {
                    border-color: $xtxColor;
                    background: #f9fdfc;
                }
                &:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
                }
            }
        }
        .top {
            display: flex;
            align-items: center;
            gap: 10px;

            .receiver {
                font-size: 16px;
                color: #333;
            }
            .contact {
                font-size: 14px;
                color: #666;
            }
            .tag {
                font-size: 12px;
                color: #666;
                background: #f5f5f5;
                border-radius: 3px;
                padding: 1px 8px;
            }
            .default {
                font-size: 12px;
                color: #fff;
                background: $xtxColor;
                border-radius: 3px;
                padding: 1px 8px;
            }
        }
        .location {
            margin-top: 12px;
            font-size: 14px;
            color: #333;
        }
        .detail {
            margin-top: 6px;
            font-size: 14px;
            line-height: 22px;
            color: #666;
        }
        .postal {
            margin-top: 6px;
            font-size: 12px;
            color: #bbb;
        }
        .actions {
            display: flex;
            gap: 16px;
            margin-top: 14px;
            padding-top: 12px;
            border-top: 1px dashed #f0f0f0;

            .iconfont {
                font-size: 12px;
                margin-right: 3px;
            }
        }
        .tip {
            margin-top: 24px;
            font-size: 13px;
            color: #999;

            .iconfont {
                color: $warnColor;
                margin-right: 4px;
            }
        }
    }
</style>
