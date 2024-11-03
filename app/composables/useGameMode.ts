export type gameMode =
  | "classic"
  | "classicUnlimited"
  | "ability"
  | "abilityUnlimited";

export function useGameMode() {
  const mode = ref<gameMode>();
  const route = useRoute();

  watch(
    () => route.query.mode,
    () => {
      if (!route.query.mode) {
        mode.value = route.name as gameMode;
      }
      if (route.query.mode === "unlimited") {
        mode.value = `${route.name}Unlimited` as gameMode;
      }
    },
    { immediate: true },
  );
  return mode;
}
