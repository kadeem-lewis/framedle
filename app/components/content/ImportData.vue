<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const { importData, isImporting, importError } = useTransferData();

const schema = z.object({
  importCode: z
    .string()
    .trim()
    .toUpperCase()
    .length(6, "Migration code must be 6 characters long")
    .regex(/^[A-Z0-9]+$/, "Invalid migration code"),
});

type Schema = z.infer<typeof schema>;

const state = reactive({
  importCode: "",
});

const { closeDialog } = useDialog();

const toast = useToast();

async function handleImport(event: FormSubmitEvent<Schema>) {
  const result = await importData(event.data.importCode);
  if (result.ok) {
    toast.add({
      title: "Data Imported",
      description: "Your data has been successfully imported.",
      color: "success",
    });
    closeDialog();
  }
}
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
    <UForm :schema="schema" :state="state" @submit="handleImport">
      <div class="flex gap-2">
        <UFormField name="importCode" class="flex-1" required>
          <UInput
            v-model="state.importCode"
            placeholder="Paste your import code here"
            size="xl"
            class="w-full uppercase"
            :ui="{
              base: 'rounded-none',
            }"
          />
        </UFormField>
        <UButton
          variant="outline"
          class="self-start rounded-none"
          size="xl"
          :loading="isImporting"
          type="submit"
          >Import Data</UButton
        >
      </div>
    </UForm>
  </div>
</template>
