import AppModal from "~/components/ui/AppModal.vue";

export const dialogOptions = {
  STATS: "stats",
  ABOUT: "about",
  INSTRUCTIONS: "instructions",
  SUPPORT: "support",
  SETTINGS: "settings",
  SUMMARY: "summary",
} as const;

export type DialogOption = (typeof dialogOptions)[keyof typeof dialogOptions];

function useDialogBase() {
  const route = useRoute();
  const router = useRouter();

  const overlay = useOverlay();
  const modal = overlay.create(AppModal);

  const currentInstance = ref<ReturnType<typeof modal.open> | null>(null);
  const isUpdatingRoute = ref(false);

  const openDialog = (option: DialogOption, title: string | null = null) => {
    isUpdatingRoute.value = true;

    if (currentInstance.value) {
      modal.close(currentInstance.value.id);
    }

    if (title === null) {
      title = option;
    }

    const instance = modal.open({
      dialogOption: option,
      title,
    });

    currentInstance.value = instance;

    router
      .replace({
        query: {
          ...route.query,
          dialog: option,
        },
      })
      .finally(() => {
        isUpdatingRoute.value = false;
      });

    instance.result.finally(() => {
      if (currentInstance.value === instance) {
        currentInstance.value = null;
      }

      // Remove dialog parameter from URL if modal was closed via UI
      if (route.query.dialog && !isUpdatingRoute.value) {
        closeDialog();
      }
    });
  };

  const closeDialog = () => {
    // Close the modal if it's open
    if (currentInstance.value) {
      modal.close(currentInstance.value.id);
      currentInstance.value = null;
    }

    // Remove dialog parameter from URL
    if (!isUpdatingRoute.value && route.query.dialog) {
      isUpdatingRoute.value = true;
      const { dialog, ...query } = route.query;
      router
        .replace({
          query,
        })
        .finally(() => {
          isUpdatingRoute.value = false;
        });
    }
  };

  // Watch for route changes to open/close modal based on URL
  watch(
    () => route.query.dialog,
    (dialogParam) => {
      // Skip if we're updating the route programmatically
      if (isUpdatingRoute.value) return;

      if (Array.isArray(dialogParam)) {
        dialogParam = dialogParam[0];
      }

      if (dialogParam) {
        if (!Object.values(dialogOptions).includes(dialogParam as DialogOption))
          return;

        const title =
          dialogParam === dialogOptions.STATS
            ? `${route.name} ${dialogParam}`
            : dialogParam;

        openDialog(dialogParam as DialogOption, title);
      } else {
        // Close if we have an instance
        if (currentInstance.value) {
          closeDialog();
        }
      }
    },
    { immediate: true },
  );

  return {
    openDialog,
    closeDialog,
  };
}

export const useDialog = createSharedComposable(useDialogBase);
