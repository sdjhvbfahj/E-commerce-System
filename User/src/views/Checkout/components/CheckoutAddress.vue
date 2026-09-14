<template>
    <h3 class="box-title">收货地址</h3>
    <div class="box-body">
        <div class="address">
            <div class="text">
                <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
                <ul v-else>
                    <li><span>收<i />货<i />人：</span>{{ curAddress.receiver }}</li>
                    <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                    <li><span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}</li>
                </ul>
            </div>
            <div class="action">
                <el-button size="large" @click="toggleFlag = true">切换地址</el-button>
                <el-button size="large" @click="addAddress">添加地址</el-button>
            </div>
        </div>
    </div>
    <!-- 切换地址弹出框 -->
    <el-dialog
    v-model="toggleFlag"
    title="切换收货地址"
    width="500"
    center
    >
    <el-scrollbar max-height="380px">
        <div class="changeAddress" v-for="item in checkInfo.userAddresses" :key="item.id" @click="chooseAddress(item)" :class="{active:activeAddress.id === item.id}">
            <div class="text">
                <ul>
                    <li><span>收<i />货<i />人：</span>{{ item.receiver }}</li>
                    <li><span>联系方式：</span>{{ item.contact }}</li>
                    <li><span>收货地址：</span>{{ item.fullLocation }} {{ item.address }}</li>
                </ul>
            </div>
            <div class="revise">
                <!-- 修改地址按钮 -->
                <i class="iconfont icon-bianji" @click="reviseAddress(item)"></i>
                <!-- 删除地址按钮 -->
                <i class="iconfont icon-close" @click="deleteAddress(item.id)"></i>
            </div>
        </div>
    </el-scrollbar>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="toggleFlag = false">取消</el-button>
                <el-button type="primary" @click="changeAddress">确定</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 新增地址弹框 -->
    <ReviseAddressForm :addFlag :changeAddFlag :dialogTitle :getOrderInfo v-bind="$attrs"/>
</template>

<script setup lang="ts" name="CheckoutAddress">
    import {type UserAddressesItem} from '@/apis/checkout.ts'
    import {deleteAddressAPI} from '@/apis/checkout.ts'
    import {ref} from 'vue'
    import ReviseAddressForm from './ReviseAddressForm.vue'
    import emitter from '@/utils/emitter.ts'
    const props = defineProps(['curAddress', 'checkInfo', 'reviseCurAddress', 'getOrderInfo']);
    const toggleFlag = ref(false);
    const addFlag = ref(false);

    // 弹框标题
    const dialogTitle = ref('');

    // 给子组件修改addFlag的值, 控制弹框
    function changeAddFlag(value:boolean) {
        addFlag.value = value;
    }

    // 点击切换地址(改变选中地址样式)
    const activeAddress = ref<UserAddressesItem>({} as UserAddressesItem);
    function chooseAddress(item:UserAddressesItem) {
        activeAddress.value = item;
    }
    // 点击确定按钮切换地址
    function changeAddress() {
        props.reviseCurAddress(activeAddress.value.receiver, activeAddress.value.contact, activeAddress.value.fullLocation, activeAddress.value.address);
        toggleFlag.value = false;
    }

    // 点击新增地址按钮实现
    function addAddress() {
        dialogTitle.value = '添加收货地址';
        addFlag.value = true;
    }

    // 删除表单-点击x删除对应地址信息
    async function deleteAddress(id:string) {
        await deleteAddressAPI(id);
        await props.getOrderInfo();
    }
    
    // 修改地址
    async function reviseAddress(item:UserAddressesItem) {
        dialogTitle.value = '修改收货地址';
        addFlag.value = true;
        emitter.emit('reviseForm', item);
    } 
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

    .address {
        border: 1px solid #f5f5f5;
        display: flex;
        align-items: center;

        .text {
            flex: 1;
            min-height: 90px;
            display: flex;
            align-items: center;

            .none {
                line-height: 90px;
                color: #999;
                text-align: center;
                width: 100%;
            }

            >ul {
                flex: 1;
                padding: 20px;

                li {
                    line-height: 30px;

                    span {
                        color: #999;
                        margin-right: 5px;

                        >i {
                            width: 0.5em;
                            display: inline-block;
                        }
                    }
                }
            }

            >a {
                color: $xtxColor;
                width: 160px;
                text-align: center;
                height: 90px;
                line-height: 90px;
                border-right: 1px solid #f5f5f5;
            }
        }

        .action {
            width: 420px;
            text-align: center;

            .btn {
                width: 140px;
                height: 46px;
                line-height: 44px;
                font-size: 14px;

                &:first-child {
                    margin-right: 10px;
                }
            }
        }
    }
    .changeAddress {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 450px;
        height: 120px;
        border: 1px solid #ccc;
        margin-left: 9px;
        margin-top: 6px;
        cursor: pointer;
        border-radius: 4px;
        .text {
            height: 100%;
            display: flex;
            align-items: center;
            ul {
                li {
                    margin-left: 10px;
                    margin-top: 10px;
                    &:first-child {
                        margin-top: 0px;
                    }
                    span {
                        font-size: 16px;
                        color: #333;
                    }
                }
            }
        }
        .revise {
            display: flex;
            .iconfont {
                display: none;
                width: 20px;
                height: 20px;
                margin-right: 20px;
            }
        }
        &.active {
            border: 1px solid $xtxColor;
            background-color: #e6faf6;
        }
        &:hover {
            border: 1px solid $xtxColor;
            background-color: #e6faf6;
            .iconfont {
                position: relative;
                left: 0px;
                top: 0px;
                display: block;
                transition: all 0.2s;
                &:hover {
                    left: -2px;
                    top: -2px;
                    font-size: 20px;
                }
            }
        }
    }
</style>