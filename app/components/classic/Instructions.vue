<script setup lang="ts">
import { warframes } from "#shared/data/warframes";

const { DEFAULT_ATTEMPTS } = useGameStore();

const { $colorblindMode } = useNuxtApp();

const success = computed(() => ($colorblindMode.value ? "Blue" : "Green"));
const error = computed(() => ($colorblindMode.value ? "Orange" : "Red"));
const partial = computed(() => ($colorblindMode.value ? "Pink" : "Yellow"));
</script>
<template>
  <div class="flex flex-col gap-2">
    <p>Guess the Warframe in {{ DEFAULT_ATTEMPTS }} tries.</p>
    <p>
      Simply type in the name of a Warframe and it will reveal its properties.
    </p>
    <USeparator />
    <p>
      The color of the tiles will change to show how close your guess was to the
      Warframe to find.
    </p>
    <p>
      <span class="font-semibold text-correct">{{ success }}</span>
      indicates the property is an exact match.
    </p>
    <p>
      <span class="font-semibold text-partial">{{ partial }}</span>
      indicates that some, but not all, aspects of that property are correct
    </p>
    <p>
      <span class="font-semibold text-incorrect">{{ error }}</span>
      indicates there is no overlap between your guess and the property.
    </p>
    <p>
      <span>⬆️⬇️</span> With arrows, it also indicates if the answer property is
      above or below your guess.
    </p>
    <USeparator />
    <p class="text-center font-roboto text-lg font-bold uppercase">
      Properties
    </p>
    <p>Here is the details of each of the properties columns:</p>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <p class="font-medium text-info">Gender:</p>
        <p><span>Possible values:&nbsp;</span> Male, Female or Non-binary</p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-medium text-info">Variant:</p>
        <p><span>Possible values:&nbsp;</span> Standard, Prime or Umbra</p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-medium text-info">Playstyle:</p>
        <p>
          <span>Possible values:&nbsp;</span> A combination of Crowd Control,
          Damage, Stealth, Support or Survival
        </p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-medium text-info">Health:</p>
        <p>
          <span>Possible values:&nbsp;</span> Base shield values of Warframes
          e.g 180, 270, 365
        </p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-medium text-info">Shield:</p>
        <p>
          <span>Possible values:&nbsp;</span> Base shield values of Warframes
          e.g 0, 135, 180
        </p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-medium text-info">Progenitor Element:</p>
        <p>
          <span>Possible values:&nbsp;</span>Impact, Heat, Cold, Electricity,
          Toxin, Magnetic or Radiation
        </p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-medium text-info">Release Year:</p>
        <p>
          <span>Possible values:&nbsp;</span>Any year between 2012 and today
        </p>
      </div>
    </div>
    <p class="text-center font-roboto text-lg font-bold uppercase">Example</p>
    <USeparator />
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <p>
          Consider the correct answer is
          <span class="font-medium text-primary">Nezha</span>
        </p>
        <p>
          If you enter
          <span class="font-medium text-primary">Inaros Prime</span>, these
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
      <div class="flex flex-col gap-1">
        <p class="font-medium">
          Sex:
          <span class="text-correct">{{ success }}</span>
        </p>
        <p>It is a match because both are the same sex.</p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-medium">
          Variant:
          <span class="text-incorrect">{{ error }}</span>
        </p>
        <p>Nezha is a Standard Warframe while Inaros Prime is not.</p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-medium">
          Playstyle:
          <span class="text-partial">{{ partial }}</span>
        </p>
        <p>
          Both Nezha and Inaros Prime have the Survival and Crowd Control
          Playstyles, but only Nezha has the Damage Playstyle
        </p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-medium">
          Health:
          <span class="text-incorrect">{{ error }} and a down arrow</span>
        </p>
        <p>Nezha has less health than Inaros Prime.</p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-medium">
          Shield:
          <span class="text-incorrect">{{ error }} and an up arrow</span>
        </p>
        <p>Nezha has more shields than Inaros Prime.</p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-medium">
          Progenitor:
          <span class="text-correct">{{ success }}</span>
        </p>
        <p>It is a match because both have the same progenitor element.</p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-medium">
          Release Year:
          <span class="text-incorrect">{{ error }} and a down arrow</span>
        </p>
        <p>Nezha was released before Inaros Prime.</p>
      </div>
      <p>If you entered Nezha, here is what would come up:</p>
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
