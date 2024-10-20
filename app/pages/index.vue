<template>
  <div class="space-y-4">
    <p
      class="border border-gray-200 bg-gray-100/75 p-1 text-center text-lg font-semibold uppercase md:text-xl dark:border-gray-600/75 dark:bg-gray-800"
    >
      Test your Warframe Knowledge!
    </p>
    <div class="flex flex-col gap-4">
      <ModeCard v-for="tab of tabs" :key="tab.label" :tab="tab" />
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: null,
});

defineOgImageComponent("Frame", {
  title: "Framedle",
});

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
];
</script>
