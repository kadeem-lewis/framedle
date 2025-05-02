<script setup lang="ts">
const emit = defineEmits(["loading", "loaded"]);

const { itemToGuess, attempts } = storeToRefs(useGameStore());
const { defaultAttempts } = useGameStore();
const mode = useGameMode();
const { isGameOver } = storeToRefs(useGameStateStore());

const canvasRef = useTemplateRef("imageCanvas");
const imageLoaded = ref(false);
const imageObj = ref<HTMLImageElement | null>(null);

// Grid configuration
const gridCols = 3;
const gridRows = 2;
const totalCells = gridCols * gridRows;

const img = useImage();

const imageUrl = computed(() => {
  if (mode.value === "ability") {
    return img(
      `https://cdn.warframestat.us/img/${itemToGuess.value.ability?.imageName}`,
      { format: "webp", width: 240, height: 240, fit: "inside" },
    );
  } else if (mode.value === "abilityUnlimited") {
    return img(
      `https://cdn.warframestat.us/img/${itemToGuess.value.abilityUnlimited?.imageName}`,
      { format: "webp", width: 240, height: 240, fit: "inside" },
    );
  }
  throw createError("Ability mode is not set");
});

// Compute which cells should be revealed based on attempts remaining
const revealedCells = computed(() => {
  if (!mode.value) throw createError("Mode is not set");
  if (isGameOver.value) {
    return totalCells; // Show entire image when game is over
  }

  const cellsToReveal = totalCells - attempts.value[mode.value];

  return Math.max(0, cellsToReveal) + 1;
});

// Deterministic cell reveal order - this defines the sequence in which cells are revealed
// Cells are indexed from 0-5 (for a 3x2 grid), going left to right, top to bottom
const cellRevealOrder: number[] = [
  // Top-left, Top-center, Top-right, Bottom-left, Bottom-center, Bottom-right
  0, 2, 4, 1, 3, 5,
];

function loadImage() {
  if (!imageUrl.value) return;

  const img = new Image();
  img.crossOrigin = "anonymous"; // Handle CORS if needed

  img.onload = () => {
    imageObj.value = img;
    imageLoaded.value = true;
    renderCanvas();
    emit("loaded", true);
  };

  img.onerror = (err) => {
    emit("loaded", false);
    console.error("Error loading image:", err);
  };

  img.src = imageUrl.value;
}

function renderCanvas() {
  if (!canvasRef.value || !imageObj.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fill canvas with background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cellWidth = canvas.width / gridCols;
  const cellHeight = canvas.height / gridRows;

  // Determine which cells to reveal
  const cellsToShow = revealedCells.value;

  // Reveal cells in the predetermined order
  for (let i = 0; i < cellsToShow; i++) {
    // Get the index of the cell to reveal
    const cellIndex = cellRevealOrder[i];
    const col = cellIndex % gridCols;
    const row = Math.floor(cellIndex / gridCols);

    // Calculate cell positions
    const x = col * cellWidth;
    const y = row * cellHeight;

    // Save context for potential future transformations
    ctx.save();

    ctx.drawImage(
      imageObj.value,
      x,
      y,
      cellWidth,
      cellHeight, // Source rectangle
      x,
      y,
      cellWidth,
      cellHeight, // Destination rectangle
    );

    // Restore context to remove any transformations
    ctx.restore();
  }
}

// Watch for changes in attempts or game state to update the canvas
watch(
  [attempts, isGameOver, mode],
  () => {
    if (imageLoaded.value) {
      renderCanvas();
    }
  },
  { deep: true, immediate: true },
);

// Reload image when item to guess changes
watch(
  imageUrl,
  () => {
    emit("loading");
    loadImage();
  },
  { immediate: true },
);
</script>
<template>
  <div v-if="mode === 'ability' || mode === 'abilityUnlimited'">
    <canvas ref="imageCanvas" width="240" height="240" />
    <div class="flex items-center justify-center p-4">
      <div class="relative">
        <div class="absolute inset-0 z-10 grid grid-cols-3 grid-rows-2">
          <div
            v-for="(_, index) of new Array(defaultAttempts)"
            :key="index"
            class="col-span-1 flex h-full items-center justify-center border bg-red-500 dark:bg-red-600"
            :class="{
              hidden: index <= defaultAttempts - attempts[mode] || isGameOver,
            }"
          >
            <UIcon name="i-mdi-help" class="text-4xl" />
          </div>
        </div>
        <NuxtImg
          v-if="mode === 'ability'"
          format="webp"
          :src="`https://cdn.warframestat.us/img/${itemToGuess.ability?.imageName}`"
          alt="Ability Image"
          placeholder
          preload
          height="240"
          width="240"
          class="h-60 invert dark:invert-0"
        />
        <NuxtImg
          v-if="mode === 'abilityUnlimited'"
          format="webp"
          :src="`https://cdn.warframestat.us/img/${itemToGuess.abilityUnlimited?.imageName}`"
          alt="Ability Image"
          placeholder
          preload
          height="240"
          width="240"
          class="h-60 invert dark:invert-0"
        />
      </div>
    </div>
  </div>
</template>
