<template>
  <div class="flex justify-center gap-2">
    <UButton
      :to="{
        path: path,
      }"
      :ui="{
        rounded: false,
      }"
      :class="{
        'border-primary border-b-4': !route.query.mode,
      }"
      class="hover:shadow-primary font-semibold uppercase hover:shadow-inner"
      variant="outline"
      size="xl"
    >
      Daily
    </UButton>
    <UButton
      :to="{
        query: { mode: 'unlimited' },
      }"
      :ui="{
        rounded: false,
      }"
      :class="{
        'border-primary border-b-4': route.query.mode,
      }"
      class="hover:shadow-primary font-semibold uppercase hover:shadow-inner"
      variant="outline"
      size="xl"
    >
      Unlimited
    </UButton>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const path = route.path;
</script>
