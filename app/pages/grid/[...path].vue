<script setup lang="ts">
definePageMeta({
  layout: "game",
});

const { data, pending } = await useFetch("/api/grid/generate", {
  query: { isUnlimited: "true" },
});

const columns = computed(() => data.value?.grid.columns ?? []);
const rows = computed(() => data.value?.grid.rows ?? []);

type CategoryItem = {
  label: string;
  id: string;
  description: string;
};

const selectedColumn = ref<CategoryItem>();
const selectedRow = ref<CategoryItem>();

const isOpen = ref(false);

function updateSelectedCell(rowIndex: number, columnIndex: number) {
  if (!columns.value[columnIndex] || !rows.value[rowIndex]) {
    return;
  }

  selectedColumn.value = columns.value[columnIndex];
  selectedRow.value = rows.value[rowIndex];

  isOpen.value = true;

  console.log("Selected cell:", selectedColumn.value, selectedRow.value);
}
</script>
<template>
  <UiAppSpinner v-if="pending" />
  <div v-else class="grid grid-cols-4 gap-1">
    <div>Hello</div>
    <span v-for="column in columns" :key="column.label">
      {{ column.label }}
    </span>
    <template v-for="(row, i) in rows" :key="row.label">
      <div class="flex items-center justify-center">
        {{ row.label }}
      </div>
      <span
        v-for="(col, j) in columns"
        :key="col.label"
        class="size-7 bg-red-500"
        @click="updateSelectedCell(i, j)"
      >
        {{ i }}/{{ j }}
      </span>
    </template>
    <UModal v-model:open="isOpen" title="Make your guess">
      <template #description>
        <p>{{ selectedRow?.description }}/{{ selectedColumn?.description }}</p>
      </template>
      <template #content>
        <div>{{ selectedRow?.label }} - {{ selectedColumn?.label }}</div>
        <!-- This fails because a lot of my app relies on the arrays from the game store which are currently only available for the classic games -->
        <WarframeSearch :items="warframeNames" />
      </template>
    </UModal>
  </div>
</template>
