<template>
  <div class="flex flex-col gap-4">
    <UTabs v-model="selectedTab" :items="tabs">
      <template #item="{ item }">
        <div v-if="item.label === 'Unlimited'">
          <p>You have {{ guesses }} revives left.</p>
          <div class="grid grid-cols-6 capitalize md:-ml-[15%] md:w-[130%]">
            <p
              v-for="label of [
                'name',
                'sex',
                'health',
                'shield',
                'progenitor',
                'release year',
              ]"
              :key="label"
              class="justify-self-center"
            >
              {{ label }}
            </p>
          </div>
          <div class="space-y-2">
            <ClassicFeedbackRow
              v-for="warframe of guessedWarframes"
              :key="warframe.name"
              :guessed-warframe="warframe"
              :correct-warframe="warframeToGuess"
            />
          </div>
        </div>
        <div v-if="item.label === 'Daily'">Coming Soon</div>
      </template>
    </UTabs>

    <div v-if="!isGameOver" class="flex gap-4">
      <UInputMenu
        v-model="selectedWarframe!"
        :search="search"
        :options="warframes"
        :loading="String(status) === 'loading'"
        placeholder="Select a Warframe"
        by="name"
        option-attribute="name"
        :search-attributes="['name']"
        class="grow"
      />
      <UButton @click="checkGuess">Submit</UButton>
    </div>
    <div v-else>
      <p>Game Over!</p>
      <p>The answer was {{ warframeToGuess?.name }}</p>
      <p>{{ guesses > 0 ? "You Won" : "You Lost Sucka" }}</p>
      <UButton @click="createNewGame">New Game</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Warframe } from "warframe-items";
import Fuse from "fuse.js";
import { progenitors } from "~/constants/progenitors";
const { data, status } = await useFetch(
  "https://api.warframestat.us/warframes",
);

type WarframeWithProgenitor = Warframe & {
  progenitor: string;
};

// probably use zod to make sure that the data and all available

const warframes = ref<Warframe[]>(
  data.value
    .map((item: Warframe) => ({
      ...item,
      progenitor: progenitors[item.name],
    }))
    .filter((item: WarframeWithProgenitor) => item.category === "Warframes"),
);

const toast = useToast();
const fuse = new Fuse(warframes.value, {
  keys: ["name"],
  threshold: 0.4,
});

const search = (query: string) => {
  if (query === "") {
    return warframes.value;
  } else {
    return fuse.search(query).map((result) => ({ ...result.item }));
  }
};

const guesses = ref(6);
const isGameOver = ref(false);

watch(guesses, (value) => {
  if (value === 0) {
    isGameOver.value = true;
  }
});

const guessedWarframes = ref<WarframeWithProgenitor[]>([]);
// If I get the correct guess it should still be added to guessed items but then I need to update the game over condition

const warframeToGuess = ref(
  warframes.value[Math.floor(Math.random() * warframes.value.length)],
);

const selectedWarframe = ref<WarframeWithProgenitor | null>(null);

const checkGuess = () => {
  if (!selectedWarframe.value) return;

  if (selectedWarframe.value.name === warframeToGuess.value.name) {
    isGameOver.value = true;
    warframeToGuess.value =
      warframes.value[Math.floor(Math.random() * warframes.value.length)];
  } else {
    guesses.value -= 1;
    guessedWarframes.value.push(selectedWarframe.value);
  }
  selectedWarframe.value = null;
};

function createNewGame() {
  guesses.value = 6;
  guessedWarframes.value = [];
  isGameOver.value = false;
  warframeToGuess.value =
    warframes.value[Math.floor(Math.random() * warframes.value.length)];
}

const router = useRouter();
const route = useRoute();

const tabs = [{ label: "Daily" }, { label: "Unlimited" }];

const selectedTab = ref(route.query.mode ? 1 : 0);

watch(
  selectedTab,
  (value) => {
    if (tabs[value]?.label === "Unlimited") {
      router.replace({ query: { mode: "unlimited" } });
    } else if (tabs[value]?.label === "Daily") {
      router.replace(route.path);
    }
  },
  {
    immediate: true,
  },
);
</script>
