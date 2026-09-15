<template>
    <view class="edit m-page m-page--with-bar">
        <view class="form m-card">
            <view class="form__row">
                <text class="form__label">收货人</text>
                <input class="form__input" v-model="form.receiver" type="text" placeholder="请输入姓名" placeholder-class="ph" />
            </view>
            <view class="form__row">
                <text class="form__label">手机号</text>
                <input class="form__input" v-model="form.contact" type="number" maxlength="11" placeholder="请输入手机号" placeholder-class="ph" />
            </view>
            <picker mode="region" :value="region" @change="onRegionChange">
                <view class="form__row">
                    <text class="form__label">所在地区</text>
                    <text class="form__input" :class="{ ph: !form.fullLocation }">
                        {{ form.fullLocation || '请选择省 / 市 / 区' }}
                    </text>
                </view>
            </picker>
            <view class="form__row form__row--column">
                <text class="form__label">详细地址</text>
                <textarea
                    class="form__textarea"
                    v-model="form.address"
                    placeholder="街道、楼牌号等"
                    placeholder-class="ph"
                    maxlength="120"
                    :auto-height="true"
                />
            </view>
        </view>

        <view class="form m-card">
            <view class="form__row form__row--tags">
                <text class="form__label">标签</text>
                <view class="tags">
                    <view
                        v-for="tag in TAGS"
                        :key="tag"
                        class="chip"
                        :class="{ 'chip--active': form.addressTags === tag }"
                        @click="form.addressTags = form.addressTags === tag ? '' : tag"
                    >
                        <text>{{ tag }}</text>
                    </view>
                </view>
            </view>
            <view class="form__row">
                <text class="form__label">设为默认</text>
                <view class="form__right">
                    <switch :checked="form.isDefault === 0" color="#ef5f2a" @change="onDefaultChange" />
                </view>
            </view>
        </view>

        <view class="m-action-bar">
            <view class="m-btn edit__save" hover-class="m-btn--press" @click="save">
                <text>{{ isEdit ? '保存修改' : '保存并使用' }}</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import { onLoad } from '@dcloudio/uni-app'
    import { addNewAddressAPI, getAddressListAPI, reviseAddressAPI } from '@/apis/checkout.ts'
    import { isMobile } from '@/utils/format.ts'
    import { toast } from '@/utils/auth.ts'

    const TAGS = ['家', '公司', '学校']

    const isEdit = ref(false)
    const region = ref<string[]>(['', '', ''])
    const form = reactive({
        id: '',
        receiver: '',
        contact: '',
        provinceCode: '',
        cityCode: '',
        countyCode: '',
        address: '',
        // 注意：isDefault === 0 才表示默认地址（与用户端逻辑一致）
        isDefault: 1,
        fullLocation: '',
        addressTags: '家',
        postalCode: '310000',
    })

    function onRegionChange(event: any) {
        const value: string[] = event?.detail?.value ?? []
        region.value = value
        form.fullLocation = value.join(' ')
    }

    function onDefaultChange(event: any) {
        form.isDefault = event?.detail?.value ? 0 : 1
    }

    async function save() {
        if (!form.receiver.trim()) {
            toast('请填写收货人')
            return
        }
        if (!isMobile(form.contact)) {
            toast('请填写正确的手机号')
            return
        }
        if (!form.fullLocation) {
            toast('请选择所在地区')
            return
        }
        if (!form.address.trim()) {
            toast('请填写详细地址')
            return
        }

        const payload = {
            receiver: form.receiver.trim(),
            contact: form.contact.trim(),
            provinceCode: form.provinceCode,
            cityCode: form.cityCode,
            countyCode: form.countyCode,
            address: form.address.trim(),
            isDefault: form.isDefault,
            fullLocation: form.fullLocation,
            addressTags: form.addressTags || '家',
            postalCode: form.postalCode,
        }

        if (isEdit.value) {
            await reviseAddressAPI({ id: form.id, ...payload })
            toast('地址已更新', 'success')
        } else {
            await addNewAddressAPI(payload)
            toast('地址已保存', 'success')
        }
        setTimeout(() => uni.navigateBack(), 600)
    }

    onLoad(async (query) => {
        const id = String(query?.id ?? '')
        if (!id) {
            uni.setNavigationBarTitle({ title: '新增收货地址' })
            return
        }
        isEdit.value = true
        uni.setNavigationBarTitle({ title: '编辑收货地址' })
        const result = (await getAddressListAPI()) as any
        const hit = (result.result ?? []).find((item: any) => item.id === id)
        if (!hit) return
        Object.assign(form, hit)
        region.value = String(hit.fullLocation ?? '').split(' ').slice(0, 3)
    })
</script>

<style scoped lang="scss">
    .form {
        margin: $gapMd $pagePadding 0;
        padding: 0 $gapMd;
    }

    .form__row {
        display: flex;
        align-items: center;
        gap: $gapMd;
        padding: $gapMd 0;
        border-bottom: 1px solid $lineColor;

        &:last-child {
            border-bottom: none;
        }

        &--column {
            flex-direction: column;
            align-items: stretch;
            gap: $gapSm;
        }

        &--tags {
            align-items: center;
        }
    }

    .form__label {
        width: 150rpx;
        flex-shrink: 0;
        color: $inkColor2;
        font-size: $fsBase;
    }

    .form__input {
        flex: 1;
        min-width: 0;
        font-size: $fsBase;
        color: $inkColor;
    }

    .form__right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
    }

    .form__textarea {
        width: 100%;
        min-height: 120rpx;
        font-size: $fsBase;
        color: $inkColor;
    }

    .ph {
        color: $inkColor3;
    }

    .tags {
        flex: 1;
        display: flex;
        gap: $gapSm;
    }

    .chip {
        padding: 0 $gapMd;
        height: 56rpx;
        display: flex;
        align-items: center;
        border-radius: 28rpx;
        background: #f4f5f8;
        color: $inkColor2;
        font-size: $fsSm;
        border: 2rpx solid transparent;

        &--active {
            color: $brandColor;
            background: $brandColorSoft;
            border-color: $brandColor;
        }
    }

    .edit__save {
        width: 100%;
    }
</style>
