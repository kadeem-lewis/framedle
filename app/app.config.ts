export default defineAppConfig({
  ui: {
    colors: {
      primary: "amber",
      neutral: "slate",
    },
    container: {
      constrained: "max-w-md",
    },
    button: {
      variant: {
        outline:
          "bg-white/75 dark:bg-neutral-900/75 hover:text-(--ui-primary) text-black dark:text-(--ui-primary) rounded-none",
      },
    },
    card: {
      rounded: "rounded-none",
    },
  },
});
