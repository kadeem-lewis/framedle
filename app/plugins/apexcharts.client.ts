import VueApexCharts from "vue3-apexcharts/core";
import "apexcharts/bar";

export default defineNuxtPlugin({
  name: "apexcharts",
  parallel: true,
  setup(nuxtApp) {
    nuxtApp.vueApp.use(VueApexCharts);
  },
});
