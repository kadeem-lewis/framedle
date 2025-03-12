<template>
  <div class="font-roboto flex justify-center gap-2">
    <UButton
      v-for="mode of modes"
      :key="mode.label"
      :to="mode.to"
      :class="{
        'dark:border-primary hover:border-primary border-b-4 border-neutral-800':
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
