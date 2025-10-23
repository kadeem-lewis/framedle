<script setup lang="ts">
const { attempts } = storeToRefs(useGameStore());
const { DEFAULT_ATTEMPTS } = useGameStore();

const mode = useGameMode();
</script>
<template>
  <div v-if="mode">
    <div class="flex justify-end gap-1">
      <NuxtImg
        v-for="index of DEFAULT_ATTEMPTS"
        :key="index"
        format="webp"
        src="/warframe.png"
        alt="Warframe Icon"
        placeholder
        height="24"
        width="24"
        class="invert dark:invert-0"
        :class="index > attempts[mode] ? 'brightness-50' : ''"
      />
    </div>
  </div>
</template>
