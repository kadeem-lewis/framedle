export function useShare() {
  const EMOJIS: {
    incorrect: string;
    correct: string;
    partial: string;
    lower: string;
    higher: string;
    unused: string;
  } = {
    incorrect: "🟥",
    correct: "🟩",
    partial: "🟨",
    lower: "🔽",
    higher: "🔼",
    unused: "⬜",
  } as const;

  const { guessedItems, itemToGuess, attempts } = storeToRefs(useGameStore());
  const { DEFAULT_ATTEMPTS } = useGameStore();
  const {
    currentDailyClassicData,
    currentDailyGridData,
    currentDailyAbilityData,
  } = storeToRefs(useDailiesStore());

  const { mode, gameVariant, gameType, isLegacyMode } = useGameMode();
  const { hasWon } = storeToRefs(useGameStateStore());

  const { encode } = useEncoder();

  const route = useRoute();
  const { copy, copied } = useClipboard();
  const { checkGuess } = useGuess();

  function getClassicRow(correctItem: Warframe, guessedItem: Warframe) {
    return [
      EMOJIS[checkGuess(correctItem.sex, guessedItem.sex)],
      EMOJIS[checkGuess(correctItem.variant, guessedItem.variant)],
      EMOJIS[
        checkGuess([...correctItem.playstyle], [...guessedItem.playstyle])
      ],
      EMOJIS[checkGuess(correctItem.health, guessedItem.health)],
      EMOJIS[checkGuess(correctItem.shield, guessedItem.shield)],
      EMOJIS[checkGuess(correctItem.progenitor, guessedItem.progenitor)],
      EMOJIS[
        checkGuess(
          parseReleaseDate(correctItem.releaseDate),
          parseReleaseDate(guessedItem.releaseDate),
        )
      ],
    ].join("");
  }

  const { daily, gameScore, rarityScore } = storeToRefs(useGridGameStore());

  function generateGridGameMatrix() {
    const SIZE = 3;
    const shareGrid: number[][] = Array.from({ length: SIZE }, () =>
      Array(SIZE).fill(0),
    );

    const grid = daily.value.grid;
    if (!grid) return shareGrid;

    for (const [key, cell] of Object.entries(grid)) {
      const [rowIndexStr, colIndexStr] = key.split("-");
      if (!rowIndexStr || !colIndexStr) continue;
      const rowIndex = Number(rowIndexStr);
      const colIndex = Number(colIndexStr);

      if (cell.value) {
        shareGrid[rowIndex]![colIndex] = 1;
      }
    }
    return shareGrid;
  }

  const headerText = computed(() => {
    const currentMode = mode.value;
    if (!currentMode) return "";

    if (gameType.value === "grid") {
      return `Framedle Grid #${currentDailyGridData.value?.day} ${gameScore.value}/9\nUniqueness: ${rarityScore.value}`;
    }

    if (isLegacyMode(currentMode)) {
      const attemptsLeft = attempts.value[currentMode];
      const attemptsUsed = DEFAULT_ATTEMPTS - attemptsLeft;

      if (
        currentMode === "classicUnlimited" ||
        currentMode === "abilityUnlimited"
      ) {
        return hasWon.value
          ? `I solved a Framedle in ${attemptsUsed} out of ${DEFAULT_ATTEMPTS} turns.`
          : `I couldn't solve this Framedle in ${DEFAULT_ATTEMPTS} turns.`;
      }

      if (currentMode === "classic" || currentMode === "ability") {
        const dayNum =
          currentMode === "classic"
            ? currentDailyClassicData.value?.day
            : currentDailyAbilityData.value?.day;

        const scoreDisplay = hasWon.value ? attemptsUsed : "X";

        return `Framedle ${currentMode} #${dayNum} ${scoreDisplay}/${DEFAULT_ATTEMPTS}`;
      }
    }

    return "";
  });

  const emojiBlock = computed(() => {
    const currentMode = mode.value;
    if (!currentMode) return "";

    if (currentMode === "grid") {
      const rawGrid = generateGridGameMatrix();
      return rawGrid
        .map((row) =>
          row
            .map((cell) => (cell === 1 ? EMOJIS.correct : EMOJIS.unused))
            .join(""),
        )
        .join("\n");
    }

    if (currentMode === "ability" || currentMode === "abilityUnlimited") {
      const target = itemToGuess.value[currentMode]?.belongsTo;

      if (!target) return "";

      const currentAttempts = attempts.value[currentMode];

      const playedEmojis = guessedItems.value[currentMode].map(
        (guessed) => EMOJIS[checkGuess(target, guessed)],
      );

      const emptyEmojis = Array(currentAttempts).fill(EMOJIS.unused);
      return [...playedEmojis, ...emptyEmojis].join(" ");
    }

    if (currentMode === "classic" || currentMode === "classicUnlimited") {
      const target = itemToGuess.value[currentMode];
      if (!target) return "";

      return guessedItems.value[currentMode]
        .map((guessed) =>
          getClassicRow(getWarframe(target), getWarframe(guessed)),
        )
        .join("\n");
    }

    return "";
  });

  const bottomText = computed(() => {
    const baseUrl = window.location.origin + window.location.pathname;

    if (gameVariant.value === "unlimited") {
      let encodedAnswer = "";
      // Explicit checks to ensure we only access valid keys
      if (
        mode.value === "classicUnlimited" &&
        itemToGuess.value["classicUnlimited"]
      ) {
        encodedAnswer = encode(itemToGuess.value["classicUnlimited"]);
      } else if (
        mode.value === "abilityUnlimited" &&
        itemToGuess.value["abilityUnlimited"]
      ) {
        encodedAnswer = encode(itemToGuess.value["abilityUnlimited"].name);
      }
      return `See how you do on the same challenge I played:\n${baseUrl}?x=${encodedAnswer}`;
    }

    return baseUrl;
  });

  const shareText = computed(() => {
    return [headerText.value, emojiBlock.value, bottomText.value].join("\n\n");
  });

  const { stats } = storeToRefs(useStatsStore());

  function handleStatsShare() {
    if (!mode.value) return;
    const currentMode = mode.value;
    let currentStats: (typeof stats.value)[keyof typeof stats.value];
    let modeName = "";
    if (currentMode === "classic" || currentMode === "classicUnlimited") {
      currentStats = stats.value.classic;
      modeName = "Classic";
    } else if (
      currentMode === "ability" ||
      currentMode === "abilityUnlimited"
    ) {
      currentStats = stats.value.ability;
      modeName = "Ability";
    } else {
      throw createError("Invalid mode");
    }
    const { plays, wins, guesses, streak, maxStreak } = currentStats;

    const totalWeightedGuesses = guesses.reduce((acc, curr, index) => {
      return acc + curr * (index + 1);
    }, 0);

    const averageGuesses = wins > 0 ? totalWeightedGuesses / wins : 0;

    const shareMessage = `My #Framedle statistics for ${modeName}:
    ⚔️ Games Played: ${plays}
    👑 Games Won: ${wins}
    🎯 Average Guesses: ${averageGuesses.toFixed(2)}
    🔥 Current Streak: ${streak}
    🚀 Max Streak: ${maxStreak}

    https://framedle.com${route.path}
    `;
    copy(shareMessage);
  }

  return {
    statsCopied: copied,
    shareText,
    handleStatsShare,
    generateGridGameMatrix,
  };
}
