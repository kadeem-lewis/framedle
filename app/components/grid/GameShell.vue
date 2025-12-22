<script setup lang="ts">
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

const { usedGuesses, currentGame } = storeToRefs(useGridGameStore());
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
  } catch (error) {
    console.error("Error handling guess:", error);
  }
}

const { mode } = useGameMode();
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
</script>
<template>
  <div>
    <div class="grid grid-cols-4 gap-1">
      <div>Hello {{ gameState.attempts }}</div>
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
          :warframe-name="gameState.grid[`${i}-${j}`]?.value || ''"
          @click="updateSelectedCell(i, j)"
        />
      </template>
    </div>
    <div class="mt-2 w-full text-center">
      <small class="text-muted">Tap on a category for help</small>
    </div>
    <div class="flex w-full items-center justify-center">
      <UButton
        v-if="mode === 'gridUnlimited'"
        icon="i-mdi-refresh"
        @click="resetGridGame"
        >Generate</UButton
      >
      <UButton v-else color="error" class="mt-4"> Give Up </UButton>
    </div>
    <UModal v-model:open="isOpen" title="Make your guess">
      <template #description>
        <p>{{ selectedRow?.label }}/{{ selectedColumn?.label }}</p>
      </template>
      <template #body>
        <!-- This fails because a lot of my app relies on the arrays from the game store which are currently only available for the classic games -->
        <WarframeSearch
          :items="warframeNames"
          :disabled-items="allDisabledItems"
          @submit="handleGuess"
        />
      </template>
    </UModal>
  </div>
</template>
