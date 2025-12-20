<script setup lang="ts">
const { warframeName, isRevealed } = defineProps<{
  warframeName: WarframeName | string;
  isRevealed?: boolean;
}>();

const warframe = computed(() => {
  if (!warframeName) return;
  return getWarframe(warframeName as WarframeName);
});
</script>
<template>
  <div class="bg-neutral-500 hover:bg-neutral-600">
    <div
      v-if="isRevealed && warframe"
      class="flex flex-col items-center justify-center gap-1"
    >
      <NuxtImg
        :src="`https://cdn.warframestat.us/img/${warframe.imageName}`"
        :alt="`Image of ${warframe.name}`"
        format="avif"
        height="40"
      />
      <UBadge :label="warframe.name" />
    </div>
  </div>
</template>
