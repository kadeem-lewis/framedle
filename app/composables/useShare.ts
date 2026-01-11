export function useShare() {
  const emojis: {
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
  };

  const emojiFeedback = ref<string[]>([]);

  const { guessedItems, itemToGuess, attempts } = storeToRefs(useGameStore());
  const { DEFAULT_ATTEMPTS } = useGameStore();
  const {
    currentDailyClassicData,
    currentDailyGridData,
    currentDailyAbilityData,
  } = storeToRefs(useDailiesStore());

  const { mode, gameVariant, gameType } = useGameMode();
  const { hasWon } = storeToRefs(useGameStateStore());

  const { encode } = useEncoder();

  const route = useRoute();
  const { copy, copied } = useClipboard();
  const { checkGuess } = useGuess();

  function generateClassicEmojiFeedback(
    correctItem: Warframe,
    guessedItem: Warframe,
  ) {
    const gridRow: string[] = [];

    gridRow.push(
      emojis[checkGuess(correctItem.sex, guessedItem.sex)],
      emojis[checkGuess(correctItem.variant, guessedItem.variant)],
      emojis[
        checkGuess([...correctItem.playstyle], [...guessedItem.playstyle])
      ],
      emojis[checkGuess(correctItem.health, guessedItem.health)],
      emojis[checkGuess(correctItem.shield, guessedItem.shield)],
      emojis[checkGuess(correctItem.progenitor, guessedItem.progenitor)],
      emojis[
        checkGuess(
          parseReleaseDate(correctItem.releaseDate),
          parseReleaseDate(guessedItem.releaseDate),
        )
      ],
    );

    return gridRow.join("");
  }

  const { daily, gameScore, rarityScore } = storeToRefs(useGridGameStore());

  function generateGridGameFeedback() {
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

  const modeActionMap = computed(() => ({
    classic: emojiFeedback.value.join("\n"),
    ability: emojiFeedback.value.join(" "),
    grid: emojiFeedback.value.join("\n"),
  }));

  function handleShareClick() {
    const currentMode = mode.value;
    if (!currentMode) throw createError("Mode is not set or not a legacy mode");
    let attemptsUsed: number = 0;

    if (currentMode === "ability" || currentMode === "abilityUnlimited") {
      guessedItems.value[currentMode].forEach((guessedItem) => {
        if (!itemToGuess.value[currentMode]?.belongsTo) return;
        emojiFeedback.value.push(
          emojis[
            checkGuess(itemToGuess.value[currentMode]?.belongsTo, guessedItem)
          ],
        );
      });
      emojiFeedback.value = emojiFeedback.value.concat(
        new Array(attempts.value[currentMode]).fill(emojis.unused),
      );
      attemptsUsed = DEFAULT_ATTEMPTS - attempts.value[currentMode];
    }
    if (currentMode === "classic" || currentMode === "classicUnlimited") {
      const correctItem = itemToGuess.value[currentMode];
      guessedItems.value[currentMode].forEach((guessedItem) => {
        if (correctItem) {
          emojiFeedback.value.push(
            generateClassicEmojiFeedback(
              getWarframe(correctItem),
              getWarframe(guessedItem),
            ),
          );
        }
      });
      attemptsUsed = DEFAULT_ATTEMPTS - attempts.value[currentMode];
    }
    if (currentMode === "grid") {
      const shareGrid = generateGridGameFeedback();
      shareGrid.forEach((row) => {
        const rowEmojis = row
          .map((cell) => (cell === 1 ? emojis.correct : emojis.unused))
          .join("");
        emojiFeedback.value.push(rowEmojis);
      });
    }

    //! As more game modes are added, this will need to be updated
    const emojiGrid = modeActionMap.value[gameType.value!];

    let topText = "";

    if (gameVariant.value === "unlimited") {
      topText = hasWon.value
        ? `I solved a Framedle in ${attemptsUsed} out of ${DEFAULT_ATTEMPTS} turns.`
        : `I couldn't solve this Framedle in ${DEFAULT_ATTEMPTS} turns.`;
    } else {
      if (gameType.value === "grid") {
        topText = `Framedle Grid #${currentDailyGridData.value?.day} ${gameScore.value}/${9}\nUniqueness: ${rarityScore.value}`;
      } else {
        topText = `Framedle ${currentMode} #${gameType.value === "classic" ? currentDailyClassicData.value?.day : currentDailyAbilityData.value?.day} ${hasWon.value ? attemptsUsed : "X"}/${DEFAULT_ATTEMPTS}`;
      }
    }

    const encodedAnswer = computed(() => {
      if (
        mode.value === "classicUnlimited" &&
        itemToGuess.value["classicUnlimited"]
      ) {
        return encode(itemToGuess.value["classicUnlimited"]);
      }
      if (
        mode.value === "abilityUnlimited" &&
        itemToGuess.value["abilityUnlimited"]
      ) {
        return encode(itemToGuess.value["abilityUnlimited"].name);
      }
      return;
    });

    const shareUrl = window.location.origin + window.location.pathname;

    const grid = `
${topText}
      
${emojiGrid}
${
  gameVariant.value === "unlimited"
    ? `See how you do on the same challenge I played:
${shareUrl}?x=${encodedAnswer.value}`
    : shareUrl
}
        `;
    copy(grid);
    emojiFeedback.value = [];
  }

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
    handleShareClick,
    copied,
    handleStatsShare,
    generateGridGameFeedback,
  };
}
