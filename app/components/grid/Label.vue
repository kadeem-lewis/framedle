<script setup lang="ts">
const { category } = defineProps<{
  category: CategoryItem;
}>();
</script>
<template>
  <UPopover
    :ui="{
      content: 'rounded-none',
    }"
  >
    <UButton variant="soft" class="min-h-20 rounded-none">{{
      category.label
    }}</UButton>
    <template #content>
      <p class="p-2">{{ category.description }}</p>
    </template>
  </UPopover>
</template>
