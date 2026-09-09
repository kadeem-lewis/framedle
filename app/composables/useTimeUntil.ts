import { differenceInSeconds } from "date-fns";

export function useTimeUntil(time: MaybeRefOrGetter<Date | null | undefined>) {
  const timeLeft = ref(0);
  let intervalId: ReturnType<typeof setInterval> | undefined;

  function stop() {
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  function calculateTimeLeft(targetTime: Date) {
    return Math.max(0, differenceInSeconds(targetTime, new Date()));
  }

  function update(targetTime: Date) {
    timeLeft.value = calculateTimeLeft(targetTime);

    if (timeLeft.value === 0) {
      stop();
    }
  }

  function start(targetTime: Date) {
    stop();
    update(targetTime);

    if (timeLeft.value > 0) {
      intervalId = setInterval(() => {
        update(targetTime);
      }, 1000);
    }
  }

  watch(
    () => toValue(time),
    (targetTime) => {
      if (!targetTime || Number.isNaN(targetTime.getTime())) {
        stop();
        timeLeft.value = 0;
        return;
      }

      start(targetTime);
    },
    { immediate: true },
  );

  const isFinished = computed(() => timeLeft.value <= 0);

  const timeUntil = computed(() => {
    const safeTimeLeft = Math.max(0, timeLeft.value);

    const hours = Math.floor(safeTimeLeft / 3600);
    const remainingAfterHours = safeTimeLeft % 3600;
    const minutes = Math.floor(remainingAfterHours / 60);
    const seconds = remainingAfterHours % 60;

    return `${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  });

  tryOnBeforeUnmount(stop);
  return {
    timeUntil,
    isFinished,
  };
}
