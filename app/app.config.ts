import { tw } from "~/utils/tw";

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
          variant: "tenno",
          class: tw`border border-b-2 border-accented border-b-neutral-400 bg-neutral-100/70 hover-gradient font-bold hover:border-primary-400 hover:border-b-primary-500 hover:text-primary dark:border-default dark:border-b-primary dark:bg-neutral-950 dark:text-primary dark:hover:border-accented dark:hover:border-b-primary-300`,
        },
        {
          color: "neutral",
          variant: "tenno",
          class: tw`border border-b-3 border-accented border-b-neutral-400 bg-default hover-gradient hover:border-b-primary-600 hover:text-primary-600 dark:border-b-neutral-500 dark:hover:border-accented dark:hover:border-b-primary dark:hover:text-primary`,
        },
        {
          color: "neutral",
          variant: "tenno",
          leading: true,
          class: {
            leadingIcon: tw`text-default group-hover:text-primary-600 dark:group-hover:text-primary`,
          },
        },
        {
          color: "primary",
          variant: "solid",
          class: tw`text-neutral-800`,
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
            list: tw`rounded-none border border-accented bg-default p-0 dark:bg-elevated`,
            trigger: tw`flex grow items-start rounded-none data-[state=active]:border-b-4 data-[state=active]:dark:bg-default/40`,
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
            trigger: tw`data-[state=active]:bg-accented/40 hover:data-[state=inactive]:not-disabled:text-primary dark:border-primary data-[state=active]:dark:text-primary dark:hover:data-[state=active]:border-primary-300`,
          },
        },
      ],
    },
  },
});
