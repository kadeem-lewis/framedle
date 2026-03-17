export function useModeCards() {
  const img = useImage();

  const { stats } = storeToRefs(useStatsStore());

  const cards = shallowRef([
    {
      label: "Classic",
      route: "/classic",
      source: "/icons/warframe.png",
      background: img("/backgrounds/fortuna.jpg", { format: "webp" }),
      description: "Guess the Warframe",
      streak: stats.value.classic.streak,
    },
    {
      label: "Ability",
      route: "/ability",
      source: "/icons/PassiveAbilityIcon.png",
      background: img("/backgrounds/helminth.jpg", { format: "webp" }),
      description: "Guess the Ability",
      streak: stats.value.ability.streak,
    },
    {
      label: "Grid",
      route: "/grid",
      source: "/icons/BuildIcon.png",
      background: img("/backgrounds/orbiter.jpg", { format: "webp" }),
      description: "Fill the 3x3 board",
      streak: stats.value.grid.streak,
    },
  ]);

  const activeCards = computed(() => {
    return cards.value.filter((card) => card.route !== "");
  });

  return {
    cards,
    activeCards,
  };
}
