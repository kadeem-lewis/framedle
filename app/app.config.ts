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
            "bg-white/75 dark:bg-neutral-900/75 hover:text-(--ui-primary) text-black dark:text-(--ui-primary) rounded-none",
        },
      },
    },
    card: {
      slots: {
        root: "rounded-none",
      },
    },
  },
});
