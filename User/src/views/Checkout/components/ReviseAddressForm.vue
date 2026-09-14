<template>
    <el-dialog :modelValue="addFlag" :title="`${dialogTitle}`" width="500" center>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item label="收货人姓名" style="margin-left: 0px;">
                <el-input v-model="form.receiver" placeholder="请输入收货人姓名(必填)"/>
            </el-form-item>
            <el-form-item label="收货人联系方式" style="margin-left: 0px;">
                <el-input v-model="form.contact" placeholder="请输入收货人联系方式(必填)"/>
            </el-form-item>
            <el-form-item label="收货人详细地址" style="margin-left: 0px;">
                <el-input v-model="form.address" placeholder="请输入地区详细地址(必填)"/>
            </el-form-item>
            <el-form-item label="收货人省份编码" style="margin-left: 0px;">
                <el-input v-model="form.provinceCode" placeholder="请输入省份编码(必填)"/>
            </el-form-item>
            <el-form-item label="收货人城市编码" style="margin-left: 0px;">
                <el-input v-model="form.cityCode" placeholder="请输入城市编码(必填)"/>
            </el-form-item>
            <el-form-item label="收货人地区编码" style="margin-left: 0px;">
                <el-input v-model="form.countyCode" placeholder="请输入地区编码(必填)"/>
            </el-form-item>
            <el-form-item label="收货人地址标签" style="margin-left: 0px;">
                <el-input v-model="form.addressTags" placeholder="请输入地址标签, 如家、学校等(非必填)"/>
            </el-form-item>
            <el-form-item label="收货人邮政编码" style="margin-left: 0px;">
                <el-input v-model="form.postalCode" placeholder="请输入邮政编码(非必填)"/>
            </el-form-item>
            <el-form-item label="是否默认收货地址" style="margin-left: 0px;">
                <el-switch v-model="isDefault" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="useCancelButton">取消</el-button>
                <el-button type="primary" @click="submitNewAddress">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts" name="ReviseAddressForm">
    import {ref, reactive} from 'vue'
    import {type UserAddressesItem} from '@/apis/checkout.ts'
    import {reviseAddressAPI} from '@/apis/checkout.ts'
    import emitter from '@/utils/emitter.ts'
    const props = defineProps(['addFlag', 'changeAddFlag', 'addNewAddress', 'dialogTitle', 'getOrderInfo']);
    // 用于接收表单数据
    // isDefault--switch数据
    const isDefault = ref(false);
    // 所有表单数据
    const form = reactive({
        id: '',
        receiver: '',
        contact: '',
        provinceCode: '',
        cityCode: '',
        countyCode: '',
        address: '',
        postalCode: '',
        addressTags: '',
        fullLocation: '',
        isDefault: 0
    });
    const initialForm = {
        id: '',
        receiver: '',
        contact: '',
        provinceCode: '',
        cityCode: '',
        countyCode: '',
        address: '',
        postalCode: '',
        addressTags: '',
        fullLocation: '',
        isDefault: 0
    }
    // 实现取消按钮关闭弹框
    function useCancelButton() {
        props.changeAddFlag(false);
    }

    // 绑定一个修改父组件修改form值的方法(用于实现修改地址)
    emitter.on('reviseForm', (item) => {
        Object.assign(form, item);
        isDefault.value = form.isDefault === 0 ? true : false;
    });

    // 提交表单
    async function submitNewAddress() {
        // 保证顺序调用接口函数
        form.isDefault = isDefault.value ? 0 : 1;
        if(props.dialogTitle === '添加收货地址') { 
            await props.addNewAddress(form);
        } else if(props.dialogTitle === '修改收货地址') {
            await reviseAddressAPI(form);
            props.getOrderInfo();
        }
        Object.assign(form, initialForm);
        props.changeAddFlag(false);
        isDefault.value = false;
    }
</script>

<style scoped lang="scss">

</style>