<template>
  <div v-if="mode">
    <p>You have {{ attempts[mode] }} revives left.</p>
  </div>
</template>

<script setup lang="ts">
const { attempts, mode } = storeToRefs(useGameStore());

watch(
  () => attempts.value[mode.value],
  () => {
    if (attempts.value[mode.value] === 0) {
      isGameOver.value[mode.value] = true;
    }
  },
);
</script>
