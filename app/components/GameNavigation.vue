<script setup lang="ts">
import { format, parseISO } from "date-fns";
// const { gameData } = defineProps<{
//   gameData: DailyDataBase & {
//     [key: string]: unknown;
//   };
// }>();
const { isDaily, gameType } = useGameMode();
const {
  currentDailyGridData,
  currentDailyAbilityData,
  currentDailyClassicData,
} = storeToRefs(useDailiesStore());
const data = computed(() => {
  return {
    classic: currentDailyClassicData.value,
    ability: currentDailyAbilityData.value,
    grid: currentDailyGridData.value,
  };
});

const dateString = computed(() => {
  if (!gameType.value) return ""; // not sure what to do when the value isn't present
  return format(parseISO(data.value[gameType.value]!.date), "E d MMM");
});

const { getAdjacentArchiveDays } = useArchiveStore();

const adjacentDays = computedAsync(
  async () => {
    if (!gameType.value || !data.value[gameType.value]) {
      return { previous: null, next: null };
    }
    return await getAdjacentArchiveDays(
      data.value[gameType.value]!.day,
      gameType.value,
    );
  },
  { previous: null, next: null },
);

const { proxy } = useUmamiAnalytics();
</script>
<template>
  <template v-if="isDaily && gameType">
    <div
      class="flex items-center justify-between gap-1 text-lg font-semibold uppercase"
    >
      <UButton
        :to="`/${gameType}/${adjacentDays?.previous}`"
        :disabled="!adjacentDays.previous"
        variant="ghost"
        color="neutral"
        size="lg"
        icon="my-icon:double-arrow-left"
        class="rounded-none"
        @click="proxy.track('Visited Previous Day', { gameType })"
      />
      <div class="flex justify-center gap-1">
        <p>{{ gameType }} #{{ data[gameType]?.day }}</p>
        <p>&middot;</p>
        <p class="text-muted">
          {{ dateString }}
        </p>
      </div>
      <UButton
        :to="`/${gameType}/${adjacentDays?.next}`"
        :disabled="!adjacentDays.next"
        variant="ghost"
        color="neutral"
        size="lg"
        icon="my-icon:double-arrow-right"
        class="rounded-none"
        @click="proxy.track('Visited Next Day', { gameType })"
      />
    </div>
  </template>
</template>
