<template>
  <div
    :class="[
      'relative z-10 min-h-12 border-2 bg-gray-100/75 font-semibold shadow-inner dark:bg-gray-800/75',
      {
        'border-green-500': isCorrect,
        'border-red-500': !isCorrect,
        'arrow-up': difference && difference > 0,
        'arrow-down': difference && difference < 0,
      },
    ]"
  >
    <div class="flex h-full items-center justify-center pt-2 text-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// types would be numeric ( for health, shield, and releaseDate ), default is string and probably also for sex since there are three options

//TODO: The only approach of just passing in the status is probably better than calculating it within the component

defineProps<{
  isCorrect?: boolean;
  difference?: number;
}>();

// if its numeric then I will have an arrow as the background or use a clip path to make an arrow in the background
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
    background: red;
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
    background: red;
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
