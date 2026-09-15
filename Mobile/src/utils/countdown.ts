import { ref, computed } from 'vue';
import dayjs from 'dayjs';

/**
 * 倒计时（待付款订单用）
 * 与用户端 composables/countdown 同名同用法，额外提供 stop()，
 * 页面 onUnload 时手动停掉，避免 App 端页面栈残留定时器。
 */
export const useCountdown = () => {
    let timer: ReturnType<typeof setInterval> | null = null;
    const time = ref(0);

    const formatTime = computed(() => dayjs.unix(Math.max(0, time.value)).format('mm分ss秒'));

    function startCountdown(startTime: number) {
        stop();
        time.value = startTime;
        timer = setInterval(() => {
            time.value -= 1;
            if (time.value <= 0) {
                time.value = 0;
                stop();
            }
        }, 1000);
    }

    function stop() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    return { time, formatTime, startCountdown, stop };
};
