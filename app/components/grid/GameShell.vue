<script setup lang="ts">
import { format } from "date-fns";

const { gameState } = defineProps<{
  gameState: GridGameState;
}>();

const columns = computed(() => gameState.config?.columns || []);
const rows = computed(() => gameState.config?.rows || []);

const selectedColumn = ref<string>();
const selectedColumnIndex = ref<number>();
const selectedRow = ref<string>();
const selectedRowIndex = ref<number>();

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
            'bg-error/50 transition-colors ease-in-out':
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
    <div class="flex w-full items-center justify-center">
      <UiConfirmPopup
        v-if="mode === 'gridUnlimited'"
        title="Are you sure you generate a new grid?"
        success-label="Give Up"
        cancel-label="Cancel"
        @confirm="resetGridGame"
      >
        <UButton icon="i-mdi-refresh">Generate</UButton>
      </UiConfirmPopup>
      <template v-else>
        <UiConfirmPopup
          v-if="!isGameOver"
          title="Are you sure you want to give up?"
          success-label="Give Up"
          cancel-label="Cancel"
        >
          <UButton variant="subtle" color="error" class="font-medium uppercase">
            Abort Mission
          </UButton>
        </UiConfirmPopup>
        <UButton v-else @click="openSummaryDialog">Summary</UButton>
      </template>
    </div>
    <GridPuzzleStats v-if="isDaily" />
    <UModal v-model:open="isOpen" title="Make your guess">
      <!-- TODO: I'm gonna need to handle this part because I don't want it showing the ids -->
      <template #description>
        <p>{{ selectedRow }}/{{ selectedColumn }}</p>
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
