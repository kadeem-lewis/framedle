<script setup lang="ts">
const { rows, columns, attempts, userGridGuesses } = defineProps<{
  rows: CategoryItem[];
  columns: CategoryItem[];
  attempts: number;
  userGridGuesses: Record<string, GridCell>;
}>();

const selectedColumn = ref<CategoryItem>();
const selectedColumnIndex = ref<number>();
const selectedRow = ref<CategoryItem>();
const selectedRowIndex = ref<number>();

const isOpen = ref(false);

const { usedGuesses } = storeToRefs(useGridGameStore());

function updateSelectedCell(rowIndex: number, columnIndex: number) {
  if (!columns[columnIndex] || !rows[rowIndex]) {
    return;
  }

  selectedColumnIndex.value = columnIndex;
  selectedRowIndex.value = rowIndex;

  selectedColumn.value = columns[columnIndex];
  selectedRow.value = rows[rowIndex];

  isOpen.value = true;

  console.log("Selected cell:", selectedColumn.value, selectedRow.value);
}

const { submitGridGuess } = useGuess();

async function handleGuess(selectedWarframe: WarframeName) {
  console.log("Handling guess for:", selectedWarframe);
  if (
    !selectedRow.value ||
    !selectedColumn.value ||
    selectedRowIndex.value === undefined ||
    selectedColumnIndex.value === undefined
  )
    return;
  console.log("Hi");
  await submitGridGuess(
    selectedRow.value,
    selectedColumn.value,
    selectedRowIndex.value,
    selectedColumnIndex.value,
    selectedWarframe,
  );
  isOpen.value = false;
}
</script>
<template>
  <div class="grid grid-cols-4 gap-1">
    <div>Hello {{ attempts }}</div>
    <span v-for="column in columns" :key="column.label">
      {{ column.label }}
    </span>
    <template v-for="(row, i) in rows" :key="row.label">
      <div class="flex items-center justify-center">
        {{ row.label }}
      </div>
      <GridCell
        v-for="(col, j) in columns"
        :id="`cell-${i}-${j}`"
        :key="col.label"
        class="w-full bg-red-500 first:rounded-tl-xl last:rounded-br-xl"
        :is-revealed="!!userGridGuesses[`${i}-${j}`]"
        :warframe-name="userGridGuesses[`${i}-${j}`]?.value || ''"
        @click="updateSelectedCell(i, j)"
      />
    </template>
    <UModal v-model:open="isOpen" title="Make your guess">
      <template #description>
        <p>{{ selectedRow?.label }}/{{ selectedColumn?.label }}</p>
      </template>
      <template #body>
        <!-- This fails because a lot of my app relies on the arrays from the game store which are currently only available for the classic games -->
        <WarframeSearch
          :items="warframeNames"
          :excluded-items="usedGuesses"
          @submit="handleGuess"
        />
      </template>
    </UModal>
  </div>
</template>
