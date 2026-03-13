<script setup lang="ts">
import {
  messageTypes,
  feedbackSchema,
  type Feedback,
} from "#shared/schemas/feedback";
import type { FormSubmitEvent } from "@nuxt/ui";

const items = [...messageTypes];

const state = reactive({
  email: "",
  messageType: undefined,
  message: "",
  token: "",
});

async function onSubmit(event: FormSubmitEvent<Feedback>) {
  console.log("Submitting feedback:", event.data);
  try {
    $fetch("/api/feedback", {
      method: "POST",
      body: event.data,
    });
  } catch (error) {
    console.error("Failed to submit feedback:", error);
  }
}
</script>
<template>
  <div>
    <UCard>
      <template #header>
        <h1 class="text-xl font-semibold">Feedback</h1>
      </template>
      <UForm
        :state="state"
        :schema="feedbackSchema"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="Email:" name="email">
          <UInput
            v-model="state.email"
            class="w-full rounded-none"
            :ui="{
              base: 'rounded-none',
            }"
          />
        </UFormField>
        <UFormField label="Message Type:" name="messageType">
          <USelect
            v-model="state.messageType"
            :items="items"
            class="w-full rounded-none"
            required
          />
        </UFormField>
        <UFormField label="Message:" name="message">
          <UTextarea
            v-model="state.message"
            :rows="5"
            max-rows="12"
            class="w-full"
            :ui="{
              base: 'rounded-none',
            }"
          />
        </UFormField>
        <NuxtTurnstile v-model="state.token" />
        <UButton
          type="submit"
          :disabled="!state.token"
          class="flex items-center justify-center text-white uppercase"
          >Send</UButton
        >
      </UForm>
    </UCard>
  </div>
</template>
