<script setup lang="ts">
import { startOfTomorrow } from "date-fns";
</script>
<template>
  <div>
    <div class="mb-4 flex flex-col items-center justify-center">
      <NextGameCountdown :target-date="startOfTomorrow()">
        <template #title>Next Challenge in:</template>
      </NextGameCountdown>
    </div>
    <ClassicInstructions v-if="$route.name === 'classic-path'" />
    <AbilityInstructions v-else-if="$route.name === 'ability-path'" />
    <GridInstructions
      v-else-if="
        $route.name === 'grid-path' || $route.name === 'grid-unlimited'
      "
    />
  </div>
</template>
