<script setup lang="ts">
const { label, value } = defineProps<{
  label: string;
  value: number | null;
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
      class="flex flex-col items-center justify-center rounded-none text-base"
    >
      <span class="font-semibold uppercase">{{ label }}</span>
      <span>{{ value ?? "—" }}</span>
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
