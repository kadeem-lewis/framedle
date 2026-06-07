export const useSettingsStore = defineStore(
  "settings",
  () => {
    const showClassicSummary = ref(true);
    return {
      showClassicSummary,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot));
}
