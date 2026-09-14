import {ref} from 'vue'
import emitter from '@/utils/emitter.ts'

// 创建响应式数据来接受鼠标在该元素里面的坐标
interface CoordinateItem {
    x: number,
    y: number,
    inside: boolean
}

const ListenMouseCoordinate = () => {
    const coordinate = ref<CoordinateItem>({
        x: 0,
        y: 0,
        inside: false
    });
    // 防止图片还未渲染导致获取的宽高不正确
    emitter.on('initCoordinate', () => {
        // 给需要监听的元素加上listenBox标签
        const listenBox = document.querySelector('.listenBox') as HTMLElement;
        listenBox.addEventListener('mouseenter', () => {
            coordinate.value.inside = true;
        });
        listenBox.addEventListener('mouseleave', () => {
            coordinate.value.inside = false;
        });
        listenBox.addEventListener('mousemove', (e) => {
            const boxCoordinate = listenBox.getBoundingClientRect();
            coordinate.value.x = e.clientX - boxCoordinate.x;
            coordinate.value.y = e.clientY - boxCoordinate.y;
        });
    });
    return coordinate;
}
export default ListenMouseCoordinate;