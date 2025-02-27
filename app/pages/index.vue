<template>
  <div class="space-y-4">
    <p
      class="p-1 text-center font-roboto text-lg font-semibold uppercase md:text-xl"
    >
      Test your Warframe Knowledge!
    </p>
    <div class="flex flex-col gap-4">
      <ModeCard
        v-for="tab of tabs"
        :key="tab.label"
        :tab="tab"
        class="last:pointer-events-none"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: null,
});

defineOgImageComponent("Framedle");

const img = useImage();
const { t } = useI18n();

const tabs = [
  {
    label: t("home.classic_card.title"),
    route: "/classic",
    source: "/warframe.png",
    background: img("/backgrounds/fortuna.jpg", { format: "webp" }),
    description: t("home.classic_card.description"),
  },
  {
    label: t("home.ability_card.title"),
    route: "/ability",
    source: "/PassiveAbilityIcon.png",
    background: img("/backgrounds/helminth.jpg", { format: "webp" }),
    description: t("home.ability_card.description"),
  },
  {
    label: "Coming Soon",
    route: "",
    source: "/BuildIcon.png",
    background: img("/backgrounds/orbiter.jpg", { format: "webp" }),
    description: "Stay tuned",
  },
];
</script>
