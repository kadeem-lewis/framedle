import { useStorage } from "@vueuse/core";
export default defineNuxtPlugin(() => {
  const colorblindMode = useStorage("colorblindMode", false);

  const toggleColorblindMode = () => {
    colorblindMode.value = !colorblindMode.value;
  };

  useHead({
    htmlAttrs: {
      class: computed(() => (colorblindMode.value ? "colorblind" : "")),
    },
  });

  return {
    provide: {
      colorblindMode,
      toggleColorblindMode,
    },
  };
});
