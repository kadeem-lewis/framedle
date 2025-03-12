import AppModal from "~/components/ui/AppModal.vue";

export const dialogOptions = {
  STATS: "stats",
  ABOUT: "about",
  INSTRUCTIONS: "instructions",
  SUPPORT: "support",
  SETTINGS: "settings",
} as const;

export type DialogOption = (typeof dialogOptions)[keyof typeof dialogOptions];

export function useDialog() {
  const route = useRoute();
  const router = useRouter();

  const overlay = useOverlay();
  const modal = overlay.create(AppModal);

  const openDialog = (option: DialogOption, title: string | null = null) => {
    if (title === null) {
      title = option;
    }

    modal.open({
      dialogOption: option,
      title,
    });

    router.replace({
      query: {
        ...route.query,
        dialog: option,
      },
    });
  };

  const closeDialog = () => {
    const { dialog, ...query } = route.query;

    router.replace({
      query,
    });
  };

  watchEffect(() => {
    let dialogParam = route.query.dialog as
      | DialogOption
      | DialogOption[]
      | undefined;

    if (Array.isArray(dialogParam)) {
      dialogParam = dialogParam[0];
    }

    if (dialogParam) {
      if (!Object.values(dialogOptions).includes(dialogParam)) return;

      const title =
        dialogParam === dialogOptions.STATS
          ? `${route.name} ${dialogParam}`
          : dialogParam;

      modal.open({
        dialogOption: dialogParam,
        title,
      });
    }
  });

  return {
    openDialog,
    closeDialog,
  };
}
