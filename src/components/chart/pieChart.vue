<script setup lang="ts">
// import { fontSizeToRem } from "@/services/util/common";
import appStore from "@/store";
import * as echarts from "echarts";
import { storeToRefs } from "pinia";
const props = defineProps<{
  pieId: string;
  chartData: any;
}>();
const dayjs: any = inject("dayjs");
let chart: any | null = null;
let option: echarts.EChartsOption | null = null;
onMounted(() => {
  let chartDom: any = document.getElementById(props.pieId);
  chart = echarts.init(chartDom, null, {
    renderer: "svg",
  });
  option = {
    label: {
      position: "outside",
      color: "#fff",
    },
    series: [
      {
        type: "pie",
        // radius: [fontSizeToRem(18), fontSizeToRem(125)],
        center: ["50%", "50%"],
        roseType: "area",
        itemStyle: {
          borderColor: "#fff",
        },
        data: props.chartData,
        top: "5%",
        left:"-10%"
      },
    ],
  };

  option && chart.setOption(option);
  chart.set;
});
</script>
<template>
  <div :id="pieId" class="pie-chart"></div>
</template>
<style scoped lang="scss">
.pie-chart {
  width: 100%;
  height: 100%;
  scale: 1.3;
}
</style>
<style></style>
