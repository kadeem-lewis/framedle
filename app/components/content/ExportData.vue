<script setup lang="ts">
import { format } from "date-fns";

const { exportData, dataTransfer, timeUntil } = useTransferData();

const { copy, copied } = useClipboard({ source: dataTransfer.value.code! });
</script>
<template>
  <div class="flex flex-col gap-2">
    <p>Export your daily game progress and all your statistics.</p>
    <p>
      Paste the generated code into the import field of the device you want to
      import the data into.
    </p>
    <div v-if="!dataTransfer.code" class="flex items-center justify-center">
      <UButton
        variant="outline"
        size="xl"
        class="rounded-none"
        @click="exportData"
        >Export Data</UButton
      >
    </div>
    <div v-else class="flex flex-col gap-2">
      <div class="flex gap-2">
        <UTooltip text="Click to copy to clipboard" :delay-duration="0">
          <UButton
            variant="outline"
            color="neutral"
            class="flex-1 rounded-none text-xl"
            :class="{
              'text-success ring-success transition-colors': copied,
            }"
            :ui="{
              base: 'justify-between',
            }"
            @click="copy(dataTransfer.code)"
            ><template #trailing>
              <UIcon v-if="copied" name="i-mdi-check" class="size-6" />
              <UIcon v-else name="i-mdi-content-copy" class="size-6" />
            </template>
            {{ dataTransfer.code }}</UButton
          >
        </UTooltip>
        <UiConfirmPopup
          title="Are you sure you want to regenerate the code?"
          success-label="Regenerate"
          cancel-label="Cancel"
          @confirm="exportData"
        >
          <UButton class="rounded-none" icon="i-heroicons-arrow-path-solid"
            >Regenerate Code</UButton
          >
        </UiConfirmPopup>
      </div>
      <div class="text-toned">
        <p v-if="dataTransfer.exportedAt">
          Code generated: {{ format(dataTransfer.exportedAt, "PPpp") }}.
        </p>
        <p>Valid for: {{ timeUntil }}</p>
      </div>
    </div>
  </div>
</template>
