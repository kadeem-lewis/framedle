<script setup lang="ts">
const { warframeName, isRevealed, data } = defineProps<{
  warframeName: WarframeName | string;
  data: GridCell;
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
    class="bg-elevated min-h-26"
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
        v-if="isDaily && data.rarity"
        class="absolute top-0 left-0 rounded-none px-1 py-0.5"
      >
        {{ data.rarity }}%
      </UBadge>
      <NuxtImg
        :src="`https://cdn.warframestat.us/img/${warframe.imageName}`"
        :alt="`Image of ${warframe.name}`"
        format="avif"
        height="96"
        class="object-cover object-top pt-2"
      />
      <UBadge :label="warframe.name" class="absolute bottom-0 rounded-none" />
    </div>
  </div>
</template>
