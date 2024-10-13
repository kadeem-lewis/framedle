<template>
  <div class="flex justify-center gap-2">
    <UButton
      :to="{
        path: $route.path,
      }"
      :ui="{
        rounded: 'rounded-none',
      }"
      :class="{
        'dark:border-primary hover:border-primary border-b-4 border-gray-800':
          !$route.query.mode,
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
        rounded: 'rounded-none',
      }"
      :class="{
        'dark:border-primary hover:border-primary border-b-4 border-gray-800':
          $route.query.mode,
      }"
      class="hover:shadow-primary font-semibold uppercase hover:shadow-inner"
      variant="outline"
      size="xl"
    >
      Unlimited
    </UButton>
  </div>
</template>

<script setup lang="ts"></script>
