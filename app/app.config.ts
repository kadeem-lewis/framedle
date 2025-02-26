export default defineAppConfig({
  ui: {
    primary: "amber",
    gray: "slate",
    container: {
      constrained: "max-w-md",
    },
    button: {
      variant: {
        outline:
          "bg-white/75 dark:bg-gray-800/75 hover:text-primary text-black dark:text-primary rounded-none",
      },
    },
    card: {
      rounded: "rounded-none",
    },
  },
});
