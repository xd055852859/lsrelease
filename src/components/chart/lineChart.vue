<script setup lang="ts">
import appStore from "@/store";
import * as echarts from "echarts";
import { storeToRefs } from "pinia";
const props = defineProps<{
  lineId: string;
  chartData: any;
}>();
const dayjs: any = inject("dayjs");
let chart: any | null = null;
let option: echarts.EChartsOption | null = null;
const xAxisData = ref<any>(null);

onMounted(() => {
  let chartDom: any = document.getElementById(props.lineId);
  chart = echarts.init(chartDom);
  option = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: {
      data: props.chartData,
      type: "bar",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          // { offset: 0, color: "#83bff6" },
          { offset: 0.23, color: "#053cfb " },
          { offset: 1, color: "#05f2fb" },
        ]),
      },
    },
  };
  option && chart.setOption(option);
});
</script>
<template>
  <div :id="lineId" class="line-chart"></div>
</template>
<style scoped lang="scss">
.line-chart {
  width: 100%;
  height: 100%;
}
</style>
<style></style>
