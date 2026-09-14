// axios基础的封装
import axios from 'axios'
import {ElMessage} from 'element-plus'
import {useUserStore} from '@/stores/userStore.ts'
import router from '@/router'

const httpInstance = axios.create({
    // 1.配置接口基地址
    baseURL: 'https://apipc-xiaotuxian-front.itheima.net',
    // 2.配置接口超时时间
    timeout: 10000
});

// 拦截器
// 3.请求拦截器
httpInstance.interceptors.request.use(config => {
    const userStore = useUserStore();
    const token = userStore?.userInfo?.token;
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));
// 4.响应拦截器
httpInstance.interceptors.response.use(
    result => result.data,
    error => {
        const userStore = useUserStore();
        ElMessage({
            message: error?.response?.data?.message || '登录失败, 请重新登录',
            type: 'error'
        });
        // token失效, 清楚本地token值, 返回登录页
        if(error?.response?.status === 401) {
            userStore.deleteLoginInfo();
            router.replace('/login');
        }
        return Promise.reject(error);
    }
);

export default httpInstance