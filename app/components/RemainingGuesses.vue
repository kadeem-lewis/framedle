<template>
  <div v-if="mode">
    <div class="flex justify-end gap-1">
      <NuxtImg
        v-for="(_, index) in Array(defaultAttempts)"
        :key="index"
        format="webp"
        src="/warframe.png"
        alt="Warframe Icon"
        placeholder
        height="24"
        width="24"
        class="invert dark:invert-0"
        :class="index + 1 > attempts[mode] ? 'brightness-50' : ''"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { attempts } = storeToRefs(useGameStore());
const { defaultAttempts } = useGameStore();

const mode = useGameMode();
</script>
