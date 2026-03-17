<script setup lang="ts">
const { DEFAULT_ATTEMPTS } = useGameStore();
</script>
<template>
  <div class="flex flex-col gap-4">
    <p>
      Guess the Warframe the ability belongs to in {{ DEFAULT_ATTEMPTS }} tries
    </p>
    <p>Which each guess, more of the ability icon will be revealed.</p>
    <p>
      Images begin rotated and are placed in the correct orientation as
      additional tiles are revealed
    </p>
    <p>The order in which tiles are revealed may change between days</p>
  </div>
</template>
