export default defineAppConfig({
  ui: {
    colors: {
      primary: "amber",
      neutral: "stone",
      discord: "discord",
      bluesky: "bluesky",
      reddit: "reddit",
    },
    icons: {
      light: "i-heroicons-sun-solid",
      dark: "i-heroicons-moon-solid",
      system: "i-heroicons-computer-desktop",
    },
    button: {
      variants: {
        variant: {
          outline: "rounded-none",
          tenno: "uppercase rounded-none",
        },
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "outline",
          class:
            "ring-neutral-800 dark:ring-primary bg-white/75 dark:bg-neutral-900/75 hover-gradient text-neutral-700 dark:text-primary hover:ring-primary hover:text-primary",
        },
        {
          color: "primary",
          variant: "tenno",
          class:
            "font-bold dark:text-primary border border-accented dark:border-default border-b-2 border-b-neutral-400 dark:border-b-primary bg-neutral-100/70 dark:bg-neutral-950 hover:border-primary-400 dark:hover:border-accented hover:border-b-primary-500 dark:hover:border-b-primary-300 hover:text-primary hover-gradient",
        },
      ],
    },
    card: {
      slots: {
        root: "rounded-none",
      },
    },
    tabs: {
      variants: {
        variant: {
          tenno: {
            list: "rounded-none bg-default p-0 border-default uppercase dark:bg-elevated",
            trigger:
              "grow  rounded-none flex items-start data-[state=active]:bg-default data-[state=active]:border-b-4",
            indicator: "rounded-none",
            label: "uppercase font-semibold",
          },
        },
        size: {
          md: {
            trigger: "px-4 py-2",
          },
        },
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "tenno",
          class: {
            label: "dark:text-primary",
            trigger:
              "dark:border-primary dark:hover:data-[state=active]:border-primary-300 dark:hover:text-primary-300",
          },
        },
      ],
    },
  },
});
