<template>
  <div v-if="$route.name === 'classic'">
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
    <UDivider />
    <p>Example</p>
  </div>
  <div v-if="$route.name === 'ability'" class="space-y-4">
    <p>
      Guess the Warframe the ability belongs to in {{ defaultAttempts }} tries
    </p>
    <p>Which each guess, more of the ability icon will be revealed.</p>
  </div>
</template>

<script setup lang="ts">
const { defaultAttempts } = useGameStore();
</script>
