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
        'border-accented border-b-primary-600 text-primary-600 dark:border-b-primary dark:text-primary':
          mode.isActive,
      }"
      class="font-semibold"
      variant="tenno"
      color="neutral"
      size="xl"
    >
      {{ mode.label }}
    </UButton>
  </div>
</template>
