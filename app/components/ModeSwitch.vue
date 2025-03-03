<template>
  <div class="flex justify-center gap-2 font-roboto">
    <UButton
      v-for="mode of modes"
      :key="mode.label"
      :to="mode.to"
      :class="{
        'dark:border-primary hover:border-primary border-b-4 border-gray-800':
          mode.isActive.value,
      }"
      class="hover:shadow-primary font-semibold uppercase hover:shadow-inner"
      variant="outline"
      size="xl"
    >
      {{ mode.label }}
    </UButton>
  </div>
</template>
<script setup lang="ts">
const route = useRoute();

const path = computed(() => route.path);

const modes = [
  {
    label: "Daily",
    to: { path: path.value },
    isActive: computed(() => !route.query.mode),
  },
  {
    label: "Unlimited",
    to: {
      query: { mode: "unlimited" },
    },
    isActive: computed(() => !!route.query.mode),
  },
];
</script>
