import type { ApexOptions } from "apexcharts";

export function useChartConfig(chartRef: Ref<HTMLElement | null>) {
  const primaryColor = useCssVar("--ui-primary", chartRef);
  const textColor = useCssVar("--ui-text", chartRef);

  // These values can be undefined and it is causing ts errors for ApexOptions since colors can't be undefined there.

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
    // I am asserting that useCSSVars is not undefined which I don't think it can be since it should always be defined in the CSS, but I need to do this to satisfy the ApexOptions type.
    dataLabels: {
      enabled: true,
      style: {
        fontFamily: "Noto Sans, sans-serif",
        colors: [textColor.value!],
      },
    },
    colors: [primaryColor.value!],
  }));
  return {
    baseOptions,
  };
}
