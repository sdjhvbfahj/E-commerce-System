<template>
    <view class="addr m-page m-page--with-bar">
        <template v-if="list.length">
            <view class="list">
                <view v-for="item in list" :key="item.id" class="item m-card" hover-class="item--press" @click="onSelect(item)">
                    <view class="item__head">
                        <text class="item__name">{{ item.receiver }}</text>
                        <text class="item__mobile">{{ item.contact }}</text>
                        <text v-if="item.addressTags" class="m-tag m-tag--gray">{{ item.addressTags }}</text>
                        <text v-if="item.isDefault === 0" class="m-tag">默认</text>
                    </view>
                    <text class="item__detail">{{ item.fullLocation }} {{ item.address }}</text>
                    <view class="item__actions">
                        <view class="item__action" @click.stop="edit(item)">
                            <text>编辑</text>
                        </view>
                        <view class="item__action item__action--danger" @click.stop="remove(item)">
                            <text>删除</text>
                        </view>
                    </view>
                </view>
            </view>
        </template>

        <MEmpty v-else text="还没有收货地址" tip="添加一个地址，下单更顺手" action-text="新增地址" @action="add" />

        <view class="m-action-bar">
            <view class="m-btn addr__add" hover-class="m-btn--press" @click="add">
                <text>新增收货地址</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { onLoad, onShow } from '@dcloudio/uni-app'
    import { deleteAddressAPI, getAddressListAPI } from '@/apis/checkout.ts'
    import { toast } from '@/utils/auth.ts'

    const list = ref<any[]>([])
    const selectMode = ref(false)

    async function getList() {
        const result = (await getAddressListAPI()) as any
        list.value = result.result ?? []
    }

    /** 从结算页进来时，点一下即选中并返回 */
    function onSelect(item: any) {
        if (!selectMode.value) return
        uni.$emit('address-selected', item)
        uni.navigateBack()
    }

    function add() {
        uni.navigateTo({ url: '/pages/address/edit' })
    }

    function edit(item: any) {
        uni.navigateTo({ url: `/pages/address/edit?id=${item.id}` })
    }

    function remove(item: any) {
        uni.showModal({
            title: '删除地址',
            content: '确定删除这条收货地址吗？',
            success: async (res) => {
                if (!res.confirm) return
                await deleteAddressAPI(item.id)
                toast('已删除')
                getList()
            },
        })
    }

    onLoad((query) => {
        selectMode.value = String(query?.select ?? '') === '1'
        uni.setNavigationBarTitle({ title: selectMode.value ? '选择收货地址' : '收货地址' })
    })

    onShow(() => {
        getList()
    })
</script>

<style scoped lang="scss">
    .list {
        padding: $gapMd $pagePadding 0;
        display: flex;
        flex-direction: column;
        gap: $gapMd;
    }

    .item {
        padding: $gapMd;

        &--press {
            background: #fafbfc;
        }
    }

    .item__head {
        display: flex;
        align-items: center;
        gap: $gapSm;
    }

    .item__name {
        font-size: $fsMd;
        font-weight: 600;
        color: $inkColor;
    }

    .item__mobile {
        color: $inkColor2;
        font-size: $fsSm;
    }

    .item__detail {
        display: block;
        margin-top: $gapSm;
        color: $inkColor2;
        font-size: $fsSm;
        line-height: 1.45;
    }

    .item__actions {
        display: flex;
        justify-content: flex-end;
        gap: $gapLg;
        margin-top: $gapMd;
        padding-top: $gapMd;
        border-top: 1px solid $lineColor;
    }

    .item__action {
        font-size: $fsSm;
        color: $inkColor2;

        &--danger {
            color: $helpColor;
        }
    }

    .addr__add {
        width: 100%;
    }
</style>
