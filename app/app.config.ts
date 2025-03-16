export default defineAppConfig({
  ui: {
    colors: {
      primary: "amber",
      neutral: "slate",
    },
    button: {
      variants: {
        variant: {
          outline:
            "bg-white/75 dark:bg-neutral-900/75 hover:text-(--ui-primary) dark:hover:bg-primary-800/50 text-black dark:text-(--ui-primary) rounded-none",
        },
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "outline",
          class:
            "ring-neutral-800 dark:ring-(--ui-primary) text-black hover:ring-(--ui-primary) hover:text-(--ui-primary)",
        },
      ],
    },
    card: {
      slots: {
        root: "rounded-none",
      },
    },
  },
});
