<script setup lang="ts">
const { label, value } = defineProps<{
  label: string;
  value: number | null | undefined;
}>();

const open = ref(false);
</script>
<template>
  <UPopover
    v-model:open="open"
    :arrow="true"
    :ui="{
      content: 'rounded-none',
    }"
  >
    <UButton
      variant="ghost"
      color="neutral"
      :disabled="!value"
      class="flex flex-col items-center justify-center rounded-none text-base"
    >
      <span class="font-semibold uppercase">{{ label }}</span>
      <div class="flex items-center justify-center gap-2">
        <UIcon name="i-heroicons-chart-bar-solid" class="size-4" />
        <span>
          {{ value ?? "—" }}
        </span>
      </div>
    </UButton>
    <template #content>
      <div>
        <div class="flex items-center justify-between px-2 py-1">
          <p class="font-semibold uppercase">Scores</p>
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-heroicons-x-mark-solid"
            class="rounded-none"
            @click="open = false"
          />
        </div>
        <USeparator />
        <slot />
      </div>
    </template>
  </UPopover>
</template>
