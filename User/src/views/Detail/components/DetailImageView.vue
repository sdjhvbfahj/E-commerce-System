<template>
    <div class="DetailImageView">
        <div class="left listenBox">
            <img :src="detailList.mainPictures?.[hoverImgIndex]" @load="initLayer">
            <div class="layer" :style="`top:${coordinate.y-100}px; left:${coordinate.x-100}px;`"></div>
            <div class="largeImg" :style="`
                background-image: url(${detailList.mainPictures?.[hoverImgIndex]});
                background-size: 800px 800px;
                background-position: ${(-coordinate.x+100)*2}px ${(-coordinate.y+100)*2}px;
            `">
            </div>
        </div>
        <div class="right">
            <ul>
                <!-- 动态类名控制, 判断是否激活该类名 -->
                <li v-for="(item, index) in detailList.mainPictures as []" @mouseenter="changeIndex(index)" :class="{active: hoverImgIndex === index}">
                    <img :src="item">
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts" name="DetailImageView">
    import {ref, watch} from 'vue'
    import ListenMouseCoordinate from '@/utils/listenMouseCoordinate.ts'
    import emitter from '@/utils/emitter.ts'
    defineProps(['detailList']);
    // 获取鼠标选择展示的图片的索引值
    const hoverImgIndex = ref(0);
    // 改变展示的图片(改变索引值)
    function changeIndex(index:number) {
        hoverImgIndex.value = index;
    }
    // 图片正确渲染以后再判断鼠标坐标位置
    function initLayer() {
        emitter.emit('initCoordinate');
    }
    // ref响应式数据, 用于获取坐标数据
    const coordinate = ListenMouseCoordinate();
    watch(coordinate, () => {
        if(coordinate.value.inside === true) {
            // 判断位置逻辑, 防止滑块超出界限范围
            if(coordinate.value.x <= 100) {
                coordinate.value.x = 100;
            } else if(coordinate.value.x >= 300) {
                coordinate.value.x = 300;
            }
            if(coordinate.value.y <= 100) {
                coordinate.value.y = 100;
            } else if(coordinate.value.y >= 300) {
                coordinate.value.y = 300;
            }
        } else {
            coordinate.value.x = 100;
            coordinate.value.y = 100;
        }
    },{deep:true});
</script>

<style scoped lang="scss">
    .DetailImageView {
        width: 100%;
        height: 400px;
        display: flex;
        .left {
            width: 400px;
            height: 100%;
            position: relative;
            &:hover {
                .layer {
                    display: block;
                }
                .largeImg {
                    display: block;
                }
            }
            img {
                background: #eee;
                width: 100%;
                height: 100%;
            }
            .layer {
                display: none;
                position: absolute;
                left: 0px;
                top: 0px;
                width: 200px;
                height: 200px;
                background-color: rgba(0, 0, 0, 0.2);
                cursor: move;
            }
            .largeImg {
                display: none;
                position: absolute;
                top: 0px;
                left: 416px;
                width: 400px;
                height: 400px;
                box-shadow: 0px 0px 6px 3px rgba(0, 0, 0, 0.1);
                z-index: 998;
                background: #eee;
            }
        }
        .right {
            width: 80px;
            height: 100%;
            ul {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: space-between;
                width: 100%;
                height: 100%;
                li {
                    cursor: pointer;
                    width: 64px;
                    height: 64px;
                    &.active {
                        border: 2px solid $xtxColor;
                    }
                    img {
                        background: #eee;
                    }
                }
            }
        }
    }
</style>