<script setup lang="ts">
import { addDays, format } from "date-fns";

const { exportData, dataTransfer } = useTransferData();

const { timeUntil } = useTimeUntil(() =>
  addDays(dataTransfer.value.exportedAt!, 1),
);
</script>
<template>
  <div class="flex flex-col gap-2">
    <p>Export your daily game progress and all your statistics.</p>
    <p>
      Paste the generated code into the import field of the device you want to
      import the data into.
    </p>
    <div v-if="!dataTransfer.code">
      Export
      <UButton @click="exportData">Export Data</UButton>
    </div>
    <div v-else class="flex flex-col gap-2">
      <div class="flex gap-2">
        <UTooltip text="Click to copy to clipboard" :delay-duration="0">
          <UButton
            variant="outline"
            color="neutral"
            trailing-icon="i-mdi-content-copy"
            class="flex-1 rounded-none text-xl"
            :ui="{
              base: 'justify-between',
            }"
            >{{ dataTransfer.code }}</UButton
          >
        </UTooltip>
        <UiConfirmPopup
          title="Are you sure you want to regenerate the code?"
          success-label="Regenerate"
          cancel-label="Cancel"
          @confirm="exportData"
        >
          <UButton icon="i-heroicons-arrow-path-solid">Regenerate Code</UButton>
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
