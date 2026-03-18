import { format } from "date-fns";

export function useShareText() {
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
  const { getTodaysDailies } = useDailiesStore();

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

  function generateGridGameMatrix(
    gridState: Record<string, GridCell> = daily.value.grid,
  ) {
    const SIZE = 3;
    const shareGrid: number[][] = Array.from({ length: SIZE }, () =>
      Array(SIZE).fill(0),
    );

    if (!gridState) return shareGrid;

    for (const [key, cell] of Object.entries(gridState)) {
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

  function generateClassicEmojiBlock(
    targetWarframe: WarframeName,
    guessedItems: WarframeName[],
  ) {
    return guessedItems
      .map((guessed) =>
        getClassicRow(getWarframe(targetWarframe), getWarframe(guessed)),
      )
      .join("\n");
  }
  function generateAbilityEmojiBlock(
    targetWarframe: WarframeName,
    guessedItems: WarframeName[],
    attempts: number,
  ) {
    const playedEmojis = guessedItems.map(
      (guessed) => EMOJIS[checkGuess(targetWarframe, guessed)],
    );

    const emptyEmojis = Array(attempts).fill(EMOJIS.unused);
    return [...playedEmojis, ...emptyEmojis].join(" ");
  }
  function generateGridEmojiBlock(
    gridState: Record<string, GridCell> = daily.value.grid,
  ) {
    const rawGrid = generateGridGameMatrix(gridState);
    return rawGrid
      .map((row) =>
        row
          .map((cell) => (cell === 1 ? EMOJIS.correct : EMOJIS.unused))
          .join(""),
      )
      .join("\n");
  }

  const emojiBlock = computed(() => {
    const currentMode = mode.value;
    if (!currentMode) return "";

    if (currentMode === "grid") {
      return generateGridEmojiBlock();
    }

    if (currentMode === "ability" || currentMode === "abilityUnlimited") {
      const target = itemToGuess.value[currentMode]?.belongsTo;

      if (!target) return "";

      return generateAbilityEmojiBlock(
        target,
        guessedItems.value[currentMode],
        attempts.value[currentMode],
      );
    }

    if (currentMode === "classic" || currentMode === "classicUnlimited") {
      const target = itemToGuess.value[currentMode];
      if (!target) return "";
      return generateClassicEmojiBlock(target, guessedItems.value[currentMode]);
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

  const shareAllText = async () => {
    const { classic, ability, grid } = await getTodaysDailies();
    const sections = [];

    if (classic?.state) {
      sections.push(
        `Classic #${classic.day}: \n${generateClassicEmojiBlock(
          classic.itemToGuess,
          classic.guessedItems,
        )}`,
      );
    }
    if (ability?.state) {
      sections.push(
        `Ability #${ability.day}: \n${generateAbilityEmojiBlock(
          ability.itemToGuess.belongsTo,
          ability.guessedItems,
          ability.attempts,
        )}`,
      );
    }
    if (grid?.state) {
      //TODO: These two values use the same exact calculations as gridGame store so I need to refactor in the future
      const score = Object.values(grid.gridState).filter(
        (cell) => cell.value,
      ).length;

      const usedRarityScores = Object.values(grid.gridState)
        .filter((cell) => cell.rarity)
        .reduce((acc, cell) => acc + (100 - (cell.rarity || 0)), 0);

      sections.push(
        `Grid #${grid.day}:\n${generateGridEmojiBlock(grid.gridState)}\nScore: ${score}/9\nUniqueness: ${formatFloat(900 - usedRarityScores)}`,
      );
    }
    const today = format(new Date(), "yyyy-MM-dd");

    return [
      `My Framedle Results for ${today}`,
      ...sections,
      window.location.origin,
    ].join("\n\n");
  };

  const { stats } = storeToRefs(useStatsStore());

  function handleStatsShare() {
    if (!mode.value) return;
    const currentMode = mode.value;
    let modeName = "";
    let modeMessages: string[] = [];
    if (isLegacyMode(currentMode) && gameType.value) {
      const { plays, wins, guesses, streak, maxStreak } =
        stats.value[gameType.value as "classic" | "ability"];
      modeName = capitalize(gameType.value);
      const totalWeightedGuesses = guesses.reduce((acc, curr, index) => {
        return acc + curr * (index + 1);
      }, 0);
      const averageGuesses = wins > 0 ? totalWeightedGuesses / wins : 0;

      modeMessages = [
        `⚔️ Games Played: ${plays}`,
        `👑 Games Won: ${wins}`,
        `🎯 Average Guesses: ${averageGuesses.toFixed(2)}`,
        `🔥 Current Streak: ${streak}`,
        `🚀 Max Streak: ${maxStreak}`,
      ];
    } else if (currentMode === "grid" || currentMode === "gridUnlimited") {
      const { plays, averageScore, streak, maxStreak } = stats.value.grid;
      modeName = "Grid";
      modeMessages = [
        `⚔️ Games Played: ${plays}`,
        `🎯 Average Score: ${averageScore?.toFixed(2) ?? "0.00"}`,
        `🔥 Current Streak: ${streak}`,
        `🚀 Max Streak: ${maxStreak}`,
      ];
    } else {
      throw createError("Invalid mode");
    }

    const shareMessage = [
      `My #Framedle statistics for ${modeName}:`,
      "",
      ...modeMessages,
      "",
      `https://framedle.com${route.path}`,
    ].join("\n");

    copy(shareMessage);
  }

  return {
    statsCopied: copied,
    shareText,
    shareAllText,
    handleStatsShare,
    generateGridGameMatrix,
  };
}
