<script setup lang="ts">
import { differenceInSeconds } from "date-fns";

const props = defineProps<{
  targetDate: Date;
}>();

const timeLeft = ref(calculateTimeLeft(props.targetDate));

let intervalId: NodeJS.Timeout;

onMounted(() => {
  intervalId = setInterval(() => {
    const newTimeLeft = calculateTimeLeft(props.targetDate);

    if (newTimeLeft <= 0) {
      clearInterval(intervalId);
    }

    timeLeft.value = newTimeLeft;
  }, 1000);
});

function calculateTimeLeft(endDate: Date) {
  const now = new Date();
  return differenceInSeconds(endDate, now);
}

function formatTimeLeft(timeLeftInSeconds: number) {
  const hours = Math.floor(timeLeftInSeconds / 3600);
  let remaining = timeLeftInSeconds % 3600;
  const minutes = Math.floor(remaining / 60);
  remaining = remaining % 60;
  const seconds = remaining;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

tryOnBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>
<template>
  <div v-if="timeLeft <= 0">Time's up! Reload to see new Game.</div>
  <div v-else>
    <p>{{ formatTimeLeft(timeLeft) }}</p>
  </div>
</template>
