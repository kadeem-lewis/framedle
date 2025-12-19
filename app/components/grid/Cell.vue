<script setup lang="ts">
const { warframeName, isRevealed } = defineProps<{
  warframeName: WarframeName | string;
  isRevealed?: boolean;
}>();

const warframe = ref(getWarframe(warframeName as WarframeName));
</script>
<template>
  <div>
    <div
      v-if="isRevealed"
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
