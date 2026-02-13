import { differenceInSeconds } from "date-fns";

export function useTimeUntil(time: MaybeRefOrGetter<Date>) {
  const targetTime = toValue(time);
  const timeLeft = ref(calculateTimeLeft(targetTime));

  const isFinished = computed(() => timeLeft.value <= 0);
  let intervalId: NodeJS.Timeout;

  onMounted(() => {
    intervalId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetTime);

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

  const timeUntil = computed(() => formatTimeLeft(timeLeft.value));

  tryOnBeforeUnmount(() => {
    clearInterval(intervalId);
  });
  return {
    timeUntil,
    isFinished,
  };
}
