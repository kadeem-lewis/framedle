<template>
  <div
    :class="[
      'relative z-0 min-h-12 w-full border-2 font-semibold text-white shadow-inner transition-colors',
      {
        'border-gray-500 bg-white/75 dark:border-gray-700 dark:bg-gray-900/75':
          isCorrect === null,
        'border-border-success bg-success hover:shadow-inner hover:brightness-110':
          isCorrect === true,
        'border-border-error bg-error hover:brightness-11110 hover:shadow-inner':
          isCorrect === false,
        'arrow-up': difference && difference > 0,
        'arrow-down': difference && difference < 0,
      },
    ]"
  >
    <div
      class="relative z-auto flex h-full items-center justify-center pt-2 text-center"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { isCorrect = null, difference } = defineProps<{
  isCorrect?: boolean;
  difference?: number;
}>();
</script>

<style scoped>
.arrow-down {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -10;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    clip-path: polygon(
      0 50%,
      20% 50%,
      20% 0,
      80% 0,
      80% 50%,
      100% 50%,
      50% 100%
    );
  }

  &:hover::after {
    background: rgba(0, 0, 0, 0.7);
  }

  &::before {
    content: "";
    display: block;
  }
}

.arrow-up {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: -10;
    clip-path: polygon(
      50% 0,
      100% 50%,
      80% 50%,
      80% 100%,
      20% 100%,
      20% 50%,
      0 50%
    );
  }
  &:hover::after {
    background: rgba(0, 0, 0, 0.7);
  }

  &::before {
    content: "";
    display: block;
  }
}
</style>
