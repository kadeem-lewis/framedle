<script setup lang="ts">
import Fuse from "fuse.js";
import type { TableColumn, TableRow, TabsItem } from "@nuxt/ui";
import { h, resolveComponent } from "vue";

useSeoMeta({
  title: "Archive",
  ogTitle: "Framedle Archive",
  description:
    "Replay past daily Framedle puzzles for all modes starting from the very first day.",
  ogDescription:
    "Replay past daily Framedle puzzles for all modes starting from the very first day.",
});

const { proxy } = useScriptUmamiAnalytics();

const router = useRouter();
const route = useRoute("archive");

const { pastDays, selectedArchiveMode, order } = storeToRefs(useArchiveStore());
const { getRandomPastDay } = useArchiveStore();
selectedArchiveMode.value = (route.query.mode as GameType) || "classic";

watch(
  selectedArchiveMode,
  (newMode) => {
    router.replace({
      query: {
        mode: newMode,
      },
    });
  },
  { immediate: true },
);

const { gameTypes } = useGameMode();

const tabs = computed<TabsItem[]>(() =>
  gameTypes.map((type) => ({ label: type, value: type })),
);

const activeTab = computed({
  get() {
    return selectedArchiveMode.value;
  },
  set(value: GameType) {
    selectedArchiveMode.value = value;
  },
});

const searchQuery = ref("");

const fuse = computed(
  () =>
    new Fuse(pastDays.value ?? [], {
      keys: ["readableDate", "day"],
      threshold: 0.4,
    }),
);

const filteredDailies = computed(() => {
  const days = pastDays.value;

  if (!days || days.length === 0) {
    return [];
  }

  if (searchQuery.value === "") {
    return days;
  }

  return fuse.value.search(searchQuery.value).map((result) => result.item);
});

const UIcon = resolveComponent("UIcon");

function getIconStyle(state: GameStatusType | undefined) {
  if (!state) return "";
  if (state === GameStatus.ACTIVE) {
    return "text-partial";
  }
  return "text-success";
}

const columns: TableColumn<PastDay>[] = [
  {
    accessorKey: "state",
    header: "",
    cell: ({ row }) => {
      const state = row.getValue("state") as GameStatusType | undefined;
      const iconName =
        state === GameStatus.ACTIVE
          ? "i-mdi-play-circle"
          : "i-mdi-check-circle";
      return h(UIcon, {
        name: iconName,
        class: `size-6 ${getIconStyle(state)}`,
      });
    },
  },
  {
    accessorKey: "day",
    header: "Name",
    cell: ({ row }) => `Framedle #${row.getValue("day")}`,
  },
  {
    accessorKey: "readableDate",
    header: "Date",
  },
];

function onSelect(e: Event, row: TableRow<PastDay>) {
  const daily = row.original;
  proxy.track("started archive game", { date: daily.date });
  navigateTo(`/${selectedArchiveMode.value}/${daily.day}`);
}

const randomPastDay = computed(() => getRandomPastDay());
</script>
<template>
  <div class="flex flex-col gap-4">
    <p class="font-roboto text-xl font-bold uppercase">Archive</p>
    <UTabs
      v-model="activeTab"
      :content="false"
      variant="outline"
      color="primary"
      :items="tabs"
    />
    <ArchiveGameStats />
    <div class="flex items-center justify-end gap-4">
      <USelect
        v-model="order"
        aria-label="Order filter"
        :items="['OLDEST', 'NEWEST']"
        class="rounded-none uppercase"
      >
        <template #trailing>
          <UIcon name="i-mdi-triangle-down" class="size-3" />
        </template>
      </USelect>
      <UInput
        v-model="searchQuery"
        icon="i-mdi-magnify"
        :trailing="true"
        :ui="{
          base: 'rounded-none',
        }"
        placeholder="SEARCH..."
      />
    </div>
    <UTable
      :data="filteredDailies"
      :columns="columns"
      sticky
      class="max-h-96"
      @select="onSelect"
    />
    <UBadge
      v-if="!randomPastDay"
      variant="outline"
      size="lg"
      class="flex w-full items-center justify-center rounded-none text-base uppercase"
    >
      All days completed!
    </UBadge>
    <UButton
      v-else
      :to="`/${selectedArchiveMode}/${randomPastDay}`"
      variant="tenno"
      icon="i-mdi-dice"
      class="flex items-center justify-center uppercase"
      @click="
        proxy.track('Started Random Archive Game', {
          selectedArchiveMode,
          randomPastDay,
        })
      "
      >Random</UButton
    >
  </div>
</template>
