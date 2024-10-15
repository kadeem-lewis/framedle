<template>
  <div class="mb-4 flex flex-col items-center justify-center">
    <p class="text-lg font-semibold">Next Challenge in:</p>
    <span class="flex items-center gap-1">
      <UIcon name="i-mdi-circle-slice-2" class="size-5" />
      <NextGameCountdown :target-date="startOfTomorrow()" class="text-2xl" />
    </span>
  </div>
  <div v-if="$route.name === 'classic'" class="space-y-2">
    <p>Guess the Warframe in {{ defaultAttempts }} tries</p>
    <p>
      Simply type in the name of a Warframe and it will reveal its properties
    </p>
    <UDivider />
    <p>
      The color of the tiles will change to show how close your guess was to the
      Warframe to find.
    </p>
    <p>
      <span className="text-green-500">Green</span> indicates the property is an
      exact match.
    </p>
    <p>
      <span className="text-red-700">Red</span> indicates there is no overlap
      between your guess and the property
    </p>
    <p>
      <span className="text-red-700">⬆️⬇️</span> With arrows, it also indicates
      if the answer property is above or below your guess.
    </p>
    <p class="text-lg font-bold uppercase">Example</p>
    <UDivider />
    <div class="space-y-2">
      <div>
        <p>
          Consider the correct answer is
          <span class="text-primary font-medium">Nezha</span>
        </p>
        <p>
          If you enter <span class="text-primary font-medium">Inaros</span>,
          these properties will appear:
        </p>
      </div>
      <div class="grid grid-cols-6 gap-1">
        <ClassicFeedbackRow
          :guessed-warframe="Inaros!"
          :correct-warframe="Nezha!"
        />
      </div>
      <div>
        <p class="text-lg font-semibold">
          Sex: <span class="text-green-500">Green</span>
        </p>
        <p>It is a match because both are the same sex</p>
      </div>
      <div>
        <p class="text-lg font-semibold">
          Health: <span class="text-red-500">Red and a down arrow</span>
        </p>
        <p>Nezha has less health than Inaros</p>
      </div>
      <div>
        <p class="text-lg font-semibold">
          Shields: <span class="text-red-500">Red and an up arrow</span>
        </p>
        <p>Nezha has more shields than Inaros</p>
      </div>
      <div>
        <p>Progenitor: <span class="text-green-500">Green</span></p>
        <p>It is a match because both have the same progenitor element</p>
      </div>
      <div>
        <p>
          Release Year: <span class="text-red-500">Red and a down arrow</span>
        </p>
        <p>Nezha was released before Inaros</p>
      </div>
      <p>If you entered Nezha, here is what would come up:</p>
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
    <p>Which each guess, more of the ability icon will be revealed.</p>
  </div>
</template>

<script setup lang="ts">
import { startOfTomorrow } from "date-fns";
const { defaultAttempts } = useGameStore();

const { warframes } = storeToRefs(useGameStore());

const Inaros = warframes.value.find((warframe) => warframe.name === "Inaros");
const Nezha = warframes.value.find((warframe) => warframe.name === "Nezha");
</script>
