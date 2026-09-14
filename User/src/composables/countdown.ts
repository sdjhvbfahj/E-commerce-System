import {ref, computed, onUnmounted} from 'vue'
import dayjs from 'dayjs'

// 倒计时组件
export const countdown = () => {
    // 清除间歇函数
    let timer:any = null;
    const time = ref(0)
    // 格式化时间
    const formatTime = computed(() => dayjs.unix(time.value).format('mm分ss秒'));
    // 启动倒计时函数
    function startCountdown(startTime:number) {
        time.value = startTime;
        timer = setInterval(() => {
            time.value--;
            if(time.value <= 0) {
                time.value = 0;
                clearInterval(timer);
            }
        }, 1000);
    }
    
    onUnmounted(() => {
        timer && clearInterval(timer);
    });
    return {time, formatTime, startCountdown};
}