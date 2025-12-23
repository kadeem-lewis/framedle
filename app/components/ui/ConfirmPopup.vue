<script setup lang="ts">
const { title, successLabel, cancelLabel } = defineProps<{
  title: string;
  successLabel: string;
  cancelLabel: string;
}>();

const emit = defineEmits<{
  (e: "confirm"): void;
}>();

const isOpen = ref(false);
</script>
<template>
  <UPopover v-model:open="isOpen" mode="click" arrow>
    <slot />
    <template #content>
      <div>
        <div class="p-4">
          <h3 class="mb-4 font-medium">{{ title }}</h3>
          <div class="flex justify-end space-x-2">
            <UButton variant="soft" color="neutral" @click="isOpen = false">
              {{ cancelLabel }}
            </UButton>
            <UButton color="error" @click="emit('confirm')">
              {{ successLabel }}
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>
