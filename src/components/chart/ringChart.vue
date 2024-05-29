<script setup lang="ts">
import * as echarts from "echarts";
const props = defineProps<{
  ringId: string;
  chartData: any;
  chartName?: string;
}>();
let chart: any | null = null;
let option: echarts.EChartsOption | null = null;
onMounted(() => {
  let chartDom: any = document.getElementById(props.ringId);
  console.log(props.chartData)
  chart = echarts.init(chartDom, null, {
    renderer: "svg",
  });
  option = {
    title: {
      text: props.chartName,
      left: 'center'
    },
    label: {
      position: "outside",
    },
    series: [
      {
        type: "pie",
        radius: ["46%", "55%"],
        itemStyle: {
          borderColor: "#fff",
        },
        data: props.chartData,
      },
    ],
  };

  option && chart.setOption(option);
});
</script>
<template>
  <div :id="ringId" class="chart"></div>
</template>
<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  scale: 1;
}
</style>
<style></style>
