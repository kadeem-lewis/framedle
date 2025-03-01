import { useStorage } from "@vueuse/core";
export default defineNuxtPlugin(() => {
  const colorblindMode = useStorage("colorblindMode", false);

  const toggleColorblindMode = () => {
    colorblindMode.value = !colorblindMode.value;
  };

  useHead({
    htmlAttrs: computed(() => ({
      class: colorblindMode.value ? "colorblind" : "",
    })),
  });

  return {
    provide: {
      colorblindMode,
      toggleColorblindMode,
    },
  };
});
