import {getOrderInfoAPI, addNewAddressAPI} from '@/apis/checkout.ts'
import type {UserAddressesItem, OrderInfoItem, AddNewAddress} from '@/apis/checkout.ts'
import {ref, onMounted} from 'vue'

export const useCheckout = () => {
    const checkInfo = ref<OrderInfoItem>({} as OrderInfoItem)  // 订单对象
    const curAddress = ref<UserAddressesItem>({} as UserAddressesItem)  // 地址对象
    // 从服务器获取数据
    const getOrderInfo = async () => {
        const result = await getOrderInfoAPI() as any;
        checkInfo.value = result.result;
        // 创建一个新的常量, 接收isDefault为0的地址数据, 防止直接将curAddress.value赋值(地址指向同一个数据, 会影响checkInfo的数据)
        const addressItem = checkInfo?.value?.userAddresses.find((item) => {
            return item.isDefault === 0;
        }) || {} as UserAddressesItem;
        // addressItem完成地址传递, 然后addressItem通过展开运算符将数据赋值给curAddress.value
        curAddress.value = {...addressItem};
    }
    // 改变选中地址
    const reviseCurAddress = (receiver:string, contact:string, fullLocation:string, address:string) => {
        Object.assign(curAddress.value, {receiver, contact, fullLocation, address});
    }
    // 新增地址
    const addNewAddress = async (data:AddNewAddress) => {
        await addNewAddressAPI(data);
        await getOrderInfo();
    }
    onMounted(() => {
        getOrderInfo();
    });
    return {checkInfo, curAddress, reviseCurAddress, getOrderInfo, addNewAddress};
}

