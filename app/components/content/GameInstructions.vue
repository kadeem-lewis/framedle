<template>
  <div class="mb-4 flex flex-col items-center justify-center">
    <p class="text-lg font-semibold">
      {{ t("instructions.next_challenge_in") }}
    </p>
    <span class="flex items-center gap-1">
      <UIcon name="i-mdi-circle-slice-2" class="size-5" />
      <NextGameCountdown :target-date="startOfTomorrow()" class="text-2xl" />
    </span>
  </div>
  <div v-if="$route.name === 'classic'" class="space-y-2">
    <p>Guess the Warframe in {{ defaultAttempts }} tries</p>
    <p>
      {{ t("instructions.classic.subtitle") }}
    </p>
    <USeparator />
    <p>
      {{ t("instructions.classic.feedback_explanation") }}
    </p>
    <p>
      <span class="text-success font-semibold">{{ success }}</span>
      {{ t("instructions.classic.properties.green_explanation") }}
    </p>
    <p>
      <span class="text-error font-semibold">{{ error }}</span>
      {{ t("instructions.classic.properties.red_explanation") }}
    </p>
    <p><span>⬆️⬇️</span> {{ t("instructions.classic.properties.arrows") }}</p>
    <p class="font-roboto text-center text-lg font-bold uppercase">
      {{ t("instructions.classic.example") }}
    </p>
    <USeparator />
    <div class="space-y-4">
      <div class="space-y-1">
        <p>
          Consider the correct answer is
          <span class="font-medium text-(--ui-primary)">Nezha</span>
        </p>
        <p>
          If you enter
          <span class="font-medium text-(--ui-primary)">Inaros</span>, these
          properties will appear:
        </p>
      </div>
      <div class="grid grid-cols-6 gap-1">
        <ClassicFeedbackRow
          :guessed-warframe="Inaros!"
          :correct-warframe="Nezha!"
        />
      </div>
      <div class="space-y-1">
        <p class="font-medium">
          {{ t("instructions.classic.sex.title") }}
          <span class="text-success">{{ success }}</span>
        </p>
        <p>{{ t("instructions.classic.sex.description") }}</p>
      </div>
      <div class="space-y-1">
        <p class="font-medium">
          {{ t("instructions.classic.health.title") }}
          <span class="text-error">{{ error }} and a down arrow</span>
        </p>
        <p>{{ t("instructions.classic.health.description") }}</p>
      </div>
      <div class="space-y-1">
        <p class="font-medium">
          {{ t("instructions.classic.shield.title") }}
          <span class="text-error">{{ error }} and an up arrow</span>
        </p>
        <p>{{ t("instructions.classic.shield.description") }}</p>
      </div>
      <div class="space-y-1">
        <p class="font-medium">
          {{ t("instructions.classic.progenitor.title") }}
          <span class="text-success">{{ success }}</span>
        </p>
        <p>{{ t("instructions.classic.progenitor.description") }}</p>
      </div>
      <div class="space-y-1">
        <p class="font-medium">
          {{ t("instructions.classic.release_year.title") }}
          <span class="text-error">{{ error }} and a down arrow</span>
        </p>
        <p>{{ t("instructions.classic.release_year.description") }}</p>
      </div>
      <p>{{ t("instructions.classic.correct_guess") }}</p>
      <div class="grid grid-cols-6 gap-1">
        <ClassicFeedbackRow
          :guessed-warframe="Nezha!"
          :correct-warframe="Nezha!"
        />
      </div>
    </div>
  </div>

  <div v-if="$route.name === 'ability'" class="space-y-4">
    <p>
      Guess the Warframe the ability belongs to in {{ defaultAttempts }} tries
    </p>
    <p>{{ t("instructions.ability.subtitle") }}</p>
  </div>
</template>

<script setup lang="ts">
import { startOfTomorrow } from "date-fns";

const { t } = useI18n();

const { defaultAttempts } = useGameStore();

const { warframes } = storeToRefs(useGameStore());

const Inaros = warframes.value.find((warframe) => warframe.name === "Inaros");
const Nezha = warframes.value.find((warframe) => warframe.name === "Nezha");

const { $colorblindMode } = useNuxtApp();

const success = computed(() => ($colorblindMode.value ? "Blue" : "Green"));
const error = computed(() => ($colorblindMode.value ? "Orange" : "Red"));
</script>
