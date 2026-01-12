<script setup lang="ts">
const { warframeName, isRevealed, rarity } = defineProps<{
  warframeName: WarframeName | string;
  rarity: number | undefined;
  isRevealed?: boolean;
}>();

const warframe = computed(() => {
  if (!warframeName) return;
  return getWarframe(warframeName as WarframeName);
});

const { isGameOver } = storeToRefs(useGameStateStore());
const { isDaily } = useGameMode();
</script>
<template>
  <div
    class="bg-elevated border-accented min-h-28 border-dashed p-1"
    :class="{
      'cursor-not-allowed': warframe || isGameOver,
      'hover:brightness-90 dark:hover:brightness-125': !warframe && !isGameOver,
    }"
  >
    <div
      v-if="isRevealed && warframe"
      class="relative flex items-center justify-center"
    >
      <UBadge
        v-if="isDaily && rarity"
        class="absolute top-0 left-0 rounded-none px-1 py-0.5 opacity-90"
      >
        {{ rarity.toFixed(2) }}%
      </UBadge>
      <NuxtImg
        :src="`https://cdn.warframestat.us/img/${warframe.imageName}`"
        :alt="`Image of ${warframe.name}`"
        format="avif"
        height="108"
        class="h-27 object-cover object-top pt-3"
      />
      <UBadge
        :label="warframe.name"
        class="absolute bottom-0 rounded-none opacity-90"
      />
    </div>
  </div>
</template>
