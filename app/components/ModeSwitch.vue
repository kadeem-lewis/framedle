<template>
  <div>
    <UButton
      :to="{
        path: path,
      }"
    >
      Daily
    </UButton>
    <UButton
      :to="{
        query: { mode: 'unlimited' },
      }"
    >
      Unlimited
    </UButton>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const path = route.path;
</script>
