<template>
  <div v-if="mode">
    <div class="my-4 flex justify-end gap-1">
      <NuxtImg
        v-for="(_, index) in Array(defaultAttempts)"
        :key="index"
        src="/warframe.png"
        alt="Warframe Icon"
        class="h-6"
        :class="index + 1 > attempts[mode] ? 'brightness-50' : ''"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { attempts, mode, isGameOver } = storeToRefs(useGameStore());
const { defaultAttempts } = useGameStore();

watch(
  () => attempts.value[mode.value],
  () => {
    if (mode.value && attempts.value[mode.value] === 0) {
      isGameOver.value[mode.value] = true;
    }
  },
);
</script>
