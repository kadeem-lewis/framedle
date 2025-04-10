<script setup lang="ts">
const route = useRoute();
const { currentRoute } = useRouter();

const modes = [
  {
    label: "Daily",
    to: { path: currentRoute.value.path },
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
<template>
  <div class="font-roboto flex justify-center gap-2">
    <UButton
      v-for="mode of modes"
      :key="mode.label"
      :to="mode.to"
      :class="{
        'border-b-4 border-neutral-800 dark:border-(--ui-primary)':
          mode.isActive.value,
      }"
      class="font-semibold uppercase ring-neutral-800 hover:border-(--ui-primary)"
      variant="outline"
      size="xl"
    >
      {{ mode.label }}
    </UButton>
  </div>
</template>
