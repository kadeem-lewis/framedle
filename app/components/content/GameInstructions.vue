<script setup lang="ts">
import { startOfTomorrow } from "date-fns";

const { t } = useI18n();
</script>
<template>
  <div class="mb-4 flex flex-col items-center justify-center">
    <NextGameCountdown :target-date="startOfTomorrow()">
      <template #title>{{ t("instructions.next_challenge_in") }}</template>
    </NextGameCountdown>
  </div>
  <ClassicInstructions v-if="$route.name === 'classic-path'" />
  <AbilityInstructions v-else-if="$route.name === 'ability-path'" />
  <GridInstructions
    v-else-if="$route.name === 'grid-path' || $route.name === 'grid-unlimited'"
  />
</template>
