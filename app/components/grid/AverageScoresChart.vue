<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
const { averageScores } = defineProps<{
  averageScores: {
    [key: string]: number;
  };
}>();

const colorMode = useColorMode();

const chartOptions: ApexOptions = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: Object.keys(averageScores),
    labels: {
      show: true,
    },
    axisTicks: {
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
  tooltip: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: [colorMode.value === "dark" ? "#fff" : "#000"],
    },
  },
  colors: [colorMode.value === "dark" ? "#fbbf24" : "#f59e0b"],
};

const series = [
  {
    name: "Average Scores",
    data: Object.values(averageScores),
  },
];
</script>
<template>
  <div>
    <apexchart type="bar" :options="chartOptions" :series="series" />
  </div>
</template>
