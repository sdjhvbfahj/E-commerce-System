<template>
    <el-dialog
        :modelValue="modelValue"
        :title="isEdit ? '修改收货地址' : '新增收货地址'"
        width="560"
        center
        @update:modelValue="(value:boolean) => emit('update:modelValue', value)"
    >
        <el-form :model="form" :rules="rules" ref="formRef" label-width="110px" status-icon>
            <el-form-item label="收货人姓名" prop="receiver">
                <el-input v-model="form.receiver" placeholder="请输入收货人姓名(必填)"/>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
                <el-input v-model="form.contact" placeholder="请输入收货人联系方式(必填)"/>
            </el-form-item>
            <el-form-item label="所在地区" prop="fullLocation">
                <el-input v-model="form.fullLocation" placeholder="如：浙江省 杭州市 西湖区(必填)"/>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
                <el-input v-model="form.address" type="textarea" :rows="2" placeholder="如：文三路 199 号 3 幢 502 室(必填)"/>
            </el-form-item>
            <el-form-item label="地址标签">
                <el-input v-model="form.addressTags" placeholder="如：家、公司、学校(非必填)"/>
            </el-form-item>
            <el-form-item label="邮政编码">
                <el-input v-model="form.postalCode" placeholder="(非必填)"/>
            </el-form-item>
            <el-form-item label="设为默认地址">
                <el-switch v-model="isDefault"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="emit('update:modelValue', false)">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts" name="MemberAddressForm">
    import { computed, reactive, ref, watch } from 'vue'
    import type { FormRules } from 'element-plus'
    import { ElMessage } from 'element-plus'
    import { addNewAddressAPI, reviseAddressAPI } from '@/apis/checkout.ts'
    import type { AddNewAddress, UserAddressesItem } from '@/apis/checkout.ts'

    const props = defineProps<{
        modelValue: boolean,
        address?: UserAddressesItem | null
    }>();
    const emit = defineEmits(['update:modelValue', 'success']);

    const formRef = ref();
    const isDefault = ref(false);
    const isEdit = computed(() => Boolean(props.address?.id));

    // 表单初始值
    const initialForm = (): AddNewAddress & { id: string } => ({
        id: '',
        receiver: '',
        contact: '',
        provinceCode: '',
        cityCode: '',
        countyCode: '',
        address: '',
        postalCode: '',
        addressTags: '',
        isDefault: 0,
        fullLocation: ''
    });
    const form = reactive(initialForm());

    const rules = reactive<FormRules>({
        receiver: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
        contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        fullLocation: [{ required: true, message: '请输入所在地区', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
    });

    // 每次打开弹框时同步数据（新增则清空，编辑则回填）
    watch(() => props.modelValue, (visible) => {
        if (!visible) return;
        Object.assign(form, initialForm());
        if (props.address) {
            Object.assign(form, props.address);
            isDefault.value = props.address.isDefault === 0;
        } else {
            isDefault.value = false;
        }
        formRef.value?.clearValidate();
    });

    async function submit() {
        formRef.value.validate(async (valid:boolean) => {
            if (!valid) return;
            // isDefault === 0 表示默认地址（与页面逻辑保持一致）
            const payload = { ...form, isDefault: isDefault.value ? 0 : 1 };
            try {
                if (isEdit.value) {
                    await reviseAddressAPI(payload as UserAddressesItem);
                    ElMessage({ message: '地址修改成功', type: 'success' });
                } else {
                    await addNewAddressAPI(payload);
                    ElMessage({ message: '地址添加成功', type: 'success' });
                }
                emit('update:modelValue', false);
                emit('success');
            } catch (error) {}
        });
    }
</script>

<style scoped lang="scss">

</style>
