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
  <div class="font-roboto flex justify-center gap-2">
    <UButton
      v-for="mode of modes"
      :key="mode.label"
      :to="mode.to"
      :class="{
        'dark:border-primary border-b-4 border-neutral-800': mode.isActive,
      }"
      class="hover:border-primary font-semibold uppercase ring-neutral-800"
      variant="outline"
      size="xl"
    >
      {{ mode.label }}
    </UButton>
  </div>
</template>
