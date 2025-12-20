<script setup lang="ts">
const { category } = defineProps<{
  category: CategoryItem;
}>();
</script>
<template>
  <UPopover>
    <UButton variant="ghost">{{ category.label }}</UButton>
    <template #content>
      <p class="p-2">{{ category.description }}</p>
    </template>
  </UPopover>
</template>
