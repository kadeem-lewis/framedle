export function useModeCards() {
  const cards = shallowRef([
    {
      label: "Classic",
      route: "/classic",
      source: "/icons/warframe.png",
      background: "/backgrounds/fortuna.jpg",
      description: "Guess the Warframe",
    },
    {
      label: "Ability",
      route: "/ability",
      source: "/icons/PassiveAbilityIcon.png",
      background: "/backgrounds/helminth.jpg",
      description: "Guess the Ability",
    },
    {
      label: "Grid",
      route: "/grid",
      source: "/icons/BuildIcon.png",
      background: "/backgrounds/orbiter.jpg",
      description: "Fill the 3x3 board",
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
