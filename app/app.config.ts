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
          outline:
            "bg-white/75 dark:bg-neutral-900/75  dark:hover:bg-primary-800/50 dark:text-primary rounded-none",
          tenno: "uppercase rounded-none",
        },
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "outline",
          class:
            "ring-neutral-800 dark:ring-primary text-black hover:ring-primary hover:text-primary",
        },
        {
          color: "primary",
          variant: "tenno",
          class:
            "font-bold dark:text-primary border-b-neutral-800 border border-accented dark:border-default border-b-3 dark:border-b-primary transition-all duration-200 bg-radial-[at_50%_bottom] dark:from-black/60 from-white/60 to-white/20 dark:to-black/20 ease-in hover:to-white/30 dark:hover:to-black/30 hover:border-primary-300/40 hover:border-b-primary-300 dark:hover:from-primary/70 hover:text-primary",
        },
      ],
    },
    fieldGroup: {
      base: "p-1 bg-default dark:bg-elevated",
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
