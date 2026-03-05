<script setup lang="ts">
import { motion } from "motion-v";
const emit = defineEmits(["loading", "loaded"]);

const { itemToGuess, attempts } = storeToRefs(useGameStore());
const { mode } = useGameMode();
const { isGameOver } = storeToRefs(useGameStateStore());

const imageLoaded = ref(false);
const imageObj = ref<HTMLImageElement | null>(null);

const CANVAS_SIZE = 240 as const; // Size of the canvas in pixels

// Grid configuration
const GRID_COLS = 3 as const;
const GRID_ROWS = 2 as const;
const totalCells = GRID_COLS * GRID_ROWS;

const img = useImage();

const imageUrl = computed(() => {
  if (mode.value === "ability" && itemToGuess.value.ability) {
    return img(
      `https://cdn.warframestat.us/img/${itemToGuess.value.ability?.imageName}`,
      { format: "webp", width: CANVAS_SIZE, height: CANVAS_SIZE },
      { modifiers: { enlarge: true } }, // scale smaller images up to CANVAS_SIZE
    );
  } else if (
    mode.value === "abilityUnlimited" &&
    itemToGuess.value.abilityUnlimited
  ) {
    return img(
      `https://cdn.warframestat.us/img/${itemToGuess.value.abilityUnlimited?.imageName}`,
      { format: "webp", width: CANVAS_SIZE, height: CANVAS_SIZE },
      { modifiers: { enlarge: true } },
    );
  }
  throw createError("Ability mode is not set");
});

// Compute which cells should be revealed based on attempts remaining
const revealedCells = computed(() => {
  if (!mode.value) throw createError("Mode is not set");
  if (mode.value !== "ability" && mode.value !== "abilityUnlimited")
    throw createError("Not an ability mode");
  if (isGameOver.value) {
    return totalCells; // Show entire image when game is over
  }

  const cellsToReveal = totalCells - attempts.value[mode.value];

  const calculatedRevealedCells = Math.max(0, cellsToReveal) + 1;
  return Math.min(totalCells, calculatedRevealedCells);
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

const canvasRefs = ref<(HTMLCanvasElement | null)[]>([]);

/**
 * The actual rendering of the images is one guess behind so the new canvas is added but nothing is rendered on it the first time
 *  - I think I fixed this by using nextTick to wait for the DOM to update before rendering
 * There needs to be a separate loading state or variable for each mode, the game shouldn't have to reload an image when swapping modes
 */

function renderCanvases() {
  if (!imageObj.value || !canvasRefs.value.length) return;

  const cellWidth = CANVAS_SIZE / GRID_COLS;
  const cellHeight = CANVAS_SIZE / GRID_ROWS;

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
    const col = cellIndex % GRID_COLS;
    const row = Math.floor(cellIndex / GRID_COLS);

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
  <div class="flex items-center justify-center p-4">
    <div class="grid h-60 w-60 grid-cols-3 grid-rows-2 transition-transform">
      <div v-for="index in totalCells" :key="`cell-${index}`" class="relative">
        <AnimatePresence>
          <motion.div
            v-if="index <= revealedCells"
            :initial="{ opacity: 0, rotateY: 90 }"
            :animate="{ opacity: 1, rotateY: 0 }"
            :transition="{ duration: 0.3, ease: 'easeIn' }"
            class="absolute inset-0"
          >
            <canvas
              :ref="
                (el) => {
                  canvasRefs[index - 1] = el as HTMLCanvasElement | null;
                }
              "
              class="invert dark:invert-0"
              :class="{
                'rotate-180':
                  index === revealedCells && revealedCells !== totalCells,
                'transition-transform duration-300 ease-in': !isGameOver,
              }"
            />
          </motion.div>
          <UiPrexCard v-else class="absolute inset-0" />
        </AnimatePresence>
      </div>
    </div>
  </div>
</template>
