<template>
  <div>
    <p>You have {{ guesses }} revives left.</p>
    <div>
      <div class="grid grid-cols-5 capitalize">
        <p
          v-for="label of ['name', 'sex', 'health', 'shield', 'release year']"
          :key="label"
        >
          {{ label }}
        </p>
      </div>
      <div
        v-for="warframe of guessedWarframes"
        :key="warframe.name"
        class="grid grid-cols-5"
      >
        <p>{{ warframe.name }}</p>
        <p>
          {{ warframe.sex
          }}{{ warframe.sex === warframeToGuess.sex ? "Correct" : "Incorrect" }}
        </p>
        <p>
          {{ warframe.health
          }}{{
            warframe.health === warframeToGuess.health
              ? "Correct"
              : warframe.health > warframeToGuess.health
                ? "Lower"
                : "Higher"
          }}
        </p>
        <p>
          {{ warframe.shield
          }}{{
            warframe.shield === warframeToGuess.shield
              ? "Correct"
              : warframe.shield > warframeToGuess.shield
                ? "Lower"
                : "Higher"
          }}
        </p>
        <p>
          {{ warframe.releaseDate.split("-")[0]
          }}{{
            warframe.releaseDate.split("-")[0] ===
            warframeToGuess?.releaseDate.split("-")[0]
              ? "Correct"
              : warframe.releaseDate.split("-")[0] >
                  warframeToGuess.releaseDate.split("-")[0]
                ? "Older"
                : "Newer"
          }}
        </p>
      </div>
    </div>
    <div v-if="!isGameOver" class="flex gap-4">
      <UInputMenu
        v-model="selectedWarframe"
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
const { data, status } = await useFetch(
  "https://api.warframestat.us/warframes",
);

const warframes = ref<Warframe[]>(
  data.value.filter((item) => item.category === "Warframes"),
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

const guessedWarframes = ref([]);

const warframeToGuess = ref(
  warframes.value[Math.floor(Math.random() * warframes.value.length)],
);

const selectedWarframe = ref<Warframe>(warframes.value[0]);

const checkGuess = () => {
  if (selectedWarframe.value.name === warframeToGuess.value.name) {
    toast.add({
      title: "Correct!",
      description: "You guessed the correct Warframe!",
    });
    isGameOver.value = true;
    warframeToGuess.value =
      warframes.value[Math.floor(Math.random() * warframes.value.length)];
  } else {
    toast.add({
      title: "Incorrect!",
      description: "You guessed the wrong Warframe!",
    });
    guesses.value -= 1;
    guessedWarframes.value.push(selectedWarframe.value);
  }
};

function createNewGame() {
  guesses.value = 6;
  guessedWarframes.value = [];
  isGameOver.value = false;
  warframeToGuess.value =
    warframes.value[Math.floor(Math.random() * warframes.value.length)];
}
</script>
