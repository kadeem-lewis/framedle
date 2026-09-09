<script setup lang="ts">
const { importData, isImporting, importError } = useTransferData();
const importCode = ref("");

const { closeDialog } = useDialog();

const toast = useToast();

const handleImport = async () => {
  const result = await importData(importCode.value);
  if (result.ok) {
    toast.add({
      title: "Data Imported",
      description: "Your data has been successfully imported.",
      color: "success",
    });
    closeDialog();
  }
};
</script>
<template>
  <div class="flex flex-col gap-2">
    <p>
      Copy the Export Code generated from your last device and paste it below:
    </p>
    <UAlert
      v-if="!isImporting && importError"
      title="Data Import Failed"
      description="An error occurred while importing the data."
      color="error"
      variant="subtle"
      class="rounded-none"
    />
    <div class="flex gap-2">
      <UInput
        v-model="importCode"
        placeholder="Paste your import code here"
        size="xl"
        class="flex-1"
        :ui="{
          base: 'rounded-none',
        }"
      />
      <UButton
        variant="outline"
        class="rounded-none"
        size="xl"
        :loading="isImporting"
        @click="handleImport"
        >Import Data</UButton
      >
    </div>
  </div>
</template>
