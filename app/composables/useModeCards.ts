export function useModeCards() {
  const { stats } = storeToRefs(useStatsStore());

  const cards = shallowRef([
    {
      label: "Classic",
      route: "/classic",
      source: "/icons/Warframe.png",
      background: "/backgrounds/fortuna.jpg",
      description: "Guess the Warframe",
      streak: stats.value.classic.streak,
    },
    {
      label: "Ability",
      route: "/ability",
      source: "/icons/ObscuredAbility.png",
      background: "/backgrounds/helminth.jpg",
      description: "Guess the Ability",
      streak: stats.value.ability.streak,
    },
    {
      label: "Grid",
      route: "/grid",
      source: "/icons/PartiallyFilledGrid.svg",
      background: "/backgrounds/orbiter.jpg",
      description: "Fill the 3x3 board",
      streak: stats.value.grid.streak,
    },
    {
      label: "Coming Soon",
      route: "",
      source: "/icons/EarthWithUnknownMarkers.svg",
      background: "/backgrounds/orbiter.jpg",
      description: "",
      streak: 0,
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
