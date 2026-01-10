<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
import { defu } from "defu";
const { scores } = defineProps<{
  scores: {
    [key: string]: number;
  };
}>();

const chart = useTemplateRef("chart");
const { baseOptions } = useChartConfig(chart);

const chartOptions = computed<ApexOptions>(() => {
  return defu(
    {
      xaxis: {
        categories: Object.keys(scores),
        labels: {
          show: true,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top",
          },
          borderRadius: 3,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        offsetY: -16,
        formatter: (value: number) => {
          if (value === 0) return "";
          if (value > 1000) return Math.floor(value / 1000).toFixed(1) + "k";
          return value;
        },
      },
    },
    baseOptions.value,
  );
});

const series = computed(() => [
  {
    name: "Frequency",
    data: Object.values(scores),
  },
]);
</script>
<template>
  <apexchart ref="chart" type="bar" :options="chartOptions" :series="series" />
</template>
