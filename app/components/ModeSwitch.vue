<script setup lang="ts">
const route = useRoute();

const modes = computed(() => [
  {
    label: "Daily",
    to: route.path,
    isActive: !route.query.mode,
  },
  {
    label: "Unlimited",
    to: {
      query: { mode: "unlimited" },
    },
    isActive: !!route.query.mode,
  },
]);
</script>
<template>
  <div class="font-roboto flex justify-center gap-2">
    <UButton
      v-for="mode of modes"
      :key="mode.label"
      :to="mode.to"
      :class="{
        'border-b-4 border-neutral-800 dark:border-(--ui-primary)':
          mode.isActive,
      }"
      class="font-semibold uppercase ring-neutral-800 hover:border-(--ui-primary)"
      variant="outline"
      size="xl"
    >
      {{ mode.label }}
    </UButton>
  </div>
</template>
