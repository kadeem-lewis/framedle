export function useModeCards() {
  const { t } = useI18n();
  const img = useImage();

  const { stats } = storeToRefs(useStatsStore());

  const cards = shallowRef([
    {
      label: t("home.classic_card.title"),
      route: "/classic",
      source: "/warframe.png",
      background: img("/backgrounds/fortuna.jpg", { format: "webp" }),
      description: t("home.classic_card.description"),
      streak: stats.value.classic.streak,
    },
    {
      label: t("home.ability_card.title"),
      route: "/ability",
      source: "/PassiveAbilityIcon.png",
      background: img("/backgrounds/helminth.jpg", { format: "webp" }),
      description: t("home.ability_card.description"),
      streak: stats.value.ability.streak,
    },
    {
      label: "Primed Soon™",
      route: "",
      source: "/BuildIcon.png",
      background: img("/backgrounds/orbiter.jpg", { format: "webp" }),
      description: "Coming January 12th",
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
