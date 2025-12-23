<script setup lang="ts">
import { warframes } from "#shared/data/warframes";

const { t } = useI18n();

const { DEFAULT_ATTEMPTS } = useGameStore();

const { $colorblindMode } = useNuxtApp();

const success = computed(() => ($colorblindMode.value ? "Blue" : "Green"));
const error = computed(() => ($colorblindMode.value ? "Orange" : "Red"));
const partial = computed(() => ($colorblindMode.value ? "Pink" : "Yellow"));
</script>
<template>
  <div class="space-y-2">
    <p>Guess the Warframe in {{ DEFAULT_ATTEMPTS }} tries</p>
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
      <span class="text-partial font-semibold">{{ partial }}</span>
      indicates that some, but not all, aspects of that property are correct
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
        <p class="text-info font-medium">Gender:</p>
        <p><span>Possible values:&nbsp;</span> Male, Female or Non-binary</p>
      </div>
      <div class="space-y-1">
        <p class="text-info font-medium">Variant:</p>
        <p><span>Possible values:&nbsp;</span> Standard, Prime or Umbra</p>
      </div>
      <div class="space-y-1">
        <p class="text-info font-medium">Playstyle:</p>
        <p>
          <span>Possible values:&nbsp;</span> A combination of Crowd Control,
          Damage, Stealth, Support or Survival
        </p>
      </div>
      <div class="space-y-1">
        <p class="text-info font-medium">Health:</p>
        <p>
          <span>Possible values:&nbsp;</span> Base shield values of Warframes
          e.g 180, 270, 365
        </p>
      </div>
      <div class="space-y-1">
        <p class="text-info font-medium">Shield:</p>
        <p>
          <span>Possible values:&nbsp;</span> Base shield values of Warframes
          e.g 0, 135, 180
        </p>
      </div>
      <div class="space-y-1">
        <p class="text-info font-medium">Progenitor Element:</p>
        <p>
          <span>Possible values:&nbsp;</span>Impact, Heat, Cold, Electricity,
          Toxin, Magnetic or Radiation
        </p>
      </div>
      <div class="space-y-1">
        <p class="text-info font-medium">Release Year:</p>
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
          <span class="text-primary font-medium">Nezha</span>
        </p>
        <p>
          If you enter
          <span class="text-primary font-medium">Inaros Prime</span>, these
          properties will appear:
        </p>
      </div>
      <div class="overflow-x-auto">
        <div class="grid w-[190%] grid-cols-8 gap-1">
          <ClassicFeedbackRow
            :guessed-warframe="warframes['Inaros Prime']"
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
          Variant:
          <span class="text-error">{{ error }}</span>
        </p>
        <p>Nezha is a Standard Warframe while Inaros Prime is not</p>
      </div>
      <div class="space-y-1">
        <p class="font-medium">
          Playstyle:
          <span class="text-partial">{{ partial }}</span>
        </p>
        <p>
          Both Nezha and Inaros Prime have the Survival and Crowd Control
          Playstyles, but only Nezha has the Damage Playstyle
        </p>
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
        <div class="grid w-[190%] grid-cols-8 gap-1">
          <ClassicFeedbackRow
            :guessed-warframe="warframes.Nezha"
            :correct-warframe="warframes.Nezha"
          />
        </div>
      </div>
    </div>
  </div>
</template>
