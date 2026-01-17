<script setup lang="ts">
import { format } from "date-fns";
import { getCategoryDisplay } from "#shared/data/categoryMetadata";

const { gameState } = defineProps<{
  gameState: GridGameState;
}>();

const columns = computed(() => gameState.config?.columns || []);
const rows = computed(() => gameState.config?.rows || []);

const selectedColumn = ref<string>();
const selectedColumnIndex = ref<number>();
const selectedRow = ref<string>();
const selectedRowIndex = ref<number>();

const rowLabel = computed(() => {
  const { key, value } = getKeyValueFromId(selectedRow.value || "");
  const category = getCategoryDisplay(key, value);
  return `${category?.header}:${category?.value}`;
});

const columnLabel = computed(() => {
  const { key, value } = getKeyValueFromId(selectedColumn.value || "");
  const category = getCategoryDisplay(key, value);
  return `${category?.header}:${category?.value}`;
});

const isOpen = ref(false);

const { usedGuesses, currentGame, rarityScore, gameScore } =
  storeToRefs(useGridGameStore());
const { isGameOver } = storeToRefs(useGameStateStore());

function updateSelectedCell(rowIndex: number, columnIndex: number) {
  if (
    !columns.value[columnIndex] ||
    !rows.value[rowIndex] ||
    gameState.grid[`${rowIndex}-${columnIndex}`]?.value ||
    isGameOver.value
  ) {
    return;
  }

  selectedColumnIndex.value = columnIndex;
  selectedRowIndex.value = rowIndex;

  selectedColumn.value = columns.value[columnIndex];
  selectedRow.value = rows.value[rowIndex];

  isOpen.value = true;
}

const { submitGridGuess } = useGuess();

const { openDialog } = useDialog();

const openSummaryDialog = () => {
  isOpen.value = false;
  openDialog(dialogOptions.SUMMARY);
};

useGameOverDialog();

const isIncorrect = refAutoReset(false, 1000);

async function handleGuess(selectedWarframe: WarframeName) {
  if (
    !selectedRow.value ||
    !selectedColumn.value ||
    selectedRowIndex.value === undefined ||
    selectedColumnIndex.value === undefined
  )
    return;
  try {
    const response = await submitGridGuess(
      selectedRow.value,
      selectedColumn.value,
      selectedRowIndex.value,
      selectedColumnIndex.value,
      selectedWarframe,
    );
    isOpen.value = false;
    if (!response && currentGame.value.attempts > 0) {
      isIncorrect.value = true;
    }
  } catch (error) {
    console.error("Error handling guess:", error);
  }
}

const { mode, isDaily } = useGameMode();
const { resetGridGame } = useGridGameStore();

const pairDisabledItems = computed(() => {
  const currentCell =
    gameState.grid[`${selectedRowIndex.value}-${selectedColumnIndex.value}`];
  return currentCell?.invalidGuesses || [];
});

const allDisabledItems = computed(() => [
  ...usedGuesses.value,
  ...pairDisabledItems.value,
]);

const { currentDailyGridData } = storeToRefs(useDailiesStore());
const { giveUpGridDaily } = useDailiesStore();

const puzzleHeading = computed(() => {
  if (mode.value === "grid" && currentDailyGridData.value) {
    return currentDailyGridData.value.date === format(new Date(), "yyyy-MM-dd")
      ? "Today's Puzzle"
      : `Archive #${currentDailyGridData.value.day} Puzzle`;
  }
  if (mode.value === "gridUnlimited") {
    return "Unlimited Mode";
  }
  return null;
});

const { getAdjacentArchiveDays } = useArchiveStore();
const { proxy } = useScriptUmamiAnalytics();

const adjacentDays = computedAsync(async () => {
  if (!currentDailyGridData.value) {
    return { previous: null, next: null };
  }
  return await getAdjacentArchiveDays(currentDailyGridData.value.day, "grid");
});

useSubmission();
</script>
<template>
  <div class="flex flex-col gap-2">
    <h2 class="text-center text-xl font-semibold uppercase">
      {{ puzzleHeading }}
    </h2>
    <div class="grid grid-cols-4">
      <div />
      <GridLabel v-for="column in columns" :key="column" :category="column">
        {{ column }}
      </GridLabel>
      <template v-for="(row, i) in rows" :key="row">
        <GridLabel :category="row" class="flex items-center justify-center">
          {{ row }}
        </GridLabel>
        <GridCell
          v-for="(col, j) in columns"
          :id="`cell-${i}-${j}`"
          :key="`${row}-${col}`"
          :is-revealed="!!gameState.grid[`${i}-${j}`]"
          :rarity="gameState.grid[`${i}-${j}`]?.rarity"
          :warframe-name="gameState.grid[`${i}-${j}`]?.value || ''"
          :class="{
            'border-r': j < columns.length - 1,
            'border-b': i < rows.length - 1,
            'dark:bg-error/50 bg-error/50 transition-colors ease-in-out':
              selectedRowIndex === i &&
              selectedColumnIndex === j &&
              isIncorrect,
          }"
          @click="updateSelectedCell(i, j)"
        />
      </template>
    </div>
    <div class="mt-2 w-full text-center">
      <small class="text-muted">Tap on a category for help</small>
    </div>
    <div class="flex" :class="[isDaily ? 'justify-between' : 'justify-around']">
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold uppercase">Attempts:</span>
        <span
          :class="{
            'text-error scale-150 transition-transform ease-in-out':
              isIncorrect,
          }"
        >
          {{ gameState.attempts }}</span
        >
      </div>
      <div v-if="isDaily" class="flex flex-col items-center gap-1">
        <span class="font-semibold uppercase">Uniqueness:</span>
        <span>
          {{ rarityScore }}
        </span>
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold uppercase">Score:</span>
        <span> {{ gameScore }}/{{ rows.length * columns.length }}</span>
      </div>
    </div>
    <div
      v-if="mode === 'gridUnlimited'"
      class="mt-2 flex w-full items-center justify-center"
    >
      <UiConfirmPopup
        title="Are you sure you generate a new grid?"
        :success-label="isGameOver ? 'Restart' : 'Give Up'"
        cancel-label="Cancel"
        @confirm="resetGridGame"
      >
        <UButton variant="outline" icon="i-mdi-refresh" class="col-start-2"
          >Generate</UButton
        >
      </UiConfirmPopup>
    </div>
    <div v-else class="mt-2 grid grid-cols-3 place-items-center gap-2">
      <UButton
        v-if="adjacentDays?.previous"
        :to="`/grid/${adjacentDays?.previous}`"
        variant="outline"
        icon="i-heroicons-arrow-left"
        @click="proxy.track('Visited Previous Day', { mode: 'grid' })"
        >Prev</UButton
      >
      <UiConfirmPopup
        v-if="!isGameOver"
        title="Are you sure you want to give up?"
        success-label="Give Up"
        cancel-label="Cancel"
        @confirm="giveUpGridDaily"
      >
        <UButton
          variant="subtle"
          color="error"
          class="col-start-2 w-fit rounded-none font-medium uppercase"
        >
          Abort Mission
        </UButton>
      </UiConfirmPopup>
      <UButton
        v-else
        class="col-start-2 w-fit rounded-none"
        @click="openSummaryDialog"
        >Summary</UButton
      >
      <UButton
        v-if="adjacentDays?.next"
        :to="`/${mode}/${adjacentDays?.next}`"
        variant="outline"
        trailing
        icon="i-heroicons-arrow-right"
        @click="proxy.track('Visited Next Day', { mode })"
        >Next</UButton
      >
    </div>
    <GridPuzzleStats v-if="isDaily" />
    <UModal v-model:open="isOpen" title="Make your guess" class="rounded-none">
      <template #description>
        <div>
          <p>{{ rowLabel }}&nbsp;/&nbsp;{{ columnLabel }}</p>
        </div>
      </template>
      <template #body>
        <WarframeSearch
          :items="warframeNames"
          :disabled-items="allDisabledItems"
          @submit="handleGuess"
        />
      </template>
    </UModal>
  </div>
</template>
