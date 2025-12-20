<script setup lang="ts">
const { warframeName, isRevealed } = defineProps<{
  warframeName: WarframeName | string;
  isRevealed?: boolean;
}>();

const warframe = computed(() => {
  if (!warframeName) return;
  return getWarframe(warframeName as WarframeName);
});

const { isGameOver } = storeToRefs(useGameStateStore());
</script>
<template>
  <div
    class="bg-elevated min-h-24"
    :class="{
      'cursor-not-allowed': warframe,
      'hover:brightness-90 dark:hover:brightness-125': !warframe && !isGameOver,
    }"
  >
    <div
      v-if="isRevealed && warframe"
      class="flex flex-col items-center justify-center gap-1"
    >
      <NuxtImg
        :src="`https://cdn.warframestat.us/img/${warframe.imageName}`"
        :alt="`Image of ${warframe.name}`"
        format="avif"
        height="64"
      />
      <UBadge :label="warframe.name" class="rounded-none" />
    </div>
  </div>
</template>
