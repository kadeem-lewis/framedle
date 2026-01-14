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
  const activeDialog = ref<DialogOption | null>(null);
  const isUpdatingRoute = ref(false);

  const closeDialog = () => {
    // Close the modal if it's open
    if (currentInstance.value) {
      modal.close(currentInstance.value.id);
      currentInstance.value = null;
    }

    activeDialog.value = null;

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

  const openDialog = (option: DialogOption, title: string | null = null) => {
    // This prevents the watcher from re-opening the dialog after the URL updates.
    if (activeDialog.value === option) {
      return;
    }

    isUpdatingRoute.value = true;

    // Close any existing dialog before opening the new one
    if (currentInstance.value) {
      modal.close(currentInstance.value.id);
      // We do not nullify currentInstance here; it will be overwritten below.
    }

    if (title === null) {
      title = option;
    }

    activeDialog.value = option;

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
      // Only clean up if THIS instance is still the current one.
      if (currentInstance.value === instance) {
        currentInstance.value = null;
        activeDialog.value = null;

        // Sync URL: If the URL still says this dialog is open, close it.
        // We check !isUpdatingRoute to ensure we don't fight the router during a transition.
        if (route.query.dialog === option && !isUpdatingRoute.value) {
          closeDialog();
        }
      }
    });
  };

  // Watch for route changes to open/close modal based on URL
  watch(
    () => route.query.dialog,
    (dialogParam) => {
      // Skip if we are currently performing a route update ourselves
      if (isUpdatingRoute.value) return;

      if (Array.isArray(dialogParam)) {
        dialogParam = dialogParam[0];
      }

      if (dialogParam) {
        if (!Object.values(dialogOptions).includes(dialogParam as DialogOption))
          return;

        // CRITICAL FIX: If the URL matches the active dialog, stop.
        if (activeDialog.value === dialogParam) return;

        const title =
          dialogParam === dialogOptions.STATS
            ? `${route.name} ${dialogParam}`
            : dialogParam;

        openDialog(dialogParam as DialogOption, title);
      } else {
        // If URL has no dialog, but we have an active one, close it.
        if (currentInstance.value || activeDialog.value) {
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
