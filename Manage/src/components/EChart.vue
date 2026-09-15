<template>
    <div ref="chartRef" class="es-echart" :style="{ width, height }"></div>
</template>

<script setup lang="ts" name="EChart">
    import * as echarts from 'echarts/core'
    import { BarChart, LineChart, PieChart } from 'echarts/charts'
    import {
        DataZoomComponent,
        GridComponent,
        LegendComponent,
        TitleComponent,
        TooltipComponent,
    } from 'echarts/components'
    import { CanvasRenderer } from 'echarts/renderers'
    import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
    import { useResizeObserver } from '@vueuse/core'

    // 按需注册，控制包体积
    echarts.use([LineChart, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer])

    const props = withDefaults(
        defineProps<{
            option: Record<string, any>;
            height?: string;
            width?: string;
        }>(),
        { height: '320px', width: '100%' },
    );

    const chartRef = ref<HTMLDivElement>();
    let chart: echarts.ECharts | undefined;

    function render() {
        if (!chartRef.value) return;
        if (!chart) chart = echarts.init(chartRef.value);
        chart.setOption(props.option, true);
    }

    onMounted(() => {
        render();
        // 页面刚挂载时容器尺寸可能还是 0，下一帧再画一次
        requestAnimationFrame(render);
    });

    watch(() => props.option, () => render(), { deep: true });

    useResizeObserver(chartRef, () => chart?.resize());

    onBeforeUnmount(() => {
        chart?.dispose();
        chart = undefined;
    });
</script>

<style scoped lang="scss">
    .es-echart {
        min-height: 100px;
    }
</style>
