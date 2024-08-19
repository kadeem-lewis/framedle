<template>
  <div
    :class="[
      'rounded-md border-2 shadow-inner',
      {
        'bg-green-500': feedback.isCorrect && !props.numeric,
        'bg-red-500': !feedback.isCorrect && !props.numeric,
      },
    ]"
  >
    <div class="grid grid-cols-5 capitalize">
      {{ props.guessedValue }} {{ feedback.direction }}
    </div>
  </div>
</template>

<script setup lang="ts">
// types would be numeric ( for health, shield, and releaseDate ), default is string and probably also for sex since there are three options

//TODO: The only approach of just passing in the status is probably better than calculating it within the component

const props = defineProps<{
  numeric?: boolean;
  guessedValue: string | number;
  correctValue: string | number;
}>();

const feedback = computed(() => {
  if (props.numeric) {
    const guessed = Number(props.guessedValue);
    const correct = Number(props.correctValue);
    if (guessed === correct)
      return {
        isCorrect: true,
      };
    if (guessed > correct)
      return {
        isCorrect: false,
        direction: "lower",
      };
    return {
      isCorrect: false,
      direction: "higher",
    };
  }
  return {
    isCorrect: props.guessedValue === props.correctValue,
  };
});

// if its numeric then I will have an arrow as the background or use a clip path to make an arrow in the background
</script>

<style scoped></style>
