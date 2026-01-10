import type { ApexOptions } from "apexcharts";

export function useChartConfig(chartRef: Ref<HTMLElement | null>) {
  const primaryColor = useCssVar("--ui-primary", chartRef);
  const textColor = useCssVar("--ui-text", chartRef);

  const baseOptions = computed<ApexOptions>(() => ({
    chart: {
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        filter: {
          type: "none",
        },
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
        fontFamily: "Noto Sans, sans-serif",
        colors: [textColor.value],
      },
    },
    colors: [primaryColor.value],
  }));
  return {
    baseOptions,
  };
}
