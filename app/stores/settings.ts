export const useSettingsStore = defineStore(
  "settings",
  () => {
    const showClassicSummary = ref(true);
    const showBackground = ref(true);
    const shouldHideCompletedGames = ref(false);
    return {
      showClassicSummary,
      showBackground,
      shouldHideCompletedGames,
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
