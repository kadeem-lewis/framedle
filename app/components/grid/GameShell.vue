<script setup lang="ts">
import { format } from "date-fns";

const { gameState } = defineProps<{
  gameState: GridGameState;
}>();

const cols = computed(() => gameState.config?.cols || []);
const rows = computed(() => gameState.config?.rows || []);

const selectedColumn = ref<CategoryItem>();
const selectedColumnIndex = ref<number>();
const selectedRow = ref<CategoryItem>();
const selectedRowIndex = ref<number>();

const isOpen = ref(false);

const { usedGuesses, currentGame, rarityScore, gameScore } =
  storeToRefs(useGridGameStore());
const { isGameOver } = storeToRefs(useGameStateStore());

function updateSelectedCell(rowIndex: number, columnIndex: number) {
  if (
    !cols.value[columnIndex] ||
    !rows.value[rowIndex] ||
    gameState.grid[`${rowIndex}-${columnIndex}`]?.value ||
    isGameOver.value
  ) {
    return;
  }

  selectedColumnIndex.value = columnIndex;
  selectedRowIndex.value = rowIndex;

  selectedColumn.value = cols.value[columnIndex];
  selectedRow.value = rows.value[rowIndex];

  isOpen.value = true;
}

const { submitGridGuess } = useGuess();

const toast = useToast();

const { openDialog } = useDialog();

const openSummaryDialog = () => {
  isOpen.value = false;
  openDialog(dialogOptions.SUMMARY);
};

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
    if (response) {
      isOpen.value = false;
    } else if (currentGame.value.attempts <= 1) {
      toast.add({
        title: "Incorrect Guess",
        color: "error",
      });
    }
    if (isGameOver.value) {
      openSummaryDialog();
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
      <GridLabel v-for="column in cols" :key="column.label" :category="column">
        {{ column.label }}
      </GridLabel>
      <template v-for="(row, i) in rows" :key="row.label">
        <GridLabel :category="row" class="flex items-center justify-center">
          {{ row.label }}
        </GridLabel>
        <GridCell
          v-for="(col, j) in cols"
          :id="`cell-${i}-${j}`"
          :key="col.label"
          :is-revealed="!!gameState.grid[`${i}-${j}`]"
          :data="gameState.grid[`${i}-${j}`]"
          :warframe-name="gameState.grid[`${i}-${j}`]?.value || ''"
          :class="{
            'border-r': j < cols.length - 1,
            'border-b': i < rows.length - 1,
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
        <span> {{ gameState.attempts }}</span>
      </div>
      <div v-if="isDaily" class="flex flex-col items-center gap-1">
        <span class="font-semibold uppercase">Uniqueness:</span>
        <span>
          {{ rarityScore }}
        </span>
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold uppercase">Score:</span>
        <span> {{ gameScore }}/{{ rows.length * cols.length }}</span>
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
      <template #description>
        <p>{{ selectedRow?.label }}/{{ selectedColumn?.label }}</p>
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
