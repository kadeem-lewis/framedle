export default defineAppConfig({
  ui: {
    primary: "amber",
    gray: "neutral",
    container: {
      constrained: "max-w-md",
    },
    button: {
      variant: {
        outline:
          "bg-white/75 dark:bg-gray-800/75 text-gray-800 dark:text-primary",
      },
    },
  },
});
