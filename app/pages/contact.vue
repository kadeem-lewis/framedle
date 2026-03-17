<script setup lang="ts">
import {
  messageTypes,
  feedbackSchema,
  type Feedback,
} from "#shared/schemas/feedback";
import type { FormSubmitEvent } from "@nuxt/ui";

useSeoMeta({
  title: "Contact",
  ogTitle: "Framedle Contact",
  description: "Send messages, feedback, or ask questions about Framedle",
  ogDescription: "Send messages, feedback, or ask questions about Framedle.",
});

const items = [...messageTypes];

const getInitialState = () => ({
  email: "",
  messageType: undefined,
  message: "",
  token: "",
});

const state = reactive(getInitialState());

const runtimeConfig = useRuntimeConfig();

const loading = ref(false);

const showSuccessMessage = refAutoReset(false, 3000);

async function onSubmit(event: FormSubmitEvent<Feedback>) {
  loading.value = true;
  try {
    await $fetch("/api/feedback", {
      method: "POST",
      body: event.data,
    });
    showSuccessMessage.value = true;
    Object.assign(state, getInitialState());
  } catch (error) {
    console.error("Failed to submit feedback:", error);
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div>
    <UCard>
      <template #header>
        <h1 class="text-xl font-semibold">Feedback</h1>
      </template>
      <div class="flex flex-col gap-4">
        <div>
          <p>
            You can provide feedback or ask questions in any of the following
            ways:
          </p>
          <ul class="list-[square] pl-6">
            <li>
              Open an Issue on
              <UiAppLink
                to="https://github.com/kadeem-lewis/framedle/issues"
                target="_blank"
                external
                >GitHub</UiAppLink
              >
            </li>
            <li>
              Join
              <UiAppLink
                :to="runtimeConfig.public.discordInvite"
                external
                target="_blank"
                >my discord</UiAppLink
              >
              and leave a message in the framedle feedback channel
            </li>
            <li>
              send me an email at
              <UiAppLink href="mailto:support@framedle.com"
                >support@framedle.com
              </UiAppLink>
            </li>
            <li>or use the form below</li>
          </ul>
        </div>
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
            :loading="loading"
            class="flex items-center justify-center text-white uppercase"
            >Send</UButton
          >
        </UForm>
        <div
          v-if="showSuccessMessage"
          class="text-medium text-center text-lg text-success"
        >
          Message Sent!
        </div>
      </div>
    </UCard>
  </div>
</template>
