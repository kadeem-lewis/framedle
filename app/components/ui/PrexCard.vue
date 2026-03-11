<script setup lang="ts">
import { motion } from "motion-v";
</script>
<template>
  <motion.div
    class="paper h-full scale-96 rounded-md bg-yellow-100 p-1 ring-1 ring-accented perspective-[1000px] transform-3d dark:ring-0"
    :exit="{
      rotateY: 90,
    }"
    :transition="{
      duration: 0.3,
      ease: 'easeOut',
    }"
  >
    <div class="relative h-full rounded-sm bg-stone-900 p-0.5">
      <div
        class="absolute top-0.5 left-0.5 size-1 rounded-full bg-yellow-800"
      />
      <div
        class="absolute top-0.5 right-0.5 size-1 rounded-full bg-yellow-800"
      />
      <div
        class="absolute bottom-0.5 left-0.5 size-1 rounded-full bg-yellow-800"
      />
      <div
        class="absolute right-0.5 bottom-0.5 size-1 rounded-full bg-yellow-800"
      />
      <div
        class="relative flex h-full items-center justify-center rounded-lg bg-taupe-500"
      >
        <div
          class="flex size-13 items-center justify-center rounded-full border-3 border-stone-700 bg-amber-300"
        >
          <UIcon name="i-mdi-help" class="text-3xl text-stone-900" />
        </div>
      </div>
    </div>
  </motion.div>
</template>
<style scoped>
.paper {
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0.4;
    mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }
}
</style>
