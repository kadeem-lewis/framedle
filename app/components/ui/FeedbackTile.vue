<template>
  <div
    :class="[
      'relative z-0 min-h-12 w-full border-2 font-semibold shadow-inner',
      {
        'border-gray-500 bg-gray-100/75 dark:border-gray-600 dark:bg-gray-800/75':
          isCorrect === null,
        'border-green-900 bg-green-500 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-500':
          isCorrect === true,
        'border-red-900 bg-red-500 hover:bg-red-400 dark:bg-red-600 hover:dark:bg-red-500':
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
    background: #7f1d1d;
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

  &::after:hover {
    background: purple;
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
    background: #7f1d1d;
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

  &::after:hover {
    background: purple;
  }

  &::before {
    content: "";
    display: block;
  }
}
</style>
