<template>
  <ULink
    class="inline-flex items-center text-primary hover:text-primary hover:underline dark:hover:text-primary"
  >
    <slot />
    <UIcon
      v-if="$attrs.target === '_blank'"
      name="i-heroicons-arrow-up-right"
      class="size-3 align-top text-dimmed"
    />
  </ULink>
</template>
