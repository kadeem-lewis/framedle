<script setup lang="ts">
const emit = defineEmits(["loading", "loaded"]);

const { itemToGuess, attempts } = storeToRefs(useGameStore());
const mode = useGameMode();
const { isGameOver } = storeToRefs(useGameStateStore());

const imageLoaded = ref(false);
const imageObj = ref<HTMLImageElement | null>(null);

const CANVAS_SIZE = 240; // Size of the canvas in pixels

// Grid configuration
const gridCols = 3;
const gridRows = 2;
const totalCells = gridCols * gridRows;

const img = useImage();

const imageUrl = computed(() => {
  if (mode.value === "ability") {
    return img(
      `https://cdn.warframestat.us/img/${itemToGuess.value.ability?.imageName}`,
      { format: "webp", width: CANVAS_SIZE, height: CANVAS_SIZE },
      { modifiers: { enlarge: `${CANVAS_SIZE}x${CANVAS_SIZE}` } }, // scale smaller images up to CANVAS_SIZE
    );
  } else if (mode.value === "abilityUnlimited") {
    return img(
      `https://cdn.warframestat.us/img/${itemToGuess.value.abilityUnlimited?.imageName}`,
      { format: "webp", width: CANVAS_SIZE, height: CANVAS_SIZE },
      { modifiers: { enlarge: `${CANVAS_SIZE}x${CANVAS_SIZE}` } },
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

function loadImage() {
  if (!imageUrl.value) return;

  const img = new Image();
  img.crossOrigin = "anonymous"; // Handle CORS if needed

  img.onload = () => {
    imageObj.value = img;
    imageLoaded.value = true;
    renderCanvases();
    emit("loaded", true);
  };

  img.onerror = (err) => {
    emit("loaded", false);
    console.error("Error loading image:", err);
  };

  img.src = imageUrl.value;
}

watch(
  imageUrl,
  () => {
    emit("loading");
    loadImage();
  },
  { immediate: true },
);

const canvasRefs = useTemplateRefsList<HTMLCanvasElement>();

/**
 * The actual rendering of the images is one guess behind so the new canvas is added but nothing is rendered on it the first time
 *  - I think I fixed this by using nextTick to wait for the DOM to update before rendering
 * There needs to be a separate loading state or variable for each mode, the game shouldn't have to reload an image when swapping modes
 */

function renderCanvases() {
  if (!imageObj.value || !canvasRefs.value.length) return;

  const cellWidth = CANVAS_SIZE / gridCols;
  const cellHeight = CANVAS_SIZE / gridRows;

  canvasRefs.value.forEach((canvas, i) => {
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = cellWidth;
    canvas.height = cellHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellIndex = i;
    const col = cellIndex % gridCols;
    const row = Math.floor(cellIndex / gridCols);

    // Calculate positions
    const sourceX = col * cellWidth;
    const sourceY = row * cellHeight;

    // Draw the image fragment
    ctx.drawImage(
      imageObj.value!,
      sourceX,
      sourceY,
      cellWidth,
      cellHeight, // Source rectangle
      0,
      0,
      cellWidth,
      cellHeight, // Destination rectangle
    );
  });
}

// Watch for changes in attempts or game state to update the canvas
watch(
  [attempts, isGameOver, mode, revealedCells],
  () => {
    if (imageLoaded.value) {
      nextTick(() => renderCanvases());
    }
  },
  { deep: true, immediate: true },
);
</script>
<template>
  <template v-if="mode === 'ability' || mode === 'abilityUnlimited'">
    <div class="flex items-center justify-center p-4">
      <div class="grid h-60 w-60 grid-cols-3 grid-rows-2">
        <canvas
          v-for="index of revealedCells"
          :key="index"
          :ref="canvasRefs.set"
          class="col-span-1 aspect-square invert transition-transform duration-500 dark:invert-0"
          :class="{
            'rotate-180':
              index === revealedCells &&
              revealedCells !== totalCells &&
              !isGameOver,
          }"
        />
        <div
          v-for="index of totalCells - revealedCells"
          :key="index"
          class="col-span-1 flex h-full items-center justify-center border bg-red-500 dark:bg-red-600"
        >
          <UIcon name="i-mdi-help" class="text-4xl" />
        </div>
      </div>
    </div>
  </template>
</template>
