import type { Warframe } from "#shared/schemas/warframe";

export function useShare() {
  const emojis: {
    incorrect: string;
    correct: string;
    lower: string;
    higher: string;
    unused: string;
  } = {
    incorrect: "🟥",
    correct: "🟩",
    lower: "🔽",
    higher: "🔼",
    unused: "◻️",
  };

  const emojiFeedback = ref<string[]>([]);

  const { guessedItems, itemToGuess, attempts, currentDay } =
    storeToRefs(useGameStore());
  const { defaultAttempts } = useGameStore();

  const { hasWon } = useGameState();
  const mode = useGameMode();

  const { encode } = useEncoder();

  const route = useRoute();
  const { copy, copied } = useClipboard();

  function generateClassicEmojiFeedback(
    correctItem: Warframe,
    guessedItem: Warframe,
  ) {
    const gridRow: string[] = [];

    if (correctItem.sex !== guessedItem.sex) {
      gridRow.push(emojis.incorrect);
    } else {
      gridRow.push(emojis.correct);
    }

    if (correctItem.health !== guessedItem.health) {
      gridRow.push(
        correctItem.health > guessedItem.health ? emojis.higher : emojis.lower,
      );
    } else {
      gridRow.push(emojis.correct);
    }
    if (correctItem.shield !== guessedItem.shield) {
      gridRow.push(
        correctItem.shield > guessedItem.shield ? emojis.higher : emojis.lower,
      );
    } else {
      gridRow.push(emojis.correct);
    }
    if (correctItem.progenitor !== guessedItem.progenitor) {
      gridRow.push(emojis.incorrect);
    } else {
      gridRow.push(emojis.correct);
    }
    if (correctItem.releaseDate !== guessedItem.releaseDate) {
      gridRow.push(
        correctItem.releaseDate > guessedItem.releaseDate
          ? emojis.higher
          : emojis.lower,
      );
    } else {
      gridRow.push(emojis.correct);
    }
    return gridRow.join("");
  }

  function handleShareClick() {
    const currentMode = mode.value;
    if (!currentMode) throw createError("Mode is not set");
    if (currentMode === "ability" || currentMode === "abilityUnlimited") {
      guessedItems.value[currentMode].forEach((guessedItem) => {
        if (guessedItem.name === itemToGuess.value[currentMode]?.belongsTo) {
          emojiFeedback.value.push(emojis.correct);
        } else {
          emojiFeedback.value.push(emojis.incorrect);
        }
      });
      emojiFeedback.value = emojiFeedback.value.concat(
        new Array(attempts.value[currentMode]).fill(emojis.unused),
      );
    }
    if (currentMode === "classic" || currentMode === "classicUnlimited") {
      const correctItem = itemToGuess.value[currentMode];
      guessedItems.value[currentMode].forEach((guessedItem) => {
        if (correctItem) {
          emojiFeedback.value.push(
            generateClassicEmojiFeedback(correctItem, guessedItem),
          );
        }
      });
    }

    //! As more game modes are added, this will need to be updated
    const emojiGrid =
      route.name === "classic"
        ? emojiFeedback.value.join("\n")
        : emojiFeedback.value.join(" ");

    const attemptsUsed = defaultAttempts - attempts.value[currentMode];

    const topText = route.query.mode
      ? hasWon.value
        ? `I solved a Framedle in ${attemptsUsed} out of ${defaultAttempts} turns.`
        : `I couldn't solve this Framedle in ${defaultAttempts} turns.`
      : `Framedle ${currentMode} #${currentDay.value} ${hasWon.value ? attemptsUsed : "X"}/${defaultAttempts}`;

    const grid = `
${topText}
      
${emojiGrid}
${
  route.query.mode
    ? `See how you do on the same challenge I played:
${window.location.href}&x=${itemToGuess.value[currentMode] && encode(itemToGuess.value[currentMode].name)}`
    : window.location.href
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

  return { handleShareClick, copied, handleStatsShare };
}
