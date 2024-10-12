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
          "bg-gray-100/75 dark:bg-gray-800/75 hover:text-primary text-black dark:text-primary",
      },
    },
  },
});
