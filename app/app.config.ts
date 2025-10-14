export default defineAppConfig({
  ui: {
    colors: {
      primary: "amber",
      neutral: "slate",
      discord: "discord",
      bluesky: "bluesky",
    },
    button: {
      variants: {
        variant: {
          outline:
            "bg-white/75 dark:bg-neutral-900/75 hover:text-primary dark:hover:bg-primary-800/50 text-black dark:text-primary rounded-none",
        },
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "outline",
          class:
            "ring-neutral-800 dark:ring-primary text-black hover:ring-primary hover:text-primary",
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
