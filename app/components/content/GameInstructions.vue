<script setup lang="ts">
import { startOfTomorrow } from "date-fns";
import { warframes } from "#shared/data/warframes";

const { t } = useI18n();

const { defaultAttempts } = useGameStore();

const { $colorblindMode } = useNuxtApp();

const success = computed(() => ($colorblindMode.value ? "Blue" : "Green"));
const error = computed(() => ($colorblindMode.value ? "Orange" : "Red"));
</script>
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
  <div v-if="$route.name === 'classic-path'" class="space-y-2">
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
    <USeparator />
    <p class="font-roboto text-center text-lg font-bold uppercase">
      Properties
    </p>
    <p>Here is the details of each of the properties columns:</p>
    <div class="space-y-2">
      <div class="space-y-1">
        <p class="font-medium text-(--ui-info)">Gender:</p>
        <p><span>Possible values:&nbsp;</span> Male, Female or Non-binary</p>
      </div>
      <div class="space-y-1">
        <p class="font-medium text-(--ui-info)">Variant:</p>
        <p><span>Possible values:&nbsp;</span> Standard, Prime or Umbra</p>
      </div>
      <div class="space-y-1">
        <p class="font-medium text-(--ui-info)">Health:</p>
        <p>
          <span>Possible values:&nbsp;</span> Base shield values of Warframes
          e.g 180, 270, 365
        </p>
      </div>
      <div class="space-y-1">
        <p class="font-medium text-(--ui-info)">Shield:</p>
        <p>
          <span>Possible values:&nbsp;</span> Base shield values of Warframes
          e.g 0, 135, 180
        </p>
      </div>
      <div class="space-y-1">
        <p class="font-medium text-(--ui-info)">Progenitor Element:</p>
        <p>
          <span>Possible values:&nbsp;</span>Impact, Heat, Cold, Electricity,
          Toxin, Magnetic or Radiation
        </p>
      </div>
      <div class="space-y-1">
        <p class="font-medium text-(--ui-info)">Release Year:</p>
        <p>
          <span>Possible values:&nbsp;</span>Any year between 2012 and today
        </p>
      </div>
    </div>
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
      <div class="overflow-x-auto">
        <div class="grid w-[160%] grid-cols-7 gap-1">
          <ClassicFeedbackRow
            :guessed-warframe="warframes.Inaros"
            :correct-warframe="warframes.Nezha"
          />
        </div>
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
      <div class="overflow-x-auto">
        <div class="grid w-[150%] grid-cols-7 gap-1">
          <ClassicFeedbackRow
            :guessed-warframe="warframes.Inaros"
            :correct-warframe="warframes.Nezha"
          />
        </div>
      </div>
    </div>
  </div>

  <div v-if="$route.name === 'ability-path'" class="space-y-4">
    <p>
      Guess the Warframe the ability belongs to in {{ defaultAttempts }} tries
    </p>
    <p>{{ t("instructions.ability.subtitle") }}</p>
    <p>
      Images begin rotated and are placed in the correct orientation as
      additional tiles are revealed
    </p>
    <p>The order in which tiles are revealed may change between days</p>
  </div>
</template>
