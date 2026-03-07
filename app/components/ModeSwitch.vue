<script setup lang="ts">
const route = useRoute();

const modes = computed(() => {
  const mode = route.path.split("/")[1];
  return [
    {
      label: "Daily",
      to: `/${mode}`,
      isActive: !route.path.endsWith("unlimited"),
    },
    {
      label: "Unlimited",
      to: `/${mode}/unlimited`,
      isActive: route.path.endsWith("unlimited"),
    },
  ];
});
</script>
<template>
  <div class="flex justify-center gap-1 font-roboto">
    <UButton
      v-for="mode of modes"
      :key="mode.label"
      :to="mode.to"
      :class="{
        'border-b-4 border-neutral-800 dark:border-primary': mode.isActive,
      }"
      class="font-semibold uppercase ring-neutral-800 hover:border-primary"
      variant="outline"
      size="xl"
    >
      {{ mode.label }}
    </UButton>
  </div>
</template>
